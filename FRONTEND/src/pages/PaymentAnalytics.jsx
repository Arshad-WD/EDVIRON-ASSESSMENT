"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PaymentsAnalytics = () => {
  const [data, setData] = useState({ monthlyRevenue: [], monthlyStatus: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/analytics/payments");
        setData(res.data);
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-500 dark:text-gray-400 animate-pulse">
          🚀 Loading analytics...
        </p>
      </div>
    );
  }

  // Totals
  const totalRevenue = data.monthlyRevenue.reduce((acc, cur) => acc + cur.amount, 0);
  const totalSuccess = data.monthlyStatus.reduce((acc, cur) => acc + (cur.success || 0), 0);
  const totalFailed = data.monthlyStatus.reduce((acc, cur) => acc + (cur.failed || 0), 0);
  const totalPending = data.monthlyStatus.reduce((acc, cur) => acc + (cur.pending || 0), 0);

  // Chart Data
  const revenueData = {
    labels: data.monthlyRevenue.map((m) => m.month),
    datasets: [
      {
        label: "Revenue",
        data: data.monthlyRevenue.map((m) => m.amount),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  const statusData = {
    labels: data.monthlyStatus.map((s) => s.month),
    datasets: [
      { label: "Success", data: data.monthlyStatus.map((s) => s.success), backgroundColor: "#22c55e", borderRadius: 8 },
      { label: "Failed", data: data.monthlyStatus.map((s) => s.failed), backgroundColor: "#ef4444", borderRadius: 8 },
      { label: "Pending", data: data.monthlyStatus.map((s) => s.pending), backgroundColor: "#facc15", borderRadius: 8 },
    ],
  };

  const pieData = {
    labels: ["Success", "Failed", "Pending"],
    datasets: [
      { data: [totalSuccess, totalFailed, totalPending], backgroundColor: ["#22c55e", "#ef4444", "#facc15"], borderColor: "#f3f4f6", borderWidth: 2 },
    ],
  };

  const cardConfig = [
    { title: "Total Revenue", value: `₹${totalRevenue}`, gradient: "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800", color: "text-blue-600", icon: <TrendingUp className="w-6 h-6 text-blue-600" /> },
    { title: "Success Payments", value: totalSuccess, gradient: "from-green-50 to-green-100 dark:from-green-900 dark:to-green-800", color: "text-green-600", icon: <CheckCircle2 className="w-6 h-6 text-green-600" /> },
    { title: "Failed Payments", value: totalFailed, gradient: "from-red-50 to-red-100 dark:from-red-900 dark:to-red-800", color: "text-red-600", icon: <XCircle className="w-6 h-6 text-red-600" /> },
    { title: "Pending Payments", value: totalPending, gradient: "from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800", color: "text-yellow-600", icon: <Clock className="w-6 h-6 text-yellow-600" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Payments Analytics
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardConfig.map((stat, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 sm:p-6 shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br ${stat.gradient} transform transition duration-300 hover:scale-[1.03]`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</h3>
                {stat.icon}
              </div>
              <p className={`text-2xl sm:text-3xl md:text-4xl font-bold mt-3 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 sm:p-6 border border-gray-200 dark:border-gray-700 h-[320px] sm:h-[400px] flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
              Revenue Growth
            </h2>
            <Line
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb" } },
                  y: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb" } },
                },
              }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 sm:p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
              Payment Distribution
            </h2>
            <div className="w-full max-w-xs sm:max-w-sm h-[250px] sm:h-[300px]">
              <Doughnut
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom", labels: { color: "#6b7280" } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 sm:p-6 border border-gray-200 dark:border-gray-700 h-[320px] sm:h-[450px] flex flex-col">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
            Monthly Status Breakdown
          </h2>
          <Bar
            data={statusData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "top", labels: { color: "#6b7280" } } },
              scales: {
                x: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb" } },
                y: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentsAnalytics;
