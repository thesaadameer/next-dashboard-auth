
// components/RecentOrders.jsx


import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get("/api/dashboard/recent-orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order, index) => (
            <li key={index} className="my-3">
              <div className="flex justify-between">
                <span>${order.amount}</span>
                <span>{order.studentName}</span>
                <span>{order.timeAgo}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent purchases</p>
      )}
    </div>
  );
}
