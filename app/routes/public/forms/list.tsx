import FormCard from "@/components/form-card";
import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router";
import { getCookie } from "@/lib/utils";
import { useState } from "react";
import type { Route } from "./+types/list";

export function meta() {
  return [
    { title: "Former | Forms List" },
    { name: "description", content: "Forms list." },
  ];
}

export async function clientLoader() {
  const token = getCookie("accessToken");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [formsResponse, userResponse] = await Promise.all([
    fetch(`${apiUrl}/forms`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
    token
      ? fetch(`${apiUrl}/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      : Promise.resolve(null),
  ]);

  if (!formsResponse.ok) {
    throw new Error("Failed to fetch forms");
  }

  const formsData = await formsResponse.json();
  let user = null;

  if (userResponse && userResponse.ok) {
    const userData = await userResponse.json();
    user = userData.user;
  }

  return { forms: formsData.forms, user };
}

interface Form {
  id: string | number;
  _title: string;
  response?: number;
  userId?: string;
  questions?: any[];
}

export default function Forms() {
  const { forms, user } = useLoaderData<typeof clientLoader>();
  const [localForms, setLocalForms] = useState<Form[]>(forms);

  const handleRemoveForm = (idToRemove: string | number) => {
    setLocalForms((prevForms) => prevForms.filter((f) => f.id !== idToRemove));
  };

  return (
    <main className="pt-16 h-full w-full items-center justify-center flex">
      <div className="grid grid-cols-5 w-full h-full">
        <div className="col-span-1 border-r h-full p-4 flex flex-col gap-2">
          <Link to="/forms/create" className="w-full">
            <Button className="cursor-pointer hover:opacity-90 w-full rounded-md">
              Create a Form
            </Button>
          </Link>
        </div>

        <div className="p-4 col-span-4 h-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            {localForms.length === 0 ? (
              <div className="text-center text-muted-foreground mt-10">
                No forms found. Create one to get started!
              </div>
            ) : (
              localForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  isOwner={user?.id === form.userId}
                  onDeleteSuccess={handleRemoveForm}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
