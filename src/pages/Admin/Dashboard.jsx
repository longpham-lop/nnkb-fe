import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function Dashboard({ events }) {
  // Doanh thu mỗi sự kiện
  const revenueData = events.map((e) => ({
    name: e.name,
    revenue: (e.price || 0) * ((5000 - (e.stock || 0))), // giả sử tổng 5000 vé
  }));

  // Trạng thái sự kiện
  const statusCounts = events.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  const COLORS = ["#4ade80", "#60a5fa", "#9ca3af", "#facc15"];

  return (
    <div>
      <h1>Biểu đồ thống kê</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
