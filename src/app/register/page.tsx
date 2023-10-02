import { redirect } from "next/navigation";

import { RegisterNewUser } from "~/components/user/RegisterNewUser";
import { getServerAuthSession } from "~/server/auth";

export default async function RegisterPage() {
  // this ensures that if a user is already logged in, they can't see this page
  const session = await getServerAuthSession();

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
