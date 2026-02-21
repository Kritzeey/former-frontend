import { useParams, Link } from "react-router";
import { forms } from "~/constants/forms";

export default function FormDetails() {
  const { id } = useParams();

  const selected = forms.find((form) => form.id === id);

  if (!selected) {
    return <div></div>;
  }

  return (
    <main className="mt-16 p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-[#3373C4] mb-2">
        {selected.title}
      </h1>
      <p className="text-gray-600 mb-8">
        {selected.questions} Questions&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        {selected.responses} Total Responses
      </p>

      <div className="bg-white p-6 flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Question List</h2>

        {selected.question_list.length > 0 ? (
          selected.question_list.map((q, index) => (
            <div className="p-4 bg-gray-100">
              <div className="flex gap-4">
                <span className="font-medium text-lg">
                  <span className="text-[#3373C4]">{index + 1}.</span> {q.label}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">
            No questions added to this form yet.
          </p>
        )}
      </div>
    </main>
  );
}
