"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const loadBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Booking deleted successfully");
      loadBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  const handleBookingClick = (bookingId) => {
    router.push(`/dashboard/${bookingId}`);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading)
    return (
      <div className="text-darkText text-center py-4">Loading bookings...</div>
    );

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-darkTextSecondary text-center py-4">
          No bookings found
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="cursor-pointer bg-darkPrimary border border-darkText/10 p-4 rounded-lg shadow-lg shadow-darkSecondary/20 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex justify-between items-start ">
              <div
                onClick={() => handleBookingClick(booking._id)}
                className="group"
              >
                <h3 className="font-semibold text-darkText group-hover:text-yellow-500">
                  {booking.expedition?.title}
                </h3>
                <p className="text-sm text-darkTextSecondary">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                {user?.role === "admin" && (
                  <p className="text-sm text-darkTextSecondary">
                    Booked by: {booking.user?.email}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium text-darkText">
                  ${booking.expedition?.price * booking.seats}
                </p>
                <p className="text-sm text-darkTextSecondary">
                  {booking.seats} seats
                </p>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="mt-2 text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                  >
                    Delete Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
