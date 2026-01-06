"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-xl font-bold">SupportSaaS</h1>
        <div className="space-x-4">
          <a
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Login
          </a>
          <a
            href="/register"
            className="text-sm font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-5xl font-bold leading-tight mb-6">
          AI-Powered Customer <br />
          Support Platform
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          A multi-tenant SaaS for managing support tickets, analytics, and
          AI-assisted responses — built for modern teams.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="bg-black text-white px-6 py-3 rounded text-lg hover:bg-gray-800"
          >
            Start Free
          </a>
          <a
            href="/login"
            className="border border-gray-300 px-6 py-3 rounded text-lg hover:bg-gray-100"
          >
            Login
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="AI-Assisted Replies"
          description="Generate professional support responses instantly using AI, while keeping humans in control."
        />
        <FeatureCard
          title="Advanced Analytics"
          description="Track ticket trends, resolution rates, and workload with real-time dashboards."
        />
        <FeatureCard
          title="Multi-Tenant Architecture"
          description="Secure, isolated data per business using schema-based multi-tenancy."
        />
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pb-6">
        © {new Date().getFullYear()} SupportSaaS. Built by Madhur Gupta.
      </footer>
    </div>
  );
}

/* Feature card component */
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
