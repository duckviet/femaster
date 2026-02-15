import path from "path";
import { readFile, readdir } from "fs/promises";
import type { Challenge } from "@/lib/challenges";
import { normalizeChallengeImport } from "@/lib/challenges";

const CHALLENGES_DIR = path.join(process.cwd(), "public", "challenges");

let cachedChallenges: Challenge[] | null = null;
let cachedChallengesPromise: Promise<Challenge[]> | null = null;

async function loadChallenges(): Promise<Challenge[]> {
  const files = await readdir(CHALLENGES_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  const challenges = await Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(CHALLENGES_DIR, file), "utf8");
      return normalizeChallengeImport(JSON.parse(raw));
    }),
  );

  return challenges;
}

export async function getChallenges(): Promise<Challenge[]> {
  if (cachedChallenges) return cachedChallenges;

  if (!cachedChallengesPromise) {
    cachedChallengesPromise = loadChallenges();
  }

  cachedChallenges = await cachedChallengesPromise;
  return cachedChallenges;
}

export async function getChallengeBySlug(
  slug: string,
): Promise<Challenge | undefined> {
  const all = await getChallenges();
  return all.find((c) => c.id === slug);
}

export async function getAllChallengeSlugs(): Promise<string[]> {
  const all = await getChallenges();
  return all.map((c) => c.id);
}

export async function getChallengeById(
  id: string,
): Promise<Challenge | undefined> {
  return getChallengeBySlug(id);
}
