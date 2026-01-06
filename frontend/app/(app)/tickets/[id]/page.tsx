"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
        setPriority(data.priority);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate() {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, priority }),
    });

    setSaving(false);
    alert("Ticket updated successfully");
  }

  async function handleAiSuggest() {
    const token = localStorage.getItem("token");
    if (!token || !ticket) return;

    setAiLoading(true);
    setAiReply("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/suggest-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticketTitle: ticket.title,
            ticketDescription: ticket.description,
          }),
        }
      );

      const data = await res.json();
      setAiReply(data.reply);
    } catch (err) {
      alert("Failed to generate AI reply");
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading ticket…
      </div>
    );
  }

  if (!ticket) {
    return <p className="p-6">Ticket not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <div>
            <h1 className="text-xl font-bold">Ticket Details</h1>
            <p className="text-sm text-gray-500">Ticket #{ticket.id}</p>
          </div>

          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/tickets"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Tickets
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Ticket Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-2xl font-bold">{ticket.title}</h2>
          <p className="text-gray-600">{ticket.description}</p>

          <div className="flex gap-2">
            <Badge type="status" value={ticket.status} />
            <Badge type="priority" value={ticket.priority} />
          </div>
        </div>

        {/* Edit Section */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg">Edit Ticket</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
        {/* 🤖 AI Suggested Reply */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            🤖 AI Suggested Reply
          </h3>

          <p className="text-sm text-gray-600">
            Generate a professional response based on this ticket.
          </p>

          <button
            onClick={handleAiSuggest}
            disabled={aiLoading}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {aiLoading ? "Generating…" : "Generate Reply"}
          </button>

          {aiReply && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                AI Response
              </label>
              <textarea
                value={aiReply}
                readOnly
                rows={6}
                className="w-full border rounded p-3 text-sm bg-gray-50"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* 🔹 Badge */
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
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type][value]}`}
    >
      {value.replace("_", " ")}
    </span>
  );
}
