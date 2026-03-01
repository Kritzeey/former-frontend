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
import { useNavigate, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { getCookie } from "@/lib/utils";
import type { Route } from "./+types/edit";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.form?._title
        ? `Former | Edit ${loaderData.form._title}`
        : "Former | Edit Form",
    },
    { name: "description", content: "Edit an existing form." },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const token = getCookie("accessToken");

  if (!token) {
    return redirect("/log-in");
  }

  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

    const [userResponse, formResponse] = await Promise.all([
      fetch(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiUrl}/forms/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!userResponse.ok) throw new Error("Invalid token");
    if (formResponse.status === 404)
      throw new Response("Not Found", { status: 404 });
    if (!formResponse.ok) throw new Error("Failed to fetch form");

    const userData = await userResponse.json();
    const formData = await formResponse.json();

    if (userData.user.id !== formData.form.userId) {
      toast.error("You are not authorized to edit this form.");
      return redirect(`/forms`);
    }

    return { form: formData.form };
  } catch (error) {
    if (error instanceof Response) throw error;
    return redirect("/log-in");
  }
}

export const editFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type EditFormDto = z.infer<typeof editFormSchema>;

export default function EditForm() {
  const { form } = useLoaderData<typeof clientLoader>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormDto>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: form._title,
      description: form._description,
    },
  });

  const onSubmit = async (data: EditFormDto) => {
    setIsLoading(true);

    try {
      const token = getCookie("accessToken");
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";

      const response = await fetch(`${apiUrl}/forms/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      toast.success("Form updated successfully");
      navigate("/forms");
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
            Edit Form
          </CardTitle>

          <CardDescription className="text-sm text-center text-muted-foreground">
            Update your form details
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
