"use client";
import React, { useState, useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import BookingForm from "./BookingForm";

export default function ExpeditionCard({ expedition }) {
  const [availableSeats, setAvailableSeats] = useState(
    expedition.totalSeats - expedition.bookedSeats
  );
  const [isBooking, setIsBooking] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-expedition", expedition._id);

    const handleSeatUpdate = (bookedSeats) => {
      setAvailableSeats(expedition.totalSeats - bookedSeats);
    };

    socket.on("seats-updated", handleSeatUpdate);

    return () => {
      socket.off("seats-updated", handleSeatUpdate);
      socket.emit("leave-expedition", expedition._id);
    };
  }, [socket, expedition]);

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">{expedition.title}</h3>
      <p className="text-gray-600">Available seats: {availableSeats}</p>
      <button
        onClick={() => setIsBooking(true)}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        disabled={availableSeats === 0}
      >
        {availableSeats > 0 ? "Book Now" : "Sold Out"}
      </button>

      {isBooking && (
        <BookingForm
          expeditionId={expedition._id}
          availableSeats={availableSeats}
          onClose={() => setIsBooking(false)}
        />
      )}
    </div>
  );
}
