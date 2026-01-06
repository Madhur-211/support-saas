export async function fetchAnalytics(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return res.json();
}
