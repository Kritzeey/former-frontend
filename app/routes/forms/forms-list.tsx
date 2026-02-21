import FormCard from "~/components/form-card";
import { forms } from "~/constants/forms";

export default function FormsList() {
  return (
    <main className="h-screen w-full flex flex-col gap-4 mt-16">
      <div className="grid grid-cols-5 h-full">
        <div className="col-span-1"></div>
        <div className="flex flex-col col-span-4 bg-white h-full p-6 gap-4">
          {forms.map((form) => (
            <FormCard
              id={form.id}
              questions={form.questions}
              responses={form.responses}
              title={form.title}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
