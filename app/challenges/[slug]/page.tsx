import { notFound } from "next/navigation";
import {
  getChallengeBySlug,
  getAllChallengeSlugs,
  getChallenges,
} from "@/lib/challenges.server";
import { ChallengeProvider } from "@/app/challenges/challenge-context";
import { ChallengesLayoutInner } from "@/app/challenges/layout-inner";
import ChallengeClient from "./challenge-client";

export async function generateStaticParams() {
  const slugs = await getAllChallengeSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    return {
      title: "Challenge Not Found",
    };
  }

  return {
    title: `${challenge.title} - FE Master Challenges`,
    description: challenge.statement,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    notFound();
  }

  const challenges = await getChallenges();

  // Get current index and navigation info
  const currentIndex = challenges.findIndex((c) => c.id === challenge.id);
  const canGoNext = currentIndex < challenges.length - 1;
  const canGoPrev = currentIndex > 0;
  const nextChallenge = canGoNext ? challenges[currentIndex + 1] : null;
  const prevChallenge = canGoPrev ? challenges[currentIndex - 1] : null;

  return (
    <ChallengeProvider
      challenge={challenge}
      currentIndex={currentIndex}
      canGoNext={canGoNext}
      canGoPrev={canGoPrev}
      nextSlug={nextChallenge?.id}
      prevSlug={prevChallenge?.id}
    >
      <ChallengesLayoutInner
        challenge={challenge}
        challenges={challenges}
        currentIndex={currentIndex}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        nextSlug={nextChallenge?.id}
        prevSlug={prevChallenge?.id}
      >
        <ChallengeClient challenge={challenge} />
      </ChallengesLayoutInner>
    </ChallengeProvider>
  );
}
