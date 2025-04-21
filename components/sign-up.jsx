"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp () {
  const router = useRouter();

  const [signUpData, setSignUpData] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
    passwordAgain: ""
  });

  const [loading, setLoading] = useState({
    signingUp: false,
    redirecting: false
  });

  const addSignUpData = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle sign up
  const signUpUser = async (e) => {
    e.preventDefault();
    const { name, number, email, password, passwordAgain } = signUpData;

    setLoading({ signingUp: true, redirecting: false });

    try {
      const res = await fetch("https://your-tech-stories-backend.onrender.com/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, number, email, password, passwordAgain
        })
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 422 || !data) {
        alert("Something went wrong!");
        setLoading({ signingUp: false, redirecting: false });
      } else {
        alert("SignUp Successful!");
        setSignUpData({
          name: "",
          number: "",
          email: "",
          password: "",
          passwordAgain: ""
        });

        setLoading({ signingUp: false, redirecting: true });

        setTimeout(() => {
          router.push("/sign-in");
        }, 800);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong!");
      setLoading({ signingUp: false, redirecting: false });
    }
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen relative">
      <div className="h-[450px] md:h-[490px] w-[490px] p-2 mt-10 border-[1px] border-solid border-gray-500 rounded-lg">
        <form method="POST" className="flex flex-col justify-center p-2">
          <h1 className="text-lg md:text-2xl font-bold">Sign-up</h1>

          {[
            { label: "Your Name", name: "name", type: "text", placeholder: "Enter Your Name" },
            { label: "Phone Number", name: "number", type: "number", placeholder: "Enter Phone Number" },
            { label: "Email", name: "email", type: "text", placeholder: "Enter Email" },
            { label: "Password", name: "password", type: "password", placeholder: "At least 6 characters" },
            { label: "Password Again", name: "passwordAgain", type: "password", placeholder: "Enter Password Again" }
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} className="flex flex-col p-2">
              <label className="font-semibold text-sm md:text-base" htmlFor={name}>{label}</label>
              <input
                className="rounded-lg p-1 text-sm md:text-base text-white border-gray-500 border-solid border-[1px]"
                type={type}
                placeholder={placeholder}
                value={signUpData[name]}
                onChange={addSignUpData}
                name={name}
                id={name}
              />
            </div>
          ))}

          <button
            className="w-30 h-8 bg-amber-400 text-white rounded-lg font-semibold text-sm md:text-base mx-auto"
            onClick={signUpUser}
            disabled={
              loading.signingUp ||
              !signUpData.name ||
              !signUpData.number ||
              !signUpData.email ||
              !signUpData.password ||
              !signUpData.passwordAgain
            }
          >
            {loading.signingUp ? "Signing up..." : "Sign-Up"}
          </button>

          <div className="flex mx-auto">
            <p className="mt-2 font-semibold text-sm md:text-base">Already Have Account ?</p>
            <Link href={"/sign-in"} className="text-amber-400 m-2 font-semibold text-sm md:text-base">Sign-In</Link>
          </div>
        </form>
      </div>

      {loading.redirecting && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-sm text-gray-600 animate-pulse">
          Redirecting...
        </div>
      )}
    </section>
  );
}
