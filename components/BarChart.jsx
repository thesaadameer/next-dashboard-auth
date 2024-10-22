
// components/BarChart.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

export default function BarChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await axios.get("/api/dashboard/daily-revenue");
        setChartData({
          labels: response.data.labels,
          datasets: [
            {
              label: "Daily Revenue",
              data: response.data.revenueData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }
    fetchChartData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={chartData} />
    </div>
  );
}
