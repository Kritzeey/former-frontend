import FormCard from "~/components/form-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
import { getCookie, getApiUrl } from "~/lib/utils";
import { useState, useEffect } from "react";
import type { Route } from "./+types/list";

export function meta() {
  return [
    { title: "Former | Forms List" },
    { name: "description", content: "Forms list." },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const token = getCookie("accessToken");
  const url = new URL(request.url);

  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const sortBy = url.searchParams.get("sortBy") || "desc";

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (sortBy) params.append("sortBy", sortBy);

  const formsUrl = getApiUrl(`/api/forms?${params.toString()}`);
  const authUrl = getApiUrl("/api/auth/me");

  const [formsResponse, userResponse] = await Promise.all([
    fetch(formsUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
    token
      ? fetch(authUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      : Promise.resolve(null),
  ]);

  if (!formsResponse.ok) throw new Error("Failed to fetch forms");

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleRemoveForm = (idToRemove: string | number) => {
    setLocalForms((prevForms) => prevForms.filter((f) => f.id !== idToRemove));
  };

  useEffect(() => {
    setLocalForms(forms);
  }, [forms]);

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <main className="pt-16 h-full w-full flex">
      <div className="grid grid-cols-5 w-full h-full">
        <div className="col-span-1 border-r h-full p-4 flex flex-col gap-6">
          <Link to="/forms/create" className="w-full">
            <Button className="cursor-pointer hover:opacity-90 w-full rounded-md">
              Create a Form
            </Button>
          </Link>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search title..."
                defaultValue={searchParams.get("search") || ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleFilterChange("search", e.currentTarget.value);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                onValueChange={(v) => handleFilterChange("status", v)}
                defaultValue={searchParams.get("status") || "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Sort By Date</label>
              <Select
                onValueChange={(v) => handleFilterChange("sortBy", v)}
                defaultValue={searchParams.get("sortBy") || "desc"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-4 col-span-4 h-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            {localForms.length === 0 ? (
              <div className="text-center text-muted-foreground mt-10">
                No forms found match your criteria.
              </div>
            ) : (
              localForms.map((form: any) => (
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
