import { Link, Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/feed">Feed</Link>
          <Link to="/create-post">Create</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
