"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [uiError, setUiError] = useState("");

  useEffect(() => {
    if (user?.email) router.replace("/");
  }, [user, router]);

  async function handleLogin(email: string, password: string) {
    setUiError("");
    const response = await login(email, password);

    if (response === "ok") {
      router.replace("/");
      return;
    }

    setUiError(response);
  }

  return (
    <div className="w-full flex justify-center">
      <AuthCard
        title="Login"
        buttonText="Login"
        error={uiError}
        onSubmit={handleLogin}
      />
    </div>
  );
}
