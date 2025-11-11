"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { useRouter ,usePathname } from "next/navigation";
import { getUIErrorFromFirebaseError } from "@/lib/firebase";
import { AuthCard } from "@/components/AuthCard";

export default function SignUpPage() {
  
  const { user, register } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

   const [uiError, setUiError] = useState("");

    useEffect(() => {
    setUiError("");
  }, [pathname]);

 
  useEffect(() => {
    if (user?.email) router.replace("/");
  }, [user, router]);

 

  return (
    <AuthCard
      title="Sign Up"
      buttonText="Sign Up"
      error={uiError}
      onSubmit={async (email, password) => {
        const response = await register(email, password);
         if (response === "ok") {
          router.replace("/");
        } else {
          setUiError(getUIErrorFromFirebaseError(response));
        }
      }}
    />
  );
}