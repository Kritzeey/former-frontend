import Header from "~/components/header";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div className="min-h-dvh">
      <Header />
      <Outlet />
    </div>
  );
}
