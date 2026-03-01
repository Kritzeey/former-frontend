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
import type { Route } from "./+types/log-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Former | Log In" },
    { name: "description", content: "Log in to your account." },
  ];
}

export const logInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LogInDto = z.infer<typeof logInSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LogInDto>({
    resolver: zodResolver(logInSchema),
  });

  const onSubmit = async (data: LogInDto) => {
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/auth/log-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "";

        const match = errorMessage.match(/^\[Err:\s*([^\]]+)\]\s*(.*)$/);

        if (match) {
          const fields = match[1]
            .split(",")
            .map((f: string) => f.trim()) as (keyof LogInDto)[];
          const message = match[2];

          fields.forEach((field) => {
            setError(field, { type: "server", message });
          });
          return;
        }

        throw new Error(errorMessage || "Something went wrong");
      }

      const { token } = await response.json();

      document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Strict`;

      toast.success("Logged in successfully");
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
            Log In
          </CardTitle>

          <CardDescription className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="underline hover:opacity-60" to="/sign-up">
              Sign Up
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
                className={
                  errors.username
                    ? "border-red-500 focus-visible:ring-red-500 rounded-md placeholder:text-muted-foreground/60"
                    : "rounded-md placeholder:text-muted-foreground/60"
                }
                id="username"
                type="text"
                placeholder="johndoe"
                disabled={isLoading}
                {...register("username")}
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

            <Button
              className="rounded-md w-full mt-2 hover:opacity-90 cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
