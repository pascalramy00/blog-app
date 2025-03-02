"use client";
import React from "react";
import { useState } from "react";
import { login } from "@/utils/auth";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      //   setEmail(""); // Reset the email field after login
      //   setPassword(""); // Reset the password field after login
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setError("Login failed, please try again.");
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginForm;
