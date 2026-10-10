'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { LESSON_MAP } from '@/lib/content/lessons';
import Dialogue from '@/components/Dialogue';
import { simulateStocks } from '@/lib/simulations/stocks';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AssetLesson({ params }: { params: Promise<{ asset: string }> }) {
  const resolvedParams = use(params);
  const lesson = LESSON_MAP[resolvedParams.asset];

  if (!lesson) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8 pt-12 pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="px-3 py-1 bg-surface-hover rounded-full text-xs font-bold text-text-muted border border-border">
          Asset Class
        </div>
      </div>
      <h1 className="text-4xl font-extrabold text-text-primary mb-3 font-sans tracking-tight">{lesson.title}</h1>
      <p className="text-xl text-text-secondary font-medium mb-12">{lesson.subtitle}</p>

      {/* Lesson Dialogue */}
      {lesson.dialogue && lesson.dialogue.length > 0 && (
        <div className="h-[400px] mb-16">
          <Dialogue messages={lesson.dialogue} />
        </div>
      )}

      {/* What it is */}
      {lesson.whatItIs && lesson.whatItIs.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-text-primary sub-heading">What are {lesson.title.toLowerCase()}?</h2>
          <div className="bg-surface p-8 rounded-3xl border border-border">
            {lesson.whatItIs.map((p: string, i: number) => (
              <p key={i} className="mb-4 text-text-secondary leading-relaxed last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      {lesson.howItWorks && lesson.howItWorks.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">How do they work?</h2>
          <div className="grid gap-4">
            {lesson.howItWorks.map((step: any, i: number) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-border flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">{step.step}</h3>
                  <p className="text-text-secondary text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Advantages & Risks */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {lesson.advantages && lesson.advantages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 text-text-primary flex items-center gap-2">
              <TrendingUp className="text-gain" /> Advantages
            </h2>
            <div className="space-y-3">
              {lesson.advantages.map((adv: string, i: number) => (
                <div key={i} className="flex gap-3 bg-surface p-4 rounded-xl border border-border">
                  <CheckCircle2 className="text-gain shrink-0" size={20} />
                  <span className="text-text-secondary text-sm">{adv}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {lesson.risks && lesson.risks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 text-text-primary flex items-center gap-2">
              <TrendingDown className="text-loss" /> Risks
            </h2>
            <div className="space-y-3">
              {lesson.risks.map((risk: string, i: number) => (
                <div key={i} className="flex gap-3 bg-surface p-4 rounded-xl border border-border">
                  <XCircle className="text-loss shrink-0" size={20} />
                  <span className="text-text-secondary text-sm">{risk}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Snapshot */}
      {lesson.snapshot && lesson.snapshot.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">India Context Snapshot (Indicative)</h2>
          <div className="bg-accent-bg border border-accent/20 p-6 rounded-3xl text-accent">
            <ul className="space-y-2 list-disc list-inside">
              {lesson.snapshot.map((s: string, i: number) => (
                <li key={i} className="text-sm">{s}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Takeaway */}
      {lesson.takeaway && (
        <section className="mb-16">
          <div className="bg-surface p-8 rounded-3xl border border-border text-center">
            <p className="text-xs uppercase font-bold text-text-muted mb-3 tracking-wider">Key Takeaway</p>
            <p className="text-xl font-medium text-text-primary italic">"{lesson.takeaway}"</p>
          </div>
        </section>
      )}

      {/* Next Lesson */}
      {lesson.nextLesson && (
        <div className="flex justify-end pt-8 border-t border-border mt-8">
          <Link href={`/learn/${lesson.nextLesson}`} className="group flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-xl font-bold hover:shadow-lg transition-all hover:-translate-y-1">
            Next Lesson: {lesson.nextLesson.replace('-', ' ').toUpperCase()}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
