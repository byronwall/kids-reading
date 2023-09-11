import { QuestionPractice } from "~/components/QuestionPractice";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <section className="flex flex-col items-center gap-4">
        <h1>A site to help with kid's reading.</h1>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center gap-4">
      <QuestionPractice />
    </section>
  );
}
