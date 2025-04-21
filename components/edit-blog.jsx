"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import useAxiosFetch from "@/hooks/useAxiosFetch";

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();
  const { data } = useAxiosFetch("https://your-tech-stories-backend.onrender.com/api/blog/get-blogs");
  const blogs = data?.blogs || [];

  const [editData, setEditData] = useState({
    title: "",
    content: "",
    authorName: "",
    profession: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);

  const editBlogData = (e) => {
    const { name, value } = e.target;
    setEditData(() => ({
      ...editData,
      [name]: value
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { title, content, authorName, profession, category } = editData;

      const res = await fetch(`https://your-tech-stories-backend.onrender.com/api/blog/update-blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title, content, authorName, profession, category
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      alert("Blog edited successfully!");
      router.push("/");
    } catch (err) {
      console.error("Error editing blog:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const blog = blogs.find((blog) => blog._id?.toString() === id?.toString());
  useEffect(() => {
    if (blog) {
      setEditData({
        title: blog.title,
        content: blog.content,
        authorName: blog.authorName,
        profession: blog.profession,
        category: blog.category
      });
    }
  }, [id, blogs]);

  return (
    <div className="mx-11 py-5">
      <h1 className="text-amber-400 text-6xl text-center font-extrabold mt-4 p-2">Yeah you can edit!</h1>

      <form className="flex flex-col mt-10 mx-24 space-y-6">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm md:text-base">Title</label>
          <input
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2"
            type="text"
            placeholder="Enter Title"
            value={editData.title}
            onChange={editBlogData}
            name="title"
            id="title"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="content" className="text-sm md:text-base">Content</label>
          <textarea
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2 h-30"
            placeholder="Enter Content"
            value={editData.content}
            onChange={editBlogData}
            name="content"
            id="content"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="authorName" className="text-sm md:text-base">Author Name</label>
          <input
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2"
            type="text"
            placeholder="Enter your registered name"
            value={editData.authorName}
            onChange={editBlogData}
            name="authorName"
            id="authorName"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="profession" className="text-sm md:text-base">Profession</label>
          <input
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2"
            type="text"
            placeholder="Who are you?"
            value={editData.profession}
            onChange={editBlogData}
            name="profession"
            id="profession"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="text-sm md:text-base">Category</label>
          <select
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2"
            value={editData.category}
            onChange={editBlogData}
            name="category"
            id="category"
          >
            <option className="text-black font-semibold" value="">Select Category</option>
            <option className="text-black font-semibold" value="react">React</option>
            <option className="text-black font-semibold" value="next">Next</option>
            <option className="text-black font-semibold" value="react-vite">React-Vite</option>
            <option className="text-black font-semibold" value="js">JS</option>
          </select>
        </div>

        <div>
          <button
            className="w-20 md:w-28 bg-amber-400 text-white rounded-lg text-sm md:text-base p-1 md:p-2 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleEdit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Shoot"}
          </button>
          <Link href={"/"}>
            <button className="w-20 md:w-28 border-black border-solid border-[1px] ml-2 text-sm md:text-base p-1 md:p-2 rounded-lg hover:scale-110">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
