"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowRight, Flag, BrainCircuit, FileText, AlarmClock } from "lucide-react";
import { summarizeInterview } from "@/ai/flows/summarize-interview";
import { detectTimingAnomalies } from "@/ai/flows/detect-timing-anomalies";
import type { Turn } from "@/types";

export function InterviewControls({ turns }: { turns: Turn[] }) {
  const [phase, setPhase] = useState<"interview" | "wrapup" | "ended">("interview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMarked, setIsMarked] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const handleNext = () => {
    setIsMarked(false);
    if (currentQuestionIndex < turns.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setPhase("wrapup");
    }
  };

  const handleSummarize = async () => {
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const result = await summarizeInterview({ transcript: "This is a mock transcript for summarization." });
      setAiResult(result.summary);
    } catch (error) {
      setAiResult("Failed to generate summary.");
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleDetectAnomalies = async () => {
    setIsAiLoading(true);
    setAiResult(null);
    const mockTurnsForApi = turns.map(t => ({...t, startedAt: Date.now() - 20000, endedAt: Date.now() - 5000}));
    try {
      const result = await detectTimingAnomalies({ sessionId: 'session-123', turns: mockTurnsForApi });
      if(result.anomalies.length > 0) {
        setAiResult(`Detected ${result.anomalies.length} anomalies. \n- ${result.anomalies.map(a => a.reason).join('\n- ')}`);
      } else {
        setAiResult("No timing anomalies detected.");
      }
    } catch (error) {
      setAiResult("Failed to detect anomalies.");
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };


  if (phase === "wrapup") {
    return (
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-xl font-semibold">Wrap-Up Phase</h3>
        <p className="text-muted-foreground">You can now add amendments to your answers.</p>
        <Textarea placeholder="Type your amendments here..." className="max-w-xl" rows={5} />
        <Button onClick={() => setPhase("ended")} size="lg">Finish Interview</Button>
      </div>
    );
  }
  
  if (phase === "ended") {
    return (
       <div className="flex flex-col items-center gap-4">
        <h3 className="text-xl font-semibold text-accent-foreground">Interview Complete</h3>
        <p className="text-muted-foreground">Thank you. Your session has been submitted.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Button variant={isMarked ? "secondary" : "outline"} onClick={() => setIsMarked(!isMarked)}>
          <Flag className="mr-2 h-4 w-4" />
          {isMarked ? "Marked" : "Mark for Follow-up"}
        </Button>
         <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button variant="outline">
                <BrainCircuit className="mr-2 h-4 w-4" /> AI Tools
              </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>AI Diagnostic Tools</AlertDialogTitle>
              <AlertDialogDescription>
                Run AI analysis on the interview data. This is for diagnostic purposes only.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-2 my-4">
                <Button onClick={handleSummarize} disabled={isAiLoading}><FileText className="mr-2 h-4 w-4" /> {isAiLoading ? "Loading..." : "Generate Summary"}</Button>
                <Button onClick={handleDetectAnomalies} disabled={isAiLoading}><AlarmClock className="mr-2 h-4 w-4" /> {isAiLoading ? "Loading..." : "Detect Timing Anomalies"}</Button>
            </div>
            {aiResult && (
                <div className="mt-4 rounded-md border bg-muted p-4">
                    <h4 className="font-semibold mb-2">Result:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiResult}</p>
                </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAiResult(null)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Button onClick={handleNext} size="lg">
        {currentQuestionIndex < turns.length - 1 ? "Next Question" : "Proceed to Wrap-up"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
