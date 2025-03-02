export const login = async (email: string, password: string) => {
  console.log("Sending login request to the backend...");
  const res = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Login failed");
};

export const register = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string
) => {
  const res = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, first_name, last_name }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Registration failed");
};

export const logout = async () => {
  const res = await fetch("http://localhost:3001/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");

  window.location.href = "/login";
};
