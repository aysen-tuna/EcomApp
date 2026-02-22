import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function getUidFromSession(): Promise<string> {
  const sessionCookie = (await cookies()).get("__session")?.value;
  if (!sessionCookie) return "guest";

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch {
    return "guest";
  }
}
