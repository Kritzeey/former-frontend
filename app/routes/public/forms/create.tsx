import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useNavigate, redirect } from "react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { getApiUrl, getCookie } from "~/lib/utils";
import type { Route } from "./+types/create";

export function meta() {
  return [
    { title: "Former | Create Form" },
    { name: "description", content: "Create a new form." },
  ];
}

export async function clientLoader() {
  const token = getCookie("accessToken");

  if (!token) {
    return redirect("/log-in");
  }

  const formsUrl = getApiUrl("/api/forms");

  try {
    const response = await fetch(formsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    return null;
  } catch (error) {
    return redirect("/log-in");
  }
}

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type CreateFormDto = z.infer<typeof createFormSchema>;

export default function CreateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormDto>({
    resolver: zodResolver(createFormSchema),
  });

  const onSubmit = async (data: CreateFormDto) => {
  setIsLoading(true);
  try {
    const token = getCookie("accessToken");
    const response = await fetch(getApiUrl("/api/forms"), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    // redirect to the edit page where the ID is now valid
    navigate(`/forms/${result.form.id}/edit`); 
  } catch (error) {
    toast.error("Failed to create form");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="w-full h-dvh flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg rounded-md">
        <CardHeader className="flex flex-col gap-2 items-center">
          <CardTitle className="text-2xl font-bold text-center">
            Create Form
          </CardTitle>

          <CardDescription className="text-sm text-center text-muted-foreground">
            Build a new form to collect responses
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="title"
                className={errors.title ? "text-red-500" : ""}
              >
                Title
              </Label>
              <Input
                className={
                  errors.title
                    ? "border-red-500 focus-visible:ring-red-500 rounded-md placeholder:text-muted-foreground/60"
                    : "rounded-md placeholder:text-muted-foreground/60"
                }
                id="title"
                type="text"
                placeholder="My Form Title"
                disabled={isLoading}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="description"
                className={errors.description ? "text-red-500" : ""}
              >
                Description
              </Label>
              <Input
                className={
                  errors.description
                    ? "border-red-500 focus-visible:ring-red-500 rounded-md placeholder:text-muted-foreground/60"
                    : "rounded-md placeholder:text-muted-foreground/60"
                }
                id="description"
                type="text"
                placeholder="Form description or instructions"
                disabled={isLoading}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              className="rounded-md w-full mt-2 hover:opacity-90 cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
