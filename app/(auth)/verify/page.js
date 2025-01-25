"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify?token=${token}`
        );
        const { token: jwtToken } = await response.json();
        login(jwtToken);
        router.push("/dashboard");
      } catch (error) {
        router.push("/login?error=invalid_token");
      }
    };

    if (token) verifyToken();
  }, [token]);

  return <div className="text-center p-8">Verifying...</div>;
}
