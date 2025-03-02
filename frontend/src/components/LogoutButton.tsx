"use client";

import React from "react";
import { logout } from "@/utils/auth";

const LogoutButton = () => {
  const handleLogout = async () => await logout();
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
