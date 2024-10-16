import { useEffect, useState } from "react";
import axios from "axios";

export default function TopCards() {
  const [metrics, setMetrics] = useState({
    dailyRevenue: 0,
    ytdRevenue: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await axios.get("/api/dashboard/metrics");
        setMetrics(response.data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="grid lg:grid-cols-3 gap-4 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">${metrics.dailyRevenue}</h2>
        <p>Daily Revenue</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">${metrics.ytdRevenue}</h2>
        <p>YTD Revenue</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">{metrics.totalCustomers}</h2>
        <p>Customers</p>
      </div>
    </div>
  );
}
