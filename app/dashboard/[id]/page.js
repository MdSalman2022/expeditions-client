"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Error loading booking:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
        setError(error.response?.data?.message || "Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id, user]);

  if (!user) return null;

  if (loading)
    return (
      <div className="min-h-screen bg-darkSecondary flex items-center justify-center">
        <div className="text-white text-lg font-medium">
          Loading booking details...
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-white hover:text-darkText/80 mb-6 flex items-center gap-2 px-4 py-2 bg-darkPrimary rounded-lg transition-colors duration-200"
      >
        <span className="text-lg">←</span> Back to Dashboard
      </button>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-lg">
          {error}
        </div>
      ) : booking ? (
        <div className="bg-darkPrimary rounded-lg shadow-xl shadow-darkSecondary/50 p-8">
          <h1 className="text-2xl font-bold mb-8 text-white border-b border-white/10 pb-4">
            Booking Details
          </h1>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-darkText/90 bg-darkSecondary/40 p-4 rounded-lg">
                <span className="block text-white font-medium mb-1">
                  Expedition
                </span>
                {booking.expedition?.title}
              </p>
              <p className="text-darkText/90 bg-darkSecondary/40 p-4 rounded-lg">
                <span className="block text-white font-medium mb-1">
                  Destination
                </span>
                {booking.expedition?.destination}
              </p>
              <p className="text-darkText/90 bg-darkSecondary/40 p-4 rounded-lg">
                <span className="block text-white font-medium mb-1">
                  Travel Period
                </span>
                {new Date(booking.expedition?.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.expedition?.endDate).toLocaleDateString()}
              </p>
              <p className="text-darkText/90 bg-darkSecondary/40 p-4 rounded-lg">
                <span className="block text-white font-medium mb-1">
                  Seats Booked
                </span>
                {booking.seats}
              </p>
              <p className="text-darkText/90 bg-darkSecondary/40 p-4 rounded-lg">
                <span className="block text-white font-medium mb-1">
                  Total Price
                </span>
                ${booking.expedition?.price * booking.seats}
              </p>
              <p className="text-darkText/90 bg-darkSecondary/40 p-4 rounded-lg">
                <span className="block text-white font-medium mb-1">
                  Booking Date
                </span>
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-lg">
          Booking not found
        </div>
      )}
    </div>
  );
}
