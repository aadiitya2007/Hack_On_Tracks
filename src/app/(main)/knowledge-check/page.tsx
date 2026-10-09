import { prisma } from "@/lib/db";
import KnowledgeClient from "./KnowledgeClient";

export const instant = false;

export default async function KnowledgeCheckPage() {
  const questions = await prisma.question.findMany({
    orderBy: { id: 'asc' }
  });
  
  return <KnowledgeClient questions={questions} />;
}
