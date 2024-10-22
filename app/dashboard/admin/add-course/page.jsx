"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

export default function AddCourse() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]); // Selected instructors stored as array of IDs
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [editingCourse, setEditingCourse] = useState(null); // Track the course being edited

  const router = useRouter();
  const [error, setError] = useState("");

  // Fetch programs, courses, and instructors from the backend
  useEffect(() => {
    async function fetchData() {
      try {
        const programResponse = await axios.get("/api/admin/programs");
        const courseResponse = await axios.get("/api/admin/courses");
        const instructorResponse = await axios.get("/api/admin/instructors");

        setPrograms(programResponse.data); // Set programs
        setCourses(courseResponse.data); // Set courses
        setInstructors(instructorResponse.data); // Set instructors
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Ensure the handleDelete function is defined
  const handleDelete = async (courseId, instructorId, courseName) => {
    try {
      await axios.delete(`/api/admin/courses/${courseId}`, {
        data: {
          instructor: instructorId,
          name: courseName,
        },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course); // Set the course to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdateCourse = async (e, courseId) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/admin/courses/${courseId}`, {
        name: editingCourse.name,
        description: editingCourse.description,
        price: editingCourse.price,
      });

      const updatedCourse = response.data.course;

      // Update the courses list in the state with the updated course
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );

      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  // Handle form submission for adding a new course
  const handleSubmit = async (e) => {
    e.preventDefault();

    const instructorIds = selectedInstructors;

    // Check if the course with the same name and instructor already exists
    const duplicateCourse = courses.find(
      (course) =>
        course.name === name &&
        course.instructors.some((instructor) =>
          instructorIds.includes(instructor._id)
        )
    );

    if (duplicateCourse) {
      setError("Course with this name and instructor already exists.");
      return;
    }

    try {
      // Add the new course and get the response with populated data
      const addCourseResponse = await axios.post("/api/admin/courses", {
        name,
        description,
        price,
        program: selectedProgram,
        instructorIds,
      });

      // Ensure the response is successful
      if (addCourseResponse.status !== 200) {
        throw new Error("Failed to add the course");
      }

      const newCourse = addCourseResponse.data.course;

      // Update the state with the newly added course directly from the response
      setCourses((prevCourses) => [...prevCourses, newCourse]);

      // Clear the form fields
      setName("");
      setDescription("");
      setPrice("");
      setSelectedProgram("");
      setSelectedInstructors([]);
      setError("");
    } catch (error) {
      console.error("Error adding course:", error);
      setError("Failed to add the course. Please try again.");
    }
  };

  // Handle selecting/deselecting instructors
  const handleInstructorSelection = (instructorId) => {
    setSelectedInstructors((prev) => {
      if (prev.includes(instructorId)) {
        return prev.filter((id) => id !== instructorId); // Deselect if already selected
      } else {
        return [...prev, instructorId]; // Select if not already selected
      }
    });
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      <div className="flex-1 ml-48 bg-gray-100 min-h-screen">
        <div className="flex justify-between p-4">
          <h2>Add Course</h2>
          <h2>Welcome Back, Admin</h2>
        </div>

        {/* Add Course Form */}
        <div className="p-4">
          <div className="w-full m-auto p-4 border rounded-lg bg-white">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Course Name</label>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  placeholder="Course Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Program</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map((program) => (
                    <option key={program._id} value={program._id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown with Checkboxes for Instructors */}
              <div className="mb-4">
                <label className="block text-gray-700">Instructors</label>
                <div className="relative w-full">
                  <div className="border rounded-lg p-2 w-full">
                    <div className="flex flex-col">
                      {instructors.map((instructor) => (
                        <label key={instructor._id} className="mb-2">
                          <input
                            type="checkbox"
                            value={instructor._id}
                            onChange={() =>
                              handleInstructorSelection(instructor._id)
                            }
                            checked={selectedInstructors.includes(
                              instructor._id
                            )}
                            className="mr-2"
                          />
                          {instructor.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Add Course
              </button>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">Edit Course</h2>

              <form onSubmit={(e) => handleUpdateCourse(e, editingCourse._id)}>
                <div className="mb-4">
                  <label className="block text-gray-700">Course Name</label>
                  <input
                    type="text"
                    value={editingCourse.name}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={editingCourse.description}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    value={editingCourse.price}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        price: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Existing Courses */}
        <div className="p-4">
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div
              className="my-3 p-2 grid items-center justify-between cursor-pointer"
              style={{ gridTemplateColumns: "1fr 1fr 3fr 1fr 1fr" }}
            >
              <span>Name</span>
              <span>Instructor</span>
              <span className="text-left">Description</span>
              <span className="text-right">Price</span>
              <span className="text-right">{/* Empty for alignment */}</span>
            </div>
            <ul>
              {courses.map((course, index) => (
                <li
                  key={course._id || index} // Ensure a unique key
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid items-center justify-between"
                  style={{ gridTemplateColumns: "1fr 1fr 3fr 1fr 1fr" }}
                >
                  {/* Name Column */}
                  <div>{course.name}</div>

                  {/* Instructor Column */}
                  <div className="text-left">
                    {course.instructors.length > 0
                      ? course.instructors
                          .map(
                            (instructor) =>
                              instructor?.user?.name || "Unknown Instructor"
                          )
                          .join(", ")
                      : "No Instructors"}
                  </div>

                  {/* Description Column */}
                  <div className="text-gray-600 text-left">
                    {course.description}
                  </div>

                  {/* Price Column */}
                  <div className="text-right">${course.price}</div>

                  {/* Delete Button Column */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(course)} // Opens the modal for editing
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          course._id,
                          course.instructors[0]?._id,
                          course.name
                        )
                      }
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
