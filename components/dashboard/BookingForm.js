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
    <div className="fixed inset-0 bg-darkSecondary/80 backdrop-blur-sm flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-darkPrimary p-6 rounded-lg shadow-xl shadow-darkSecondary/50 w-80 border border-darkText/10"
      >
        <h2 className="text-xl font-bold mb-6 text-darkText border-b border-darkText/10 pb-4">
          Book Expedition
        </h2>

        <label className="block text-sm font-medium mb-2 text-darkText">
          Number of Seats
        </label>

        <input
          type="number"
          min="1"
          max={availableSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full p-2 bg-darkSecondary border border-darkText/10 rounded-lg mb-6 text-darkText focus:ring-1 focus:ring-darkText/30 focus:border-darkText/30"
          required
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-darkSecondary text-darkText rounded-lg hover:bg-darkSecondary/80 transition-colors duration-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}
