import { Link } from "react-router";
import Button from "~/components/button";
import Input from "~/components/input";

export default function Login() {
  return (
    <main className="h-screen w-full flex items-center justify-center">
      <form className="bg-white max-w-xl w-full rounded-3xl p-8 flex flex-col gap-8">
        <span className="w-full text-center text-2xl">Log In</span>

        <Input placeholder="Username" name="username" />

        <Input placeholder="Password" name="password" />

        <span className="w-full text-center">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="underline hover:opacity-60 duration-200"
          >
            Register
          </Link>
        </span>

        <Button>Login</Button>
      </form>
    </main>
  );
}
