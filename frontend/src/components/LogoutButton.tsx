"use client";

import React from "react";
import { logout } from "@/utils/auth";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
