// app/dashboard/instructor/add-course/page.jsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function InstructorAddCourse() {
  const [programs, setPrograms] = useState([]); // Available programs
  const [selectedProgram, setSelectedProgram] = useState(""); // Selected program
  const [courses, setCourses] = useState([]); // Courses for the selected program
  const [selectedCourse, setSelectedCourse] = useState(""); // Course instructor selects
  const [instructorCourses, setInstructorCourses] = useState([]); // Instructor's own courses

  const router = useRouter();

  // Fetch available programs for the instructor
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await axios.get("/api/instructor/programs");
        setPrograms(res.data); // Set the list of programs
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
    fetchPrograms();
  }, []);

  // Fetch courses based on the selected program
  const fetchCourses = async (programId) => {
    try {
      const res = await axios.post("/api/instructor/courses", { programId });
      setCourses(res.data); // Set courses for the selected program
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch the instructor's own courses
  useEffect(() => {
    async function fetchInstructorCourses() {
      try {
        const res = await axios.get("/api/instructor/my-courses");
        setInstructorCourses(res.data.courses);
      } catch (error) {
        console.error("Error fetching instructor's courses:", error);
      }
    }
    fetchInstructorCourses();
  }, []);

  const handleAddCourse = async () => {
    try {
      // Log the selected course ID for debugging purposes
      console.log("Selected course ID:", selectedCourse);

      // Ensure the selectedCourse is not empty
      if (!selectedCourse) {
        console.error("No course selected");
        return;
      }

      // Send the request to the backend
      const response = await axios.post("/api/instructor/my-courses/add", {
        courseId: selectedCourse,
      });

      // Update instructor's courses list without routing
      setInstructorCourses((prevCourses) => [
        ...prevCourses,
        courses.find((course) => course._id === selectedCourse),
      ]);

      console.log("Course added successfully:", response.data);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`/api/instructor/my-courses/${courseId}`);
      // Remove the course from the list without routing
      setInstructorCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 ml-48 p-4">
        <h2 className="text-2xl mb-4">Add Course</h2>

        {/* Program Selection */}
        <div className="mb-4">
          <label className="block mb-2">Select Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => {
              setSelectedProgram(e.target.value);
              fetchCourses(e.target.value); // Fetch courses when program is selected
            }}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select a Program</option>
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Selection */}

        <div className="mb-4">
          <label className="block mb-2">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={!selectedProgram}
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCourse}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2"
            disabled={!selectedProgram || !selectedCourse}
          >
            Add Course
          </button>
        </div>

        {/* Instructor's Own Courses */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Your Courses</h3>
          <div className="grid grid-cols-[2fr_6fr_auto] gap-4 font-semibold mb-4">
            <span className="col-span-1 text-left">Course Name</span>
            <span className="col-span-1 text-left">Description</span>
            <span className="col-span-1 text-left"></span>
          </div>
          <ul>
            {Array.isArray(instructorCourses) &&
            instructorCourses.length > 0 ? (
              instructorCourses.map((course) => (
                <li
                  key={course._id}
                  className="grid grid-cols-[2fr_6fr_auto] gap-4 items-center mb-2"
                >
                  <span>{course.name}</span>
                  <span className="ml-4">{course.description}</span>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>No courses available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
