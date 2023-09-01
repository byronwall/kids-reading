import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { RegisterNewUser } from "~/components/RegisterNewUser";
import { authOptions } from "~/server/auth";

export default async function RegisterPage() {
  // this ensures that if a user is already logged in, they can't see this page
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <section className="flex flex-col gap-4">
      <h2>create new user</h2>
      <RegisterNewUser />
    </section>
  );
}
