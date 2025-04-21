"use client";

import React, { Suspense, useState }  from "react";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

const filters = [
    { name: "All" },
    { name: "React" }, 
    { name: "Next" }, 
    { name: "React-vite" }, 
    { name: "JavaScript" }
];

export default function Main() {
    const { data, isLoading, fetchError } = useAxiosFetch("https://your-tech-stories-backend.onrender.com/api/blog/get-blogs");
    const blogs = data?.blogs || [];

    // Filter and search states
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [search, setSearch] = useState("");

    // Handle filter and search
    const filteredBlogs = blogs.filter((blog) => {
        const matchesCategory = selectedFilter === "All" || blog.category?.toLowerCase() === selectedFilter.toLowerCase();
        const matchesAuthor = blog.authorName?.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesAuthor;
    });
    
    return (
        <div>
            <div className="flex items-center justify-around mt-15 p-2">
                <ul className="flex items-center gap-x-4">
                {filters.map((filter, index) => (
                    <li 
                      key={index}
                      className={`px-4 py-2 rounded-2xl text-white font-semibold cursor-pointer
                        ${selectedFilter === filter.name ? "bg-amber-400" : "bg-gray-600 hover:bg-amber-400"}`}
                      onClick={() => setSelectedFilter(filter.name)}
                    >
                    {filter.name}
                    </li>
                ))}
                </ul>

                <form>
                    <label className="flex text-white p-2">
                        <input 
                          className="text-white focus:outline-none focus:ring-0"
                          type="text"
                          placeholder="Search the author..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          name="search"
                          id="search"
                        />
                        <SearchIcon />
                    </label>
                </form>
            </div>
            
            {/* All the blogs are rendered here */}
            <Suspense fallback={<div>Loading Blogs...</div>}>
                { isLoading && <p className="text-center font-bold text-sm md:text-base mt-8">Loading Blogs...</p>}
                { !isLoading && fetchError && <p className="text-center font-bold text-sm md:text-base">{fetchError}</p>}
                { !isLoading && !fetchError && (
                    filteredBlogs.length ?
                <>
                    {filteredBlogs.map((blog) => (
                        <div className="flex justify-center items-center gap-x-5 my-30 p-2" key={blog._id}>
                            <div>
                                <h1 className="font-bold text-3xl text-center">{blog.title}</h1>
                                <Link href={`/blog-page/${blog._id}`}>
                                  <p className="text-base text-center">{blog.content.slice(0,40)}...</p>
                                </Link>
                            </div>
                            <div>
                                <p className="text-base">{blog.authorName}</p>
                                <p className="text-base">{blog.profession}</p>
                            </div>
                        </div>
                    ))}
                </>
                :
                <>
                    <p className="text-center text-lg text-amber-300 font-bold my-30">
                        {selectedFilter && selectedFilter !== "All"
                            ? `No blogs found for ${selectedFilter}.`
                            : "No Blog Available. Add a new blog right now!"
                        }
                    </p>
                </>
                )}
            </Suspense>
        </div>
    );
};                       