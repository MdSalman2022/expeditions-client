"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CreateExpeditionForm from "@/components/admin/CreateExpeditionForm";
import api from "@/lib/api";

export default function AdminExpeditions() {
  const { user } = useAuth();
  const [expeditions, setExpeditions] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      loadExpeditions();
    }
  }, [user]);

  const loadExpeditions = async () => {
    try {
      const response = await api.get("/expeditions");
      setExpeditions(response.data);
    } catch (error) {
      console.error("Error loading expeditions:", error);
    }
  };

  if (user?.role !== "admin") {
    return <div className="p-4 text-red-500">Admin access required</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Expeditions</h1>

      <CreateExpeditionForm onSuccess={loadExpeditions} />

      <div className="mt-8 space-y-4">
        {expeditions.map((expedition) => (
          <div key={expedition._id} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{expedition.title}</h3>
            <p className="text-gray-600">{expedition.destination}</p>
            <p>
              Seats: {expedition.bookedSeats}/{expedition.totalSeats}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
