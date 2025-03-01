"use client";

import React from "react";
import { logout } from "@/utils/auth";

const DashboardPage = () => {
  const handleLogout = async () => await logout();
  return (
    <div>
      <h2>Protected page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
