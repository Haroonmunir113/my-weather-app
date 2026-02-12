
"use client";
import { useState, useEffect } from "react";
import getCities from "@/lib/getCities";
import { City } from "@/types/weather";

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "info" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    setLoading(true);
    try {
      const data = await getCities();
      setCities(data);
    } catch (error) {
      setMessage({ text: "Failed to load cities", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCity(e: React.FormEvent) {
    e.preventDefault();
    if (!cityName.trim()) {
      setMessage({ text: "City name is required", type: "error" });
      return;
    }

    setMessage({ text: "Adding city and fetching weather...", type: "info" });

    try {
      const res = await fetch("/api/weather/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Failed to add city", type: "error" });
      } else {
        setMessage({
          text: `✅ City "${data.data.city}" added successfully!`,
          type: "success",
        });
        setCityName("");
        setShowForm(false);

        // Fetch and sort cities
        const updatedCities = await getCities();
        const sortedCities = [...updatedCities].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setCities(sortedCities);
      }
    } catch (error: unknown) {
      setMessage({
        text:
          "Error adding city: " +
          (error instanceof Error ? error.message : "Unknown error"),
        type: "error",
      });
    }
  }
  // Optional: Function to manually refresh weather for a specific city
  async function refreshWeather(cityId: string, cityName: string) {
    setMessage({ text: `Refreshing weather for ${cityName}...`, type: "info" });

    try {
      // First, get the city to have its name
      const city = cities.find((c) => c.id === cityId);
      if (!city) return;

      // Call the weather endpoint with the city name
      const res = await fetch("/api/weather/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: city.name,
        }),
      });

      if (res.ok) {
        setMessage({
          text: `✅ Weather for ${city.name} updated!`,
          type: "success",
        });
        fetchCities(); // Refresh the list
      } else {
        const error = await res.json();
        setMessage({ text: error.error || "Failed to refresh", type: "error" });
      }
    } catch (error: unknown) {
      setMessage({
        text:
          "Error refreshing weather: " +
          (error instanceof Error ? error.message : "Unknown error"),
        type: "error",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          🌤️ Weather Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Track weather in your favorite cities
        </p>
      </header>

      {/* Add / Manage Cities */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Manage Cities</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "➕ Add New City"}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleAddCity} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City Name *
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="city"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g., New York, Tokyo, London"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors"
                  >
                    Add City
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  * Enter a city name. The system will automatically fetch its
                  coordinates and current weather.
                </p>
              </div>
            </form>
          )}

          {/* Message */}
          {message.text && (
            <div
              className={`p-3 rounded-lg mb-4 text-center font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : message.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Cities Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Your Cities ({cities.length})
          </h2>
          <button
            onClick={fetchCities}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Refresh All
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : cities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <p className="text-gray-500 text-lg mb-4">No cities added yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Add Your First City
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">
                      {city.name}, {city.country}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {/* {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}° */}
                    </p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                    onClick={async () => {
                      if (!confirm(`Delete ${city.name}?`)) return;

                      try {
                        const res = await fetch("/api/cities", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: city.id }),
                        });

                        if (res.ok) {
                          fetchCities();
                          setMessage({
                            text: `✅ ${city.name} deleted`,
                            type: "success",
                          });
                        } else {
                          const text = await res.text();
                          setMessage({
                            text: `Failed to delete: ${text}`,
                            type: "error",
                          });
                        }
                      } catch (err: unknown) {
                        setMessage({
                          text:
                            err instanceof Error
                              ? err.message
                              : "Unknown error",
                          type: "error",
                        });
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Weather Info */}
                {city.weather ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-4xl font-extrabold text-gray-800">
                        {city.weather.temperature}°C
                      </p>
                      <button
                        onClick={() =>
                          refreshWeather(city.id.toString(), city.name)
                        }
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="Refresh weather"
                      >
                        🔄
                      </button>
                    </div>
                    <p className="capitalize text-gray-600">
                      {city.weather.condition}
                    </p>

                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-gray-500">
                        <span>Humidity</span>
                        <span className="font-medium">
                          {city.weather.humidity}%
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Wind Speed</span>
                        <span className="font-medium">
                          {city.weather.windSpeed} m/s
                        </span>
                      </div>
                      {/* Removed feelsLike since your backend doesn't include it */}
                      <div className="text-xs text-gray-400 mt-3">
                        Updated:{" "}
                        {new Date(city.weather.updatedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-400 mb-3">No weather data</p>
                    <button
                      onClick={() =>
                        refreshWeather(city.id.toString(), city.name)
                      }
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Fetch Weather
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Weather App • All rights reserved
      </footer>
    </div>
  );
}
