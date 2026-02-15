// app/page.tsx
import { domainStructure } from "@/lib/challenges";
import { getChallenges } from "@/lib/challenges.server";
import { LandingContent } from "@/components/landing-content";

export default async function Page() {
  const challenges = await getChallenges();
  const firstChallenge = challenges[0];

  return (
    <LandingContent
      challengeCount={challenges.length}
      domainCount={domainStructure.length}
      firstChallengeId={firstChallenge?.id}
    />
  );
}
