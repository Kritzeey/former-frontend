import FormCard from "~/components/form-card";

let forms = [
  {
    title: "Event Registration Form",
    questions: 10,
    responses: 2,
  },
  {
    title: "Customer Satisfaction Survey",
    questions: 10,
    responses: 24,
  },
  {
    title: "Short Quiz",
    questions: 10,
    responses: 56,
  },
  {
    title: "Volunteer Sign-Up",
    questions: 10,
    responses: 2,
  },
  {
    title: "Quick Review Session",
    questions: 10,
    responses: 42,
  },
];

export default function FormsList() {
  return (
    <main className="h-screen w-full flex flex-col gap-4 mt-16">
      <div className="grid grid-cols-5 h-full">
        <div className="col-span-1"></div>
        <div className="flex flex-col col-span-4 bg-white h-full p-6 gap-4">
          {forms.map((form) => (
            <FormCard
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
