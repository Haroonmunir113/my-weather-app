
export async function getLatLon(city: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${apiKey}`
  );

  const data = await res.json();
  console.log("Geo API response:", data);
  if (!data.length) return null;

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    country: data[0].country,
  };
}