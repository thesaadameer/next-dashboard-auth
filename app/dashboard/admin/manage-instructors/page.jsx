// app/dashboard/admin/manageInstructors.jsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "../../../../components/Sidebar";

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    // Fetch all instructors
    async function fetchInstructors() {
      try {
        const res = await axios.get("/api/admin/instructors");
        setInstructors(res.data);
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
      }
    }
    fetchInstructors();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48 p-4">
        <h2 className="text-2xl font-semibold mb-4">Manage Instructors</h2>
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
            <span>Name</span>
            <span className="sm:text-left text-right">Email</span>
            <span className="hidden md:grid">Courses</span>
            <span className="hidden sm:grid">Actions</span>
          </div>
          <ul>
            {instructors.map((instructor, id) => (
              <li
                key={id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BsPersonFill className="text-purple-800" />
                  </div>
                  <p className="pl-4">{instructor.name}</p>
                </div>
                <p className="text-gray-600 sm:text-left text-right">
                  {instructor.email}
                </p>
                <p className="hidden md:flex">
                  {instructor.courses ? instructor.courses.length : 0} Courses
                </p>

                <div className="sm:flex hidden justify-between items-center">
                  <BsThreeDotsVertical />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageInstructors;
