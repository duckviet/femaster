import { notFound } from "next/navigation";
import {
  getChallengeBySlug,
  getAllChallengeSlugs,
  challenges,
} from "@/lib/challenges";
import { ChallengesLayoutInner } from "@/app/challenges/layout-inner";
import ChallengeClient from "./challenge-client";

export async function generateStaticParams() {
  return getAllChallengeSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);

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
  const challenge = getChallengeBySlug(slug);

  if (!challenge) {
    notFound();
  }

  // Get current index and navigation info
  const currentIndex = challenges.findIndex((c) => c.id === challenge.id);
  const canGoNext = currentIndex < challenges.length - 1;
  const canGoPrev = currentIndex > 0;
  const nextChallenge = canGoNext ? challenges[currentIndex + 1] : null;
  const prevChallenge = canGoPrev ? challenges[currentIndex - 1] : null;

  return (
    <ChallengesLayoutInner
      challenge={challenge}
      currentIndex={currentIndex}
      canGoNext={canGoNext}
      canGoPrev={canGoPrev}
      nextSlug={nextChallenge?.id}
      prevSlug={prevChallenge?.id}
    >
      <ChallengeClient challenge={challenge} />
    </ChallengesLayoutInner>
  );
}
