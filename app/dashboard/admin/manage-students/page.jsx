// app/dashboard/admin/manage-students/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "../../../../components/Sidebar";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch all students
    async function fetchStudents() {
      try {
        const res = await axios.get("/api/admin/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48 p-4">
        <h2 className="text-2xl font-semibold mb-4">Manage Students</h2>
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
            <span>Name</span>
            <span className="sm:text-left text-right">Email</span>
            <span className="hidden md:grid">Programs</span>
            <span className="hidden sm:grid">Actions</span>
          </div>
          <ul>
            {students.map((student, id) => (
              <li
                key={id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BsPersonFill className="text-purple-800" />
                  </div>
                  <p className="pl-4">{student.name}</p>
                </div>
                <p className="text-gray-600 sm:text-left text-right">
                  {student.email}
                </p>
                <p className="hidden md:flex">
                  {student.programs ? student.programs.length : 0} Programs
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

export default ManageStudents;