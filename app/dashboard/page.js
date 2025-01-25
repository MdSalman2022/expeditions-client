"use client";
import { useAuth } from "@/contexts/AuthContext";
import BookingList from "@/components/dashboard/BookingList";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user)
    return (
      <div className="min-h-screen bg-darkSecondary flex items-center justify-center">
        <div className="text-darkText text-lg">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-darkSecondary p-6">
      <div className="max-w-4xl mx-auto bg-darkPrimary rounded-lg shadow-lg shadow-darkSecondary/50 p-6">
        <h1 className="text-3xl font-bold mb-8 text-darkText border-b border-darkText/10 pb-4">
          Your Bookings
        </h1>
        <BookingList />
      </div>
    </div>
  );
}
