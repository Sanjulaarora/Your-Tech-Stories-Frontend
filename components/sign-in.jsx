"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context"; // Adjust the import path

export default function SignIn() {
  const { setUser } = useUser();
  const router = useRouter();

  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState({
    signingIn: false,
    page: false
  });

  const addSignInData = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const signInUser = async (e) => {
    e.preventDefault();
    const { email, password } = signInData;

    setLoading({ signingIn: true, page: false });

    try {
      const res = await fetch("http://localhost:8005/api/auth/sign-in", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 400 || !data) {
        alert("Something went wrong!");
        setLoading({ signingIn: false, page: false });
      } else {
        alert("You are Logged In 🔓!");
        setUser(data.user);  // Store user data in the context

        setSignInData({ email: "", password: "" });

        // Show page loader briefly before navigating
        setLoading({ signingIn: false, page: true });

        setTimeout(() => {
          router.push("/");
        }, 800);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("An error occurred!");
      setLoading({ signingIn: false, page: false });
    }
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen relative">
      <div className="h-80 w-80 p-2 mt-10 border-[1px] border-solid border-gray-500 rounded-lg">
        <form method="POST" className="flex flex-col justify-center space-y-2 p-2">
          <h1 className="text-lg md:text-2xl font-bold">Sign-In</h1>

          <div className="flex flex-col p-2">
            <label className="font-semibold text-sm md:text-base" htmlFor="email">Email</label>
            <input 
              className="rounded-lg p-1 text-sm md:text-base text-white border-gray-500 border-solid border-[1px]" 
              type="text" 
              placeholder="Enter Email"
              value={signInData.email}
              onChange={addSignInData}
              name="email" 
              id="email"
            />
          </div>

          <div className="flex flex-col p-2">
            <label className="font-semibold text-sm md:text-base" htmlFor="password">Password</label>
            <input 
              className="rounded-lg p-1 text-sm md:text-base text-white border-gray-500 border-solid border-[1px]" 
              type="password" 
              placeholder="At least 6 characters"
              value={signInData.password}
              onChange={addSignInData} 
              name="password" 
              id="password"
            />
          </div>

          <button 
            className="w-16 md:w-30 h-8 text-sm md:text-base bg-amber-400 text-white rounded-lg font-semibold mx-auto"
            onClick={signInUser}
            disabled={!signInData.email || !signInData.password || loading.signingIn}
          >
            {loading.signingIn ? "Signing in..." : "Sign-In"}
          </button>

          <div className="flex mx-auto">
            <p className="mt-2 font-semibold text-sm md:text-base">Do Not Have an Account ?</p>
            <Link href={"/sign-up"} className="text-amber-400 m-2 font-semibold text-sm md:text-base">Sign-Up</Link>
          </div>
        </form>
      </div>

      {loading.page && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-sm text-gray-600 animate-pulse">
          Loading Page...
        </div>
      )}
    </section>
  );
}
