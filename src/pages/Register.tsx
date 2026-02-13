import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "user" as "user" | "owner" | "agent",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register(formData);
      toast.success("Registration successful! Welcome to Mentawai Shores.");
      navigate("/");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <SEO
        title="Create Account"
        description="Join Mentawai Shores and discover your dream property"
      />

      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm">Back to home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="font-body text-muted-foreground">
              Start your island property journey today
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Account Type
                </Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl border border-border bg-background px-4 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="user">Buyer/Renter</option>
                  <option value="owner">Property Owner</option>
                  <option value="agent">Real Estate Agent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  minLength={8}
                  className="h-12 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password_confirmation"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  minLength={8}
                  className="h-12 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="font-body text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="font-body text-xs text-muted-foreground mb-3">
              Join 100+ property seekers
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-body text-xs text-muted-foreground">
                  Free
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-body text-xs text-muted-foreground">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-body text-xs text-muted-foreground">
                  Secure
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
