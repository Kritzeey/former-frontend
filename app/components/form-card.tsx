interface Props {
  title: string;
  questions: number;
  responses: number;
}

export default function FormCard({ title, questions, responses }: Props) {
  return (
    <div className="flex flex-col hover:bg-[#f2f2f2] rounded-md duration-200 cursor-pointer w-full py-2 px-4 text-2xl font-medium text-[#3373C4]">
      <div>{title}</div>
      <div className="text-sm text-[#121212] font-medium">
        {questions} Questions&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{responses}{" "}
        Responses
      </div>
    </div>
  );
}
