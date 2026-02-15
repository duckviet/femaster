import { redirect } from "next/navigation";
import { getChallenges } from "@/lib/challenges.server";

export default async function Page() {
  // Redirect to the first challenge
  const challenges = await getChallenges();

  if (challenges.length > 0) {
    redirect(`/challenges/${challenges[0].id}`);
  }

  redirect("/challenges");
}
