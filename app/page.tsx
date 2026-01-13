import { redirect } from "next/navigation";
import { challenges } from "@/lib/challenges";

export default function Page() {
  // Redirect to the first challenge
  redirect(`/challenges/${challenges[0].id}`);
}
