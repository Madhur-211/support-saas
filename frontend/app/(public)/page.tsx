export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Support SaaS</h1>
      <p className="text-gray-600 mb-6">
        AI-powered multi-tenant support system
      </p>
      <div className="space-x-4">
        <a href="/login" className="underline">
          Login
        </a>
        <a href="/register" className="underline">
          Register
        </a>
      </div>
    </div>
  );
}
