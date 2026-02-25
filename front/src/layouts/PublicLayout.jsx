import { Outlet } from "react-router";
import { TopBar } from "./TopBar";
import { BottomNavigation } from "./BottomNavBar";

export default function PublicLayout() {
  return (
    <div>
      <TopBar />
      <main className="pt-24">
        <Outlet />
      </main>
      <BottomNavigation></BottomNavigation>
      <footer>Footer</footer>
      <BottomNavigation />
    </div>
  );
}
