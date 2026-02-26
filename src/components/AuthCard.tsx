"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUIErrorFromFirebaseError } from "@/lib/firebase/firebase";

type Props = {
  title: string;
  buttonText: string;
  error?: string;
  onSubmit: (email: string, password: string) => Promise<void>;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthCard({ title, buttonText, error, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    if (!email.trim()) return setLocalError("ui/empty-email");

    if (!emailRegex.test(email.trim()))
      return setLocalError("auth/invalid-email");

    if (!password.trim()) return setLocalError("ui/empty-password");

    await onSubmit(email.trim(), password);
  }
  const errorCodeToShow = localError || error || "";
  const errorMessage = errorCodeToShow
    ? getUIErrorFromFirebaseError(errorCodeToShow)
    : "";

  return (
    <div className="w-full flex min-h-[calc(100dvh-120px)] justify-center items-center pt-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-neutral-200 dark:bg-neutral-800"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-neutral-200 dark:bg-neutral-800"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-8 ">
              {buttonText}
            </Button>

            {errorMessage ? (
              <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
