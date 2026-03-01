import { Link, useNavigate, useRouteLoaderData } from "react-router";
import { Button } from "./ui/button";

interface User {
  id: string;
  user: string;
}

export default function Header() {
  const navigate = useNavigate();

  const loaderData = useRouteLoaderData("root") as
    | { user: User | null }
    | undefined;

  const user = loaderData?.user || null;

  const isLoggedIn = !!user;

  const handleLogout = () => {
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";

    navigate("/log-in");
  };

  return (
    <header className="z-50 bg-background border-b px-4 h-16 top-0 fixed w-full flex items-center justify-between">
      <Link to="/" className="font-bold text-2xl">
        Former
      </Link>

      <div className="flex gap-2 items-center">
        {isLoggedIn ? (
          <>
            <span className="text-sm font-medium mr-2">{user.user}</span>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="cursor-pointer rounded-md"
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/log-in">
              <Button variant="outline" className="cursor-pointer rounded-md">
                Log In
              </Button>
            </Link>

            <Link to="/sign-up">
              <Button className="rounded-md hover:opacity-90 cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
