"use client";

import { useEffect, useState } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading tickets…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tickets</h1>
            <p className="text-sm text-gray-500">
              Manage and update support tickets
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/tickets/new"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
            >
              + New Ticket
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto p-6">
        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-2">No tickets found</h2>
            <p className="text-gray-600 mb-6">
              Create your first ticket to get started.
            </p>
            <a
              href="/tickets/new"
              className="bg-black text-white px-6 py-3 rounded"
            >
              Create Ticket
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{ticket.title}</p>

                  <div className="flex gap-2 text-sm">
                    <Badge type="status" value={ticket.status} />
                    <Badge type="priority" value={ticket.priority} />
                  </div>
                </div>

                <a
                  href={`/tickets/${ticket.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View / Edit →
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* 🔹 Badge Component */
function Badge({
  type,
  value,
}: {
  type: "status" | "priority";
  value: string;
}) {
  const styles: any = {
    status: {
      open: "bg-blue-100 text-blue-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      closed: "bg-green-100 text-green-700",
    },
    priority: {
      low: "bg-gray-100 text-gray-700",
      medium: "bg-orange-100 text-orange-700",
      high: "bg-red-100 text-red-700",
    },
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type][value]}`}
    >
      {value.replace("_", " ")}
    </span>
  );
}
