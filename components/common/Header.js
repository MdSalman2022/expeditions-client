"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6 gap-5">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Expedition CMS
            </Link>
          </div>
          <div className="flex items-center space-x-6 gap-5">
            <Link href="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/analytics"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Analytics
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
