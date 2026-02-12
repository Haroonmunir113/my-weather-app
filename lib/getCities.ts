
import { City } from "@/types/weather";

export default async function getCities(): Promise<City[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cities`, {
      cache: "no-store", // important for fresh data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch cities: ${res.statusText}`);
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}