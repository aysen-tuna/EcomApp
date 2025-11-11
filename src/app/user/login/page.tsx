"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { useRouter,usePathname } from "next/navigation";
import { getUIErrorFromFirebaseError } from "@/lib/firebase";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const { user, login} = useAuth();
   const pathname = usePathname();
  const [uiError, setUiError] = useState("");

  useEffect(() => {
    setUiError("");
  }, []);
  

  useEffect(() => {
    if (user?.email) router.replace("/");
  }, [user, router]);

  return (
    <div className="w-full flex justify-center">
      <AuthCard
        title="Login"
        buttonText="Login"
        error={uiError}
        onSubmit={async (email, password) => {
          const response = await login(email, password);
          if (response === "ok") {router.replace("/");
           } else {
            setUiError(getUIErrorFromFirebaseError(response)); 
          }
        }}
      />
    </div>
  );
}