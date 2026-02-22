import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import SuccessClient from "./successClient";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/");

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.status !== "complete") redirect("/");

  return <SuccessClient />;
}