"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MagicLinkForm from "@/components/auth/MagicLinkForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    router.push("/check-email");
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <MagicLinkForm
        email={email}
        setEmail={setEmail}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
