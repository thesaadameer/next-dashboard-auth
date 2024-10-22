"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ProgramCourses() {
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const params = useParams();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const programId = params.id; // dynamic program ID from the route

  useEffect(() => {
    if (!programId) {
      return;
    }

    async function fetchCourses() {
      try {
        const res = await axios.get(
          `/api/student/programs/${programId}/courses`
        );
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchPurchasedCourses() {
      try {
        const res = await axios.get("/api/student/courses"); // Assuming this endpoint returns purchased courses
        setPurchasedCourses(res.data); // Set purchased courses
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
      }
    }

    fetchCourses();
    fetchPurchasedCourses(); // Now properly called inside useEffect
  }, [programId]); // Run only when programId changes

  const handleCourseClick = async (courseId) => {
    try {
      const res = await axios.get(
        `/api/student/courses/${courseId}/instructors`
      );
      console.log(res);
      setInstructors(res.data);
      setSelectedCourse(courseId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const handleBuyClick = async () => {
    if (!selectedCourse) {
      alert("No course selected!");
      return;
    }

    setBuying(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionType: "buyCourse",
          courseId: selectedCourse, // Send the selected course ID
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Failed to purchase course.");
        return;
      }

      const data = await response.json();
      console.log("Order created successfully:", data.order);
      alert("Course purchased successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error occurred while purchasing course.");
    } finally {
      setIsModalOpen(false);
      setBuying(false);
    }
  };

  const isCoursePurchased = (courseId) => {
    return purchasedCourses.some((course) => course.courseId === courseId);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48 p-4">
        <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-6 bg-white shadow rounded-lg hover:bg-blue-100 transition-shadow cursor-pointer space-y-2"
                onClick={() => handleCourseClick(course._id)}
              >
                <h2 className="text-xl font-bold">{course.name}</h2>
                <p>Description: {course.description}</p>
                <p>${course.price}</p>
              </div>
            ))}
          </div>
        )}

        {/* Modal for displaying instructors */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">
                Instructors for the course
              </h2>
              <ul>
                {instructors.map((instructor) => (
                  <li key={instructor._id} className="mb-2">
                    {instructor.user.name}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4 mt-4">
                {!isCoursePurchased(selectedCourse) && (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-700"
                    onClick={handleBuyClick}
                    disabled={buying} // Disable button when buying
                  >
                    {buying ? "Processing..." : "Buy Course"}
                  </button>
                )}

                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700"
                  onClick={() => setIsModalOpen(false)}
                  disabled={buying} // Disable close button when buying
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
