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
    <div className="bg-darkPrimary border border-darkText/10 p-6 rounded-lg shadow-lg shadow-darkSecondary/20 hover:shadow-xl transition-all duration-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-darkText mb-2">
            {expedition.title}
          </h3>
          <p className="text-darkTextSecondary">{expedition.destination}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-darkText">
              ${expedition.price}
            </p>
            <p className="text-sm text-darkTextSecondary">per person</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              availableSeats > 5
                ? "bg-green-500/10 text-green-400"
                : availableSeats > 0
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {availableSeats} seats left
          </div>
        </div>

        <div className="pt-4 border-t border-darkText/10">
          <button
            onClick={() => setIsBooking(true)}
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
              availableSeats === 0
                ? "bg-darkSecondary/50 text-darkTextSecondary cursor-not-allowed"
                : "bg-darkSecondary text-darkText hover:bg-darkSecondary/80"
            }`}
            disabled={availableSeats === 0}
          >
            {availableSeats > 0 ? "Book Now" : "Sold Out"}
          </button>
        </div>
      </div>

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
