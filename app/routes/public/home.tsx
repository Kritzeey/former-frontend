import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "Former | Easy Form Maker" },
    { name: "description", content: "Create forms, hassle free." },
  ];
}

export default function Home() {
  return (
    <main className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-center">
          <div className="font-bold text-8xl">Former</div>
          <div className="text-2xl text-primary">
            Create forms, hassle-free.
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/forms">
            <Button className="hover:opacity-90 cursor-pointer text-base p-5 rounded-md">
              Forms List
            </Button>
          </Link>

          <Link to="/forms/create">
            <Button className="hover:opacity-90 cursor-pointer text-base p-5 rounded-md">
              Create a Form
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
