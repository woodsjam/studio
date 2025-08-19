"use client";

import { useEffect, useState, useRef } from "react";
import type { TranscriptLine } from "@/types";
import { cn } from "@/lib/utils";

const mockTranscript: TranscriptLine[] = [
  { id: "1", who: "F", text: "Welcome. Let's start with the first question.", createdAt: Date.now() - 60000, zwspGuarded: true },
  { id: "2", who: "S", text: "Okay, regarding the difficult team member, I tried to understand their perspective first.", createdAt: Date.now() - 45000, zwspGuarded: true },
  { id: "3", who: "S", text: "I scheduled a one-on-one meeting to discuss our communication styles.", createdAt: Date.now() - 30000, zwspGuarded: true },
  { id: "4", who: "F", text: "And what was the outcome?", createdAt: Date.now() - 25000, zwspGuarded: true },
];

export function TranscriptView({ sessionId }: { sessionId: string }) {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would be a real-time listener to Firestore
    // sessions/{sessionId}/transcript
    setTranscript(mockTranscript);
  }, [sessionId]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    const watermark = `\n\n--- Transcript from CertifyAI Session ${sessionId}. Copying is restricted. ---`;
    const zwsp = '\u200B'; // Zero-width space
    const guardedText = (selection?.toString() || '').split('').join(zwsp) + watermark;
    e.clipboardData.setData('text/plain', guardedText);
  };

  return (
    <div 
      className="h-full space-y-4 overflow-y-auto copy-locked p-1"
      onCopy={handleCopy}
      ref={scrollRef}
    >
      {transcript.map((line) => (
        <div key={line.id} className={cn(
          "flex items-start gap-3",
          line.who === "S" ? "justify-end" : "justify-start"
        )}>
          {line.who !== 'S' && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">{line.who}</div>}
          <div className={cn(
            "max-w-[75%] rounded-lg p-3 text-sm",
            line.who === "S"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}>
            <p>{line.text}</p>
          </div>
          {line.who === 'S' && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold">S</div>}
        </div>
      ))}
    </div>
  );
}
