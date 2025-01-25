import React, { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function BookingForm({ expeditionId, availableSeats, onClose }) {
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/bookings", { expeditionId, seats });
      onClose();
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        switch (status) {
          case 400:
            toast.error(
              data.error || "Invalid request. Please check your input."
            );
            break;
          case 401:
            toast.error("Please login first");
            break;
          case 404:
            toast.error(data.error || "Expedition not found");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error("Failed to book expedition");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4">Book Expedition</h2>
        <label className="block text-sm font-medium mb-2">Seats</label>
        <input
          type="number"
          min="1"
          max={availableSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}
