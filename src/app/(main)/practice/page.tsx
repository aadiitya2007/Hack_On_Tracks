import { getPracticeState } from "@/lib/practice-actions";
import PracticeClient from "./PracticeClient";
import { connection } from "next/server";

export const instant = false;

export default async function PracticePage() {
  await connection();
  const state = await getPracticeState();
  return <PracticeClient initialState={state} />;
}
