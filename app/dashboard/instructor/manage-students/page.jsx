"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../../components/Sidebar";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students enrolled in instructor's courses
    async function fetchStudents() {
      try {
        const res = await axios.get("/api/instructor/students");
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
          <div className="my-3 p-2 grid grid-cols-5 items-center justify-between cursor-pointer">
            <span>Student Name</span>
            <span>Email</span>
            <span>Course Name</span>
            <span>Program Name</span>
            <span>Payment Status</span>
          </div>
          <ul>
            {students.length > 0 ? (
              students.map((student, id) => (
                <li
                  key={id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid grid-cols-5 items-center justify-between cursor-pointer"
                >
                  <p>{student.studentName}</p>
                  <p>{student.studentEmail}</p>
                  <p>{student.courseName}</p>
                  <p>{student.programName}</p>
                  <p>{student.paymentStatus}</p>
                </li>
              ))
            ) : (
              <li className="bg-gray-50 p-4 rounded-lg">
                <p className="text-center text-gray-500">
                  No students enrolled in your courses.
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
