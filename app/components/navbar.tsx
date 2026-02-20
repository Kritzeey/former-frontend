import { Link } from "react-router";

export default function Navbar() {
  return (
    <header className="bg-[#3373C4] h-16 absolute top-0 w-full">
      <nav className="px-6 w-full flex justify-between items-center h-full">
        <Link className="flex text-[#F2F2F2] font-bold text-2xl gap-4" to="/">
          Former
        </Link>

        <Link
          to="/login"
          className="text-[#F2F2F2] font-bold hover:bg-[#F2F2F2] h-full flex items-center justify-center duration-200 hover:text-[#3373C4] px-4"
        >
          Log In
        </Link>
      </nav>
    </header>
  );
}
