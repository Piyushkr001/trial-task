// src/lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireUser() {
  const authResult = await auth(); // Await the auth() call
  const { userId } = authResult; // Now you can access userId
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  
  const user = await currentUser();
  if (!user) throw new Response("Unauthorized", { status: 401 });

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  return { user, email: email! };
}