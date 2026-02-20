import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Button({ children }: Props) {
  return (
    <button className="duration-200 cursor-pointer hover:bg-[#3373C4] hover:text-[#F2F2F2] border-[#3373C4] border-2 h-12 rounded-3xl py-2 px-3 font-bold text-[#3373C4]">
      {children}
    </button>
  );
}
