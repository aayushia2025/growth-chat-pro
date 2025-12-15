import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const waitlistSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  roleType: z.enum(["student", "job-searching", "full-time"], { required_error: "Please select your current role" }),
  company: z.string().trim().max(100).optional(),
  careerGoals: z.array(z.string()).min(1, { message: "Please select at least one goal" }),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "job-searching", label: "Job searching" },
  { value: "full-time", label: "Full-time job" },
];

const goalOptions = [
  { value: "land-job", label: "Land a job" },
  { value: "change-role-company", label: "Change role/company" },
  { value: "career-success", label: "Career success in current role" },
  { value: "max-potential", label: "Reach my max potential" },
];

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      fullName: "",
      roleType: undefined,
      company: "",
      careerGoals: [],
    },
  });

  const selectedRole = form.watch("roleType");
  const showCompanyField = selectedRole === "full-time";

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: data.email,
        full_name: data.fullName,
        role_type: data.roleType,
        company: data.company || null,
        career_goals: data.careerGoals,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already registered",
            description: "This email is already on our waitlist!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setIsSuccess(false);
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card">
        {isSuccess ? (
          <div className="flex flex-col items-center py-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="font-serif text-2xl mb-2">You're on the list!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              We'll notify you when Mentor is ready for you.
            </DialogDescription>
            <Button onClick={handleClose} className="mt-6">
              Got it
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <DialogTitle className="font-serif text-xl">Join the Waitlist</DialogTitle>
              </div>
              <DialogDescription>
                Be among the first to experience AI-powered career mentorship.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register("email")}
                  className="bg-background"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...form.register("fullName")}
                  className="bg-background"
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              {/* Current Role */}
              <div className="space-y-3">
                <Label>Current Role</Label>
                <RadioGroup
                  value={form.watch("roleType")}
                  onValueChange={(value) => form.setValue("roleType", value as WaitlistFormData["roleType"])}
                  className="space-y-2"
                >
                  {roleOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {form.formState.errors.roleType && (
                  <p className="text-sm text-destructive">{form.formState.errors.roleType.message}</p>
                )}
              </div>

              {/* Company (conditional) */}
              {showCompanyField && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Your company"
                    {...form.register("company")}
                    className="bg-background"
                  />
                </div>
              )}

              {/* Career Goals */}
              <div className="space-y-3">
                <Label>Career Goals (next 2-5 years)</Label>
                <div className="space-y-2">
                  {goalOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={option.value}
                        checked={form.watch("careerGoals").includes(option.value)}
                        onCheckedChange={(checked) => {
                          const current = form.getValues("careerGoals");
                          if (checked) {
                            form.setValue("careerGoals", [...current, option.value]);
                          } else {
                            form.setValue("careerGoals", current.filter((v) => v !== option.value));
                          }
                        }}
                      />
                      <Label htmlFor={option.value} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.careerGoals && (
                  <p className="text-sm text-destructive">{form.formState.errors.careerGoals.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-accent hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
