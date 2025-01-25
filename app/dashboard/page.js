"use client";
import { useAuth } from "@/contexts/AuthContext";
import BookingList from "@/components/dashboard/BookingList";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
      <BookingList />
    </div>
  );
}
