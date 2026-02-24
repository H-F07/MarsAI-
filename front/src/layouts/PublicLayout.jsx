import { Outlet } from "react-router";
import { TopBar } from "./TopBar";
import { BottomNavigation } from "./BottomNavBar";

export default function PublicLayout() {
  return (
    <div>
      <TopBar />
      <main className="mt-52">  
        <Outlet />
      </main>
      <BottomNavigation></BottomNavigation>
      <footer>Footer</footer>
    </div>
  );
}
