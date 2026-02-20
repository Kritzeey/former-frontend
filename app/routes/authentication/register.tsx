import { Link } from "react-router";
import Button from "~/components/button";
import Input from "~/components/input";

export default function Register() {
  return (
    <main className="h-screen w-full flex items-center justify-center">
      <form className="bg-white max-w-xl w-full rounded-3xl p-8 flex flex-col gap-8">
        <span className="w-full text-center font-bold text-2xl">Register</span>

        <Input placeholder="Username" name="username" />

        <Input placeholder="Full name" name="username" />

        <Input placeholder="Password" name="password" />

        <Input placeholder="Confirm Password" name="confirm password" />

        <span className="w-full text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:opacity-60 duration-200">
            Log in
          </Link>
        </span>

        <Button>Register</Button>
      </form>
    </main>
  );
}
