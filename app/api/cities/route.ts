
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const API_KEY = process.env.OPENWEATHER_API_KEY; 

//  GET: Fetch all cities with weather
export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      include: { weather: true },
      orderBy: {
        createdAt: 'desc' 
      }
    });

    return NextResponse.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("GET cities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}

// ✅ POST: Add new city + fetch weather
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, country, lat, lon } = body;

//     if (!name || !country || lat === undefined || lon === undefined) {
//       return NextResponse.json(
//         { error: "All fields are required (name, country, lat, lon)" },
//         { status: 400 }
//       );
//     }

//     // ✅ Check duplicate city
//     const existingCity = await prisma.city.findFirst({
//       where: {
//         name: { equals: name, mode: "insensitive" },
//       },
//     });

//     if (existingCity) {
//       return NextResponse.json(
//         { error: "City already exists" },
//         { status: 409 }
//       );
//     }

//     // ✅ 1. Create city
//     const city = await prisma.city.create({
//       data: {
//         name,
//         country,
//         lat: Number(lat),
//         lon: Number(lon),
//       },
//     });

//     // ✅ 2. Fetch weather from OpenWeather API
//     let weather = null;

//     if (API_KEY) {
//       const weatherRes = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
//       );

//       const weatherData = await weatherRes.json();
      
//       // ✅ 3. Save weather in DB
//       weather = await prisma.weather.create({
//         data: {
//           cityId: city.id,
//           temperature: weatherData.main.temp,
//           humidity: weatherData.main.humidity,
//           condition: weatherData.weather[0].description,
//           windSpeed: weatherData.wind.speed,
//         },
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "City + Weather added successfully ",
//       data: {
//         ...city,
//         weather,
//       },
//     });
//   } catch (error) {
//     console.error("POST city error:", error);
//     return NextResponse.json(
//       { error: "Failed to add city" },
//       { status: 500 }
//     );
//   }
// }
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const id = Number(body.id);

    if (isNaN(id)) return new Response('Invalid ID', { status: 400 });

    // Delete the weather first (only one because cityId is unique)
    await prisma.weather.deleteMany({
      where: { cityId: id },
    });

    // Delete the city
    await prisma.city.delete({
      where: { id },
    });

    return new Response('City deleted', { status: 200 });
  } catch (err: unknown) {
  console.error('DELETE city error:', err);

  // Type guard to safely access message
  // const message =
  //   err instanceof Error ? err.message : 'Something went wrong';

  // return new Response(message, { status: 500 });
}
}