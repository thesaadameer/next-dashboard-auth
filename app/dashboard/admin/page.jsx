// app/dashboard/admin/page.jsx
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

export default function AdminDashboard() {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [ytdRevenue, setYtdRevenue] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Fetch dashboard data for admin
    async function fetchData() {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setDailyRevenue(res.data.dailyRevenue);
        setYtdRevenue(res.data.ytdRevenue);
        setCustomers(res.data.customers);
        setRecentOrders(res.data.recentOrders);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <TopCards
          dailyRevenue={dailyRevenue}
          ytdRevenue={ytdRevenue}
          customers={customers}
        />
        <div className="mt-4 flex">
          <div className="flex-1">
            <BarChart />
          </div>
          <div className="w-1/3 ml-4">
            <RecentOrders orders={recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
