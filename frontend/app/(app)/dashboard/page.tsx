"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchAnalytics(token)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading analytics…
      </div>
    );
  }

  /* 🔹 Empty State */
  if (!data || data.totalTickets === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold mb-3">
          Welcome to your dashboard 👋
        </h2>
        <p className="text-gray-600 max-w-md mb-8">
          You don’t have any tickets yet. Create your first support ticket to
          start tracking analytics and performance.
        </p>
        <a
          href="/tickets/new"
          className="bg-black text-white px-8 py-3 rounded-lg shadow hover:bg-gray-900 transition"
        >
          Create Your First Ticket
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Top Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500">
              Overview of your support activity
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <a
              href="/tickets"
              className="px-4 py-2 rounded border bg-white hover:bg-gray-100 transition"
            >
              View Tickets
            </a>

            <a
              href="/tickets/new"
              className="px-4 py-2 rounded bg-black text-white hover:bg-gray-900 transition"
            >
              + New Ticket
            </a>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded border text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* 🔹 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Tickets"
            value={data.totalTickets}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="High Priority"
            value={data.highPriority}
            gradient="from-red-500 to-red-600"
          />
          <StatCard
            title="Resolution Rate"
            value={`${data.resolutionRate}%`}
            gradient="from-green-500 to-green-600"
          />
        </div>

        {/* 🔹 Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tickets by Status */}
          <ChartCard title="Tickets by Status">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.statusBreakdown}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Tickets Over Time */}
          <ChartCard title="Tickets Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.ticketsOverTime}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#111827"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}

/* 🔹 Reusable Stat Card */
function StatCard({
  title,
  value,
  gradient,
}: {
  title: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <div
      className={`rounded-xl p-5 text-white shadow bg-gradient-to-br ${gradient}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

/* 🔹 Reusable Chart Card */
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function handleLogout() {
  localStorage.clear(); // removes token + anything else
  window.location.replace("/login"); // prevents back navigation
}
