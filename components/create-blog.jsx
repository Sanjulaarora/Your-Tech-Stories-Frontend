"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateBlog() {
  const router = useRouter();

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    authorName: "",
    profession: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);

  const addBlogData = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // handle create blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { title, content, authorName, profession, category } = blogData;

      const res = await fetch("https://your-tech-stories-backend.onrender.com/api/blog/create-blog", {
        method: "POST",
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

      alert("Blog added successfully!");
      setBlogData({
        title: "",
        content: "",
        authorName: "",
        profession: "",
        category: ""
      });

      router.push("/"); // redirect to homepage or blogs page
    } catch (err) {
      console.error("Error creating blog:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="mx-11 py-5">
      <h1 className="text-amber-400 text-6xl text-center font-extrabold mt-4 p-2">Let us see what you've got!</h1>

      <form className="flex flex-col mt-10 mx-24 space-y-6">
        {/* Input fields */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm md:text-base">Title</label>
          <input 
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2"
            type="text" 
            placeholder="Enter Title"
            value={blogData.title}
            onChange={addBlogData}
            name="title" 
            id="title"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="content" className="text-sm md:text-base">Content</label>
          <textarea
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2 h-30"
            placeholder="Enter Content"
            value={blogData.content}
            onChange={addBlogData}
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
            value={blogData.authorName}
            onChange={addBlogData}
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
            value={blogData.profession}
            onChange={addBlogData}
            name="profession" 
            id="profession"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="text-sm md:text-base">Category</label>
          <select 
            className="border-slate-500 border-solid border-[1px] rounded-lg text-sm md:text-base p-1 md:p-2" 
            value={blogData.category}
            onChange={addBlogData}
            name="category" 
            id="category"
          >
            <option className="text-black" value="">Select Category</option>
            <option className="text-black" value="react">React</option>
            <option className="text-black" value="next">Next</option>
            <option className="text-black" value="react-vite">React-Vite</option>
            <option className="text-black" value="js">JS</option>
          </select>
        </div>
        
        {/* Buttons */}
        <div>
          <button 
            className="w-20 md:w-28 bg-amber-400 text-white rounded-lg text-sm md:text-base p-1 md:p-2 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed" 
            onClick={handleCreateBlog} 
            disabled={loading || !blogData.title || !blogData.content || !blogData.authorName || !blogData.profession || !blogData.category}
          >
            {loading ? "Loading..." : "Shoot"}
          </button>

          <Link href={"/"}>
            <button className="w-20 md:w-28 border-black border-solid border-[1px] ml-2 text-sm md:text-base p-1 md:p-2 rounded-lg hover:scale-110">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
