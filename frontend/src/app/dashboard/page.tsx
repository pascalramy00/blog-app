import LogoutButton from "@/components/LogoutButton";
import { cookies } from "next/headers";

async function getUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const res = await fetch("http://localhost:3001/api/authors/profile", {
    method: "GET",
    headers: { Cookie: `token=${token}` },
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    return <p>You must be logged in.</p>;
  }
  return (
    <div>
      <h2>Protected route</h2>
      <p>
        Welcome, {user.first_name} {user.last_name}
      </p>
      <LogoutButton></LogoutButton>
    </div>
  );
}
