import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { Route } from "./+types/sign-up";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Former | Sign Up" },
    { name: "description", content: "Create a new account." },
  ];
}

export const signUpSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password before signing up"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpDto = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpDto>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpDto) => {
    setIsLoading(true);

    try {
      const { confirmPassword, ...serverPayload } = data;
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "";

        const match = errorMessage.match(/^\[Err:\s*([^\]]+)\]\s*(.*)$/);

        if (match) {
          const field = match[1] as keyof SignUpDto;
          const message = match[2];

          setError(field, { type: "server", message });
          return;
        }

        throw new Error(errorMessage || "Something went wrong");
      }

      const responseData = await response.json();

      if (responseData.token) {
        document.cookie = `accessToken=${responseData.token}; path=/; max-age=86400; SameSite=Strict`;
      }

      toast.success("Account created successfully");

      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full h-dvh flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg rounded-md">
        <CardHeader className="flex flex-col gap-2 items-center">
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>

          <CardDescription className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline hover:opacity-60" to="/log-in">
              Log in
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="username"
                className={errors.username ? "text-red-500" : ""}
              >
                Username
              </Label>
              <Input
                id="username"
                disabled={isLoading}
                className={
                  errors.username
                    ? "border-red-500 focus-visible:ring-red-500 rounded-md placeholder:text-muted-foreground/60"
                    : "rounded-md placeholder:text-muted-foreground/60"
                }
                {...register("username")}
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className={errors.password ? "text-red-500" : ""}
              >
                Password
              </Label>
              <Input
                className={
                  errors.password
                    ? "border-red-500 focus-visible:ring-red-500 rounded-md placeholder:text-muted-foreground/60"
                    : "rounded-md placeholder:text-muted-foreground/60"
                }
                id="password"
                type="password"
                placeholder="●●●●●●●●"
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="confirmPassword"
                className={errors.confirmPassword ? "text-red-500" : ""}
              >
                Confirm Password
              </Label>
              <Input
                className={
                  errors.confirmPassword
                    ? "border-red-500 focus-visible:ring-red-500 rounded-md placeholder:text-muted-foreground/60"
                    : "rounded-md placeholder:text-muted-foreground/60"
                }
                id="confirmPassword"
                type="password"
                placeholder="●●●●●●●●"
                disabled={isLoading}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              className="cursor-pointer rounded-md w-full mt-4"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
