import { useLoaderData } from "react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "@/lib/utils";
import type { Route } from "./+types/details";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData
        ? `Former | ${loaderData._title}`
        : "Former | Form Detail",
    },
    {
      name: "description",
      content: loaderData?._description || "Form detail.",
    },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const token = getCookie("accessToken");
  const id = params.id;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const response = await fetch(`${apiUrl}/forms/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 404) {
    throw new Response("Form not found", { status: 404 });
  }

  if (!response.ok) {
    throw new Error("Failed to fetch form details");
  }

  const data = await response.json();

  return data.form;
}

interface Question {
  id: string | number;
  question: string;
}

export default function FormDetail() {
  const form = useLoaderData<typeof clientLoader>();

  if (!form) {
    return <div className="p-8 text-center">Form not found.</div>;
  }

  return (
    <main className="pt-16 flex flex-col">
      <div className="flex items-center justify-between mx-auto max-w-4xl w-full p-6 border-b">
        <div className="flex flex-col justify-center w-full items-center gap-4">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-3xl font-bold text-primary">{form._title}</p>
            <p className="text-primary">{form._description}</p>
          </div>
          <p className="text-secondary flex items-center gap-2">
            {form.response || 0} total responses
          </p>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto flex flex-col gap-4 my-4">
        {form.questions && form.questions.length > 0 ? (
          form.questions.map((question: Question, index: number) => (
            <Card key={question.id || index} className="rounded-md bg-white/60">
              <CardHeader>
                <CardTitle className="text-xl">
                  {index + 1}. {question.question}
                </CardTitle>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card className="rounded-md bg-white/60">
            <CardHeader>
              <CardTitle className="text-xl text-center opacity-60">
                No questions have been added yet
              </CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>
    </main>
  );
}
