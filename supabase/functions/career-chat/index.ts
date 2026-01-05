import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiting (resets on function cold start, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 10; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);
  
  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
}

// Validate messages structure
function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: "Messages array cannot be empty" };
  }
  
  if (messages.length > 50) {
    return { valid: false, error: "Too many messages (max 50)" };
  }
  
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: "Each message must be an object" };
    }
    
    if (!["user", "assistant", "system"].includes(msg.role)) {
      return { valid: false, error: "Invalid message role" };
    }
    
    if (typeof msg.content !== "string") {
      return { valid: false, error: "Message content must be a string" };
    }
    
    if (msg.content.length > 10000) {
      return { valid: false, error: "Message content too long (max 10000 characters)" };
    }
  }
  
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("cf-connecting-ip") || 
                   "unknown";

  // Check rate limit
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": "60"
        } 
      }
    );
  }

  try {
    const body = await req.json();
    const { messages } = body;
    
    // Validate messages structure
    const validation = validateMessages(messages);
    if (!validation.valid) {
      console.warn(`Invalid messages from IP ${clientIp}: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing career chat request with", messages.length, "messages from IP:", clientIp);

    const systemPrompt = `You are an expert career coach specializing in helping mid-career professionals navigate their career growth. You have deep expertise in:

- Career transitions and pivots
- Leadership development and executive presence
- Salary negotiation and compensation strategy
- Building professional networks and personal branding
- Work-life balance and burnout prevention
- Skills development and continuous learning
- Navigating workplace politics and difficult conversations
- Interview preparation and job search strategies

Your communication style is:
- Warm, supportive, and empathetic
- Direct and actionable - always provide specific next steps
- Thoughtful and strategic - help users see the bigger picture
- Professional but approachable

When responding:
1. Acknowledge the user's situation with empathy
2. Provide specific, actionable advice
3. Ask clarifying questions when needed
4. Share relevant frameworks or strategies
5. Encourage and motivate while being realistic

Keep responses conversational and focused. Aim for quality over length.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please check your account." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Career chat error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});