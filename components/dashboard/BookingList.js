"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-gray-500">No bookings found</div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{booking.expedition?.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                {user?.role === "admin" && (
                  <p className="text-sm text-gray-600">
                    Booked by: {booking.user?.email}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${booking.expedition?.price * booking.seats}
                </p>
                <p className="text-sm text-gray-600">{booking.seats} seats</p>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
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
