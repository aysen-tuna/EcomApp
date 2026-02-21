import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import SuccessClient from "./successClient";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status } = session;
  const customerEmail = session.customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <section id="success" className="text-center max-w-4xl mx-auto">
        <SuccessClient />
        <div className="bg-neutral-200 dark:bg-neutral-900 rounded-xl h-40 flex items-center">
          <p>
            We appreciate your business! A confirmation email will be sent to{" "}
            {customerEmail}. If you have any questions, please email{" "}
            {"abc@abc.com "}
          </p>
        </div>
      </section>
    );
  }
  return redirect("/");
}
