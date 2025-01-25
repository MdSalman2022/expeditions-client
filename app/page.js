"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import ExpeditionCard from "@/components/dashboard/ExpeditionCard";

export default function HomePage() {
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    destination: "",
    startDate: "",
  });

  useEffect(() => {
    const fetchExpeditions = async () => {
      try {
        const response = await api.get("/expeditions");
        setExpeditions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpeditions();
  }, []);

  const filteredExpeditions = expeditions?.filter((expedition) => {
    const matchesDestination =
      !filters.destination ||
      expedition.destination.toLowerCase() ===
        filters.destination.toLowerCase();
    const matchesDate =
      !filters.startDate ||
      new Date(expedition.startDate) >= new Date(filters.startDate);
    return matchesDestination && matchesDate;
  });

  const uniqueDestinations = [
    ...new Set(expeditions.map((e) => e.destination)),
  ];

  if (loading)
    return <div className="text-center p-8">Loading expeditions...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Expeditions</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Destination</label>
          <select
            value={filters.destination}
            onChange={(e) =>
              setFilters({ ...filters, destination: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Destinations</option>
            {uniqueDestinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExpeditions.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No expeditions found matching your criteria
          </div>
        ) : (
          filteredExpeditions.map((expedition) => (
            <ExpeditionCard key={expedition._id} expedition={expedition} />
          ))
        )}
      </div>
    </div>
  );
}
