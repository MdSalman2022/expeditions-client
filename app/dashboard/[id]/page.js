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
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id, user]);

  if (!user) return null;
  if (loading) return <div className="p-4">Loading booking details...</div>;

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.back()}
        className="text-indigo-600 hover:text-indigo-800 mb-4"
      >
        ← Back to Dashboard
      </button>

      {booking ? (
        <>
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Expedition:</span>{" "}
              {booking.expedition?.title}
            </p>
            <p>
              <span className="font-semibold">Destination:</span>{" "}
              {booking.expedition?.destination}
            </p>
            <p>
              <span className="font-semibold">Dates:</span>{" "}
              {new Date(booking.expedition?.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.expedition?.endDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Seats Booked:</span>{" "}
              {booking.seats}
            </p>
            <p>
              <span className="font-semibold">Total Price:</span> $
              {booking.expedition?.price * booking.seats}
            </p>
            <p>
              <span className="font-semibold">Booking Date:</span>{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
        </>
      ) : (
        <div className="text-red-500">Booking not found</div>
      )}
    </div>
  );
}
