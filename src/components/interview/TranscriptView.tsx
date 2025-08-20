
"use client";

import { useEffect, useState, useRef } from "react";
import type { TranscriptLine } from "@/types";
import { cn } from "@/lib/utils";

export function TranscriptView({ sessionId, initialTranscript = [] }: { sessionId: string, initialTranscript?: TranscriptLine[] }) {
  const [transcript, setTranscript] = useState<TranscriptLine[]>(initialTranscript);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would be a real-time listener to Firestore
    // sessions/{sessionId}/transcript, appending new lines to the state.
    // For now, we just respect the initial transcript.
    setTranscript(initialTranscript);
  }, [initialTranscript]);

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
  
  if (transcript.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">The transcript will appear here once the session begins.</p>
      </div>
    )
  }

  return (
    <div 
      className="h-full space-y-4 overflow-y-auto copy-locked p-1"
      onCopy={handleCopy}
      ref={scrollRef}
    >
      {transcript.map((line) => (
        <div key={line.id} className={cn(
          "flex items-start gap-3",
          line.who === "S" ? "justify-end" : "justify-start",
          line.who === "SYS" && "justify-center"
        )}>
          {line.who !== 'S' && line.who !== 'SYS' && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">{line.who}</div>}
          <div className={cn(
            "max-w-[75%] rounded-lg p-3 text-sm",
            line.who === "S"
              ? "bg-primary text-primary-foreground"
              : line.who === "SYS" ? "bg-transparent text-muted-foreground italic" : "bg-muted"
          )}>
            <p>{line.text}</p>
          </div>
          {line.who === 'S' && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold">S</div>}
        </div>
      ))}
    </div>
  );
}
