import { redirect } from "next/navigation";
import { getChallenges } from "@/lib/challenges.server";

export default async function Page() {
  const challenges = await getChallenges();
  const firstChallenge = challenges[0];
  redirect(`/challenges/${firstChallenge?.id}`);
}
