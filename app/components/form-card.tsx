import { Link } from "react-router";

interface Props {
  id: string;
  title: string;
  questions: number;
  responses: number;
}

export default function FormCard({ id, title, questions, responses }: Props) {
  return (
    <div className="flex justify-between items-center hover:bg-[#F2F2F2] rounded-md duration-200 w-full py-2 px-4 text-2xl font-medium text-[#3373C4]">
      <div className="flex flex-col ">
        <div>{title}</div>
        <div className="text-sm text-[#121212] font-medium">
          {questions} Questions&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{responses}{" "}
          Responses
        </div>
      </div>

      <Link to={`/forms/${id}`}>
        <button className="p-2 hover:opacity-80 duration-200 rounded-sm cursor-pointer text-sm text-[#F2F2F2] bg-[#3373C4]">
          Details
        </button>
      </Link>
    </div>
  );
}
