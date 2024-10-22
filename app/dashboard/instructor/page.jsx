// app/dashboard/instructor/page.jsx
"use client";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);
import Sidebar from "../../../components/Sidebar";
import TopCards from "../../../components/TopCards";
import BarChart from "../../../components/BarChart";
import RecentOrders from "../../../components/RecentOrders";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InstructorDashboard() {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [ytdRevenue, setYtdRevenue] = useState(0);
  const [students, setStudents] = useState(0);
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    // Fetch dashboard data for instructor
    async function fetchData() {
      try {
        const res = await axios.get("/api/instructor/dashboard");
        setDailyRevenue(res.data.dailyRevenue);
        setYtdRevenue(res.data.ytdRevenue);
        setStudents(res.data.students);
        setRecentSales(res.data.recentSales);
      } catch (err) {
        console.error("Failed to fetch instructor dashboard data:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48 p-4">
        <TopCards
          dailyRevenue={dailyRevenue}
          ytdRevenue={ytdRevenue}
          customers={students}
        />
        <div className="mt-4 flex gap-4">
          <div className="w-2/3">
            <BarChart />
          </div>
          <div className="w-1/3">
            <RecentOrders orders={recentSales} />
          </div>
        </div>
      </div>
    </div>
  );
}