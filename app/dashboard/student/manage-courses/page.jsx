"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../../components/Sidebar";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch courses the student has purchased
    async function fetchCourses() {
      try {
        const res = await axios.get("/api/student/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false); // Stop loading once the data is fetched or error occurs
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48 p-4">
        <h2 className="text-2xl font-semibold mb-4">Purchased Courses</h2>
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          {loading ? (
            // Display loader when fetching data
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="my-3 p-2 grid grid-cols-5 items-center justify-between cursor-pointer">
                <span>Course Name</span>
                <span>Program Name</span>
                <span>Instructors</span>
                <span>Amount</span>
                <span>Payment Status</span>
              </div>
              <ul>
                {courses.map((course, id) => (
                  <li
                    key={id}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid grid-cols-5 items-center justify-between cursor-pointer"
                  >
                    <p>{course.courseName}</p>
                    <p>{course.programName}</p>
                    <p>{course.instructors.join(", ")}</p>
                    <p>${course.amount}</p>
                    <p>{course.status}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <li className="bg-gray-50 p-4 rounded-lg">
              <p className="text-center text-gray-500">No courses purchased.</p>
            </li>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
