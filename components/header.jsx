"use client";

import React, { useState } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState({
    login: false,
    signup: false,
    logout: false,
    page: false
  });

  const handleRoutePush = async (path, type) => {
    if (type === "login") setLoading(prev => ({ ...prev, login: true }));
    if (type === "signup") setLoading(prev => ({ ...prev, signup: true }));
    if (type === "logout") setLoading(prev => ({ ...prev, logout: true }));

    setLoading(prev => ({ ...prev, page: true }));

    await router.push(path);

    setTimeout(() => {
      setLoading({
        login: false,
        signup: false,
        logout: false,
        page: false
      });
    }, 700);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(prev => ({ ...prev, logout: true, page: true }));

      const res = await fetch("https://your-tech-stories-backend.onrender.com/api/auth/sign-out", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await res.json();

      if (res.status !== 200 || !data) {
        alert("Something went wrong!");
        setLoading({ login: false, signup: false, logout: false, page: false });
      } else {
        setUser(null);  // Reset the user context
        alert("You are Logged Out 🔐");
        handleRoutePush("/", "logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred!");
      setLoading({ login: false, signup: false, logout: false, page: false });
    }
  };
 
  const handleCreate = () => {
    if (user) {
      handleRoutePush("/create-blog", "login");
    } else {
      handleRoutePush("/sign-in", "login");
    }
  };

  return (
    <nav className="flex items-center justify-between mx-11 py-5 relative">
      <Link href="/">
        <span className="text-4xl font-extrabold">
          Your Tech
          <br />
          Stories
        </span>
      </Link>

      <div className="flex items-center gap-x-4">
        <ul>
          <li className="cursor-pointer hover:text-amber-400" role="button" onClick={handleCreate}>
            Create a Blog
          </li>
        </ul>

        {user ? (
          <Button
            variant="outline"
            className="text-black cursor-pointer"
            onClick={handleLogout}
            disabled={loading.logout}
          >
            {loading.logout ? "Logging out..." : "Logout"}
          </Button>
        ) : (
          <div className="flex items-center gap-x-4">
            <Button
              className="cursor-pointer"
              onClick={() => handleRoutePush("/sign-up", "signup")}
              disabled={loading.signup}
            >
              {loading.signup ? "Loading..." : "Sign up"}
            </Button>

            <Button
              variant="outline"
              className="text-black cursor-pointer"
              onClick={() => handleRoutePush("/sign-in", "login")}
              disabled={loading.login}
            >
              {loading.login ? "Loading..." : "Log in"}
            </Button>
          </div>
        )}
      </div>

      {/* Header-level page loader */}
      {loading.page && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-sm text-gray-600 animate-pulse">
          Loading Page...
        </div>
      )}
    </nav>
  );
};

export default Header;
