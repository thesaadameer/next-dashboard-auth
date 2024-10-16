"use client";

import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const metricsResponse = await axios.get("/api/dashboard/metrics");
        setMetrics(metricsResponse.data);

        const dailyRevenueResponse = await axios.get(
          "/api/dashboard/daily-revenue"
        );
        setDailyRevenue(dailyRevenueResponse.data);

        const recentOrdersResponse = await axios.get(
          "/api/dashboard/recent-orders"
        );
        setRecentOrders(recentOrdersResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">${metrics.dailyRevenue}</h2>
            <p>Daily Revenue</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">${metrics.ytdRevenue}</h2>
            <p>YTD Revenue</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">{metrics.totalCustomers}</h2>
            <p>Customers</p>
          </div>
        </div>

        {/* Chart and Recent Orders */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* You can add BarChart here to visualize daily revenue */}
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <ul>
              {recentOrders.map((order, index) => (
                <li key={index} className="border-b p-2">
                  {order.student.name} - ${order.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
