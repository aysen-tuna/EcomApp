"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";

export default function SignUpPage() {
  const { user, register } = useAuth();
  const router = useRouter();

  const [uiError, setUiError] = useState("");

  useEffect(() => {
    if (user?.email) router.replace("/");
  }, [user, router]);

  async function handleSignUp(email: string, password: string) {
    setUiError("");
    const response = await register(email, password);

    if (response === "ok") {
      router.replace("/");
      return;
    }

    setUiError(response);
  }

  return (
    <AuthCard
      title="Sign Up"
      buttonText="Sign Up"
      error={uiError}
      onSubmit={handleSignUp}
    />
  );
}
