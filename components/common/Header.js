"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-darkPrimary shadow-lg shadow-darkSecondary/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6 gap-5">
            <Link
              href="/"
              className="text-xl font-bold text-darkText hover:opacity-80"
            >
              Expedition CMS
            </Link>
          </div>
          <div className="flex items-center space-x-6 gap-5">
            <Link href="/" className="text-darkText hover:opacity-80">
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-darkText hover:opacity-80"
                >
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/analytics"
                    className="text-darkText hover:opacity-80"
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
                <span className="text-darkTextSecondary">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-darkText hover:opacity-80"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-darkText hover:opacity-80">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
