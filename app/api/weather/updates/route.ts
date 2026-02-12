
import prisma from "@/lib/prisma";
import { getLatLon } from "@/lib/getLatLon";
import { fetchWeather } from "@/lib/fetchWeather";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cityName = body.city?.trim();

    if (!cityName) {
      return Response.json({ error: "City required" }, { status: 400 });
    }

    //  Get lat/lon from Geo API
    const geo = await getLatLon(cityName);

    if (!geo) {
      return Response.json({ error: "City not found" }, { status: 404 });
    }

    // ✅ 2. Find or create city in DB
    let city = await prisma.city.findFirst({
      where: { name: { equals: cityName, mode: "insensitive" } },
    });

    if (!city) {
      city = await prisma.city.create({
        data: {
          name: cityName,
          country: geo.country,
          lat: geo.lat,
          lon: geo.lon,
        },
      });
    }

    // Fetch latest weather
    const weatherData = await fetchWeather(city.lat, city.lon);

    //  Save / Update weather in DB
    await prisma.weather.upsert({
      where: { cityId: city.id },
      update: {
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        condition: weatherData.condition,
      },
      create: {
        cityId: city.id,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        condition: weatherData.condition,
      },
    });

    return Response.json({
      success: true,
      data: {
        city: city.name,
        country: city.country,
        
        ...weatherData,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}