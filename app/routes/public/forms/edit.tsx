import { useState } from "react";
import { useNavigate, useLoaderData, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getApiUrl, getCookie } from "~/lib/utils";
import type { Route } from "./+types/edit";

const editFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

interface QuestionData {
  id?: string;
  type: string;
  text: string;
  options: string[];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const token = getCookie("accessToken");
  const formRes = await fetch(getApiUrl(`/api/forms/${params.id}`), {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!formRes.ok) throw new Error("Form not found");
  const data = await formRes.json();
  return { form: data.form };
}

export default function EditForm() {
  const { form } = useLoaderData<typeof clientLoader>();
  const { id } = useParams(); // THIS CAPTURES THE :ID FROM THE URL
  const [questions, setQuestions] = useState<QuestionData[]>(form.questions || []);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(editFormSchema),
    defaultValues: { title: form._title, description: form._description }
  });

  const addQuestion = () => {
    setQuestions([...questions, { type: "short_answer", text: "", options: ["Option 1"] }]);
  };

  const updateQuestion = (idx: number, field: keyof QuestionData, val: any) => {
    const next = [...questions];
    next[idx] = { ...next[idx], [field]: val };
    setQuestions(next);
  };

  const onSave = async (data: any) => {
    setIsSaving(true);
    const token = getCookie("accessToken");
    try {
      // 1. Update Metadata
      await fetch(getApiUrl(`/api/forms/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      // 2. Save Questions (Individual POSTs for simplicity)
      for (const q of questions) {
        if (!q.id) {
          await fetch(getApiUrl(`/api/forms/${id}/questions`), {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(q),
          });
        }
      }
      toast.success("Saved everything!");
      navigate("/forms");
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="w-full min-h-screen pt-20 pb-10 flex flex-col items-center gap-6 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader><CardTitle>Form Settings</CardTitle></CardHeader>
        <CardContent>
          <form id="meta-form" onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div><Label>Title</Label><Input {...register("title")} /></div>
            <div><Label>Description</Label><Input {...register("description")} /></div>
          </form>
        </CardContent>
      </Card>

      <div className="w-full max-w-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Questions</h2>
          <Button onClick={addQuestion} variant="outline" size="sm"><Plus size={16} /> Add</Button>
        </div>
        {questions.map((q, i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input value={q.text} onChange={(e) => updateQuestion(i, "text", e.target.value)} placeholder="Question" />
                <Select value={q.type} onValueChange={(v) => updateQuestion(i, "type", v)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}>
                  <Trash2 className="text-red-500" size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button form="meta-form" className="w-full" disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Save Changes
        </Button>
      </div>
    </main>
  );
}