"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"];

export default function Analytics() {
  const { user } = useAuth();
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [bookingsPerMonth, setBookingsPerMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [popularRes, bookingsRes] = await Promise.all([
          api.get("/expeditions/analytics/popular"),
          api.get("/expeditions/analytics/bookings-per-month"),
        ]);

        setPopularDestinations(popularRes.data);

        const monthlyData = MONTHS.map((month, index) => {
          const monthData = bookingsRes.data.find(
            (item) => item._id === index + 1
          );
          return {
            name: month,
            bookings: monthData ? monthData.totalBookings : 0,
          };
        });
        setBookingsPerMonth(monthlyData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkSecondary flex items-center justify-center">
        <div className="text-darkText text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-darkText">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-darkPrimary p-6 rounded-lg shadow-lg shadow-darkSecondary/50">
          <h2 className="text-xl font-semibold mb-4 text-darkText">
            Monthly Bookings
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#172554",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#E2E8F0",
                  }}
                />
                <Bar dataKey="bookings" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-darkPrimary p-6 rounded-lg shadow-lg shadow-darkSecondary/50">
          <h2 className="text-xl font-semibold mb-4 text-darkText">
            Popular Destinations
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularDestinations}
                  nameKey="_id"
                  dataKey="totalBookings"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ _id }) => _id}
                >
                  {popularDestinations.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#172554",
                    border: "none",
                    borderRadius: "0.375rem",
                    color: "#E2E8F0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
