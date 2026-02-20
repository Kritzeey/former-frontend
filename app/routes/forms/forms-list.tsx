import FormCard from "~/components/form-card";

const forms = [
  {
    title: "Event Registration Form",
    questions: 4,
    responses: 2,
    question_list: [
      { id: 1, label: "Are you attending this event?", type: "boolean" },
      {
        id: 2,
        label: "Are you willing to join this event from start to finish?",
        type: "boolean",
      },
      {
        id: 3,
        label: "Do you have any dietary restrictions?",
        type: "checkbox",
      },
      { id: 4, label: "T-shirt size", type: "dropdown" },
    ],
  },
  {
    title: "Customer Satisfaction Survey",
    questions: 4,
    responses: 24,
    question_list: [
      { id: 1, label: "How would you rate your experience?", type: "scale" },
      {
        id: 2,
        label: "What is the primary reason for your score?",
        type: "paragraph",
      },
      { id: 3, label: "Would you recommend us to a friend?", type: "boolean" },
      {
        id: 4,
        label: "Which product did you purchase?",
        type: "multiple_choice",
      },
    ],
  },
  {
    title: "Short Quiz",
    questions: 4,
    responses: 56,
    question_list: [
      {
        id: 1,
        label: "What is the capital of France?",
        type: "multiple_choice",
      },
      { id: 2, label: "Solve: 2 + 2 * 2", type: "short_answer" },
      { id: 3, label: "Select all primary colors", type: "checkbox" },
      { id: 4, label: "True or False: The earth is flat.", type: "boolean" },
    ],
  },
  {
    title: "Volunteer Sign-Up",
    questions: 4,
    responses: 2,
    question_list: [
      { id: 1, label: "Full Name", type: "short_answer" },
      { id: 2, label: "Availability (Days of the week)", type: "checkbox" },
      { id: 3, label: "Previous volunteer experience", type: "paragraph" },
      { id: 4, label: "Emergency contact number", type: "short_answer" },
    ],
  },
  {
    title: "Quick Review Session",
    questions: 4,
    responses: 42,
    question_list: [
      { id: 1, label: "Was the material covered clearly?", type: "scale" },
      {
        id: 2,
        label: "Which topic was most difficult?",
        type: "multiple_choice",
      },
      { id: 3, label: "Do you need a follow-up session?", type: "boolean" },
      { id: 4, label: "Any additional comments?", type: "paragraph" },
    ],
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
