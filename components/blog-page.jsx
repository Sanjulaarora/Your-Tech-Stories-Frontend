"use client";

import React, { useState } from "react";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

export default function BlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, fetchError } = useAxiosFetch("https://your-tech-stories-backend.onrender.com/api/blog/get-blogs");
  const blogs = data?.blogs || [];

  const { user } = useUser(); // Get the current user from context (contains full user data)

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the blog?")) {
      try {
        setLoadingDelete(true);
        const res = await fetch(`https://your-tech-stories-backend.onrender.com/api/blog/delete-blog/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          alert("Something went wrong!");
        } else {
          alert("Blog is deleted successfully!");
          router.push("/");
        }
      } catch (err) {
        console.error("Error deleting blog:", err.message);
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  const handleEditRedirect = () => {
    setLoadingEdit(true);
    setTimeout(() => {
      router.push(`/edit-blog/${id}`);
    }, 500);
  };

  const blog = blogs.find((blog) => blog._id?.toString() === id?.toString());

  // Check if the current user is logged in and is the blog's author
  const isOwner = user && blog && blog.authorName === user.name;

  if (isLoading) return <p className="text-center mt-10">Loading blog...</p>;
  if (fetchError) return <p className="text-center mt-10 text-red-500">{fetchError}</p>;
  if (!blog) return <p className="text-center mt-10 text-amber-400">Blog not found!</p>;

  return (
    <div className="flex flex-col items-center mx-11 py-5 h-screen">
      <div className="flex flex-col gap-5 my-14">
        <h1 className="font-bold text-5xl text-center">{blog.title}</h1>
        <p className="mx-90 text-base text-center">{blog.content}</p>
        <div className="flex flex-col">
          <p className="text-lg text-center">-{blog.authorName}</p>
          <p className="text-lg text-center">{blog.profession}</p>
        </div>
      </div>

      {/* Only show Edit and Delete buttons if the user is the author */}
      {isOwner && (
        <div className="flex gap-5 justify-center my-5">
          <button
            onClick={handleEditRedirect}
            disabled={loadingEdit}
            className="bg-amber-400 text-white p-4 rounded cursor-pointer"
          >
            {loadingEdit ? "Redirecting..." : "Edit"}
          </button>
          <button
            onClick={() => handleDelete(blog._id)}
            disabled={loadingDelete}
            className="bg-red-500 text-white p-4 rounded cursor-pointer"
          >
            {loadingDelete ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
