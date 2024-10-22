"use client";

import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await axios.get("/api/student/programs");
        setPrograms(res.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48 p-4">
        <h1 className="text-2xl font-bold mb-4">Available Programs</h1>

        {loading ? (
          // Loader UI using Tailwind CSS
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program._id}
                className="p-6 bg-white shadow rounded-lg hover:bg-blue-100 transition-shadow cursor-pointer space-y-2"
              >
                <h2 className="text-xl font-bold">{program.name}</h2>
                <p>{program.description}</p>
                <a
                  href={`/dashboard/student/programs/${program._id}`}
                  className="mt-4 inline-block text-blue-500 hover:underline"
                >
                  View Courses
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
