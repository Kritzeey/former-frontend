import Button from "~/components/button";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main>
      <section className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col gap-4 items-center justify-center">
          <span className="text-[#86CEFA] font-bold text-8xl">Former</span>
          <span className="font-bold text-4xl">Create forms, hassle-free.</span>
          <div className="flex gap-4">
            <Button>
              Log In
            </Button>
            <Button>
              Browse Forms
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
