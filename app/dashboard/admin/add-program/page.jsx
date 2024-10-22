// app/dashboard/admin/add-program/page.jsx

"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

export default function AddProgram() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await axios.get("/api/admin/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const duplicateProgram = programs.find((program) => program.name === name);
    if (duplicateProgram) {
      setError("Program with this name already exists.");
      return;
    }

    try {
      await axios.post("/api/admin/programs", { name, description });

      // Update the program list
      setPrograms([...programs, { name, description }]);
      setName(""); // Clear the input fields after adding
      setDescription("");
      setError("");
    } catch (error) {
      setError("Failed to add the program.");
    }
  };

  // Handle deleting a program
  const handleDelete = async (programId) => {
    try {
      await axios.delete(`/api/admin/programs/${programId}`);
      setPrograms(programs.filter((program) => program._id !== programId));
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 ml-48 bg-gray-100 min-h-screen">
        <div className="flex justify-between p-4">
          <h2>Add Program</h2>
          <h2>Welcome Back, Admin</h2>
        </div>

        {/* Add Program Form */}
        <div className="p-4">
          <div className="w-full m-auto p-4 border rounded-lg bg-white">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Program Name</label>
                <input
                  type="text"
                  placeholder="Program Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  placeholder="Program Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Add Program
              </button>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>

        {/* Existing Programs */}
        <div className="p-4">
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div
              className="my-3 p-2 grid items-center justify-between cursor-pointer"
              style={{ gridTemplateColumns: "1fr 4fr 1fr" }} //  column widths
            >
              <span>Name</span>
              <span className="text-left">Description</span>
              <span className="text-right">
                {/* Empty for Delete button alignment */}
              </span>
            </div>
            <ul>
              {programs.map((program, id) => (
                <li
                  key={id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid items-center justify-between"
                  style={{ gridTemplateColumns: "1fr 4fr 1fr" }} // Define column widths
                >
                  {/* Name Column */}
                  <div>{program.name}</div>

                  {/* Description Column */}
                  <div className="text-gray-600 text-left">
                    {program.description}
                  </div>

                  {/* Delete Button Column */}
                  <div className="text-right">
                    <button
                      onClick={() => handleDelete(program._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
