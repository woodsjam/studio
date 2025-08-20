
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TranscriptView } from "@/components/interview/TranscriptView";
import { CameraView } from "@/components/interview/CameraView";
import { AudioRecorder } from "@/components/interview/AudioRecorder";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentInterviewWithFacultyPage({ params }: { params: { sessionId: string } }) {
  const [sessionLinked, setSessionLinked] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer logic
  useState(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleStartInterview = () => {
    setInterviewStarted(true);
  };
  
  const handleFinalizeInterview = () => {
    setInterviewStarted(false);
    // Add logic to submit the interview data
    alert("Interview Finalized!");
  };

  if (!sessionLinked) {
    return (
      <div className="container mx-auto py-6 h-full flex flex-col">
        <PageHeader 
          title="Link to Faculty"
          description="Scan the QR code presented by your faculty member to begin."
        />
        <Card>
          <CardContent className="pt-6">
            <CameraView onQrScan={(data) => {
                console.log("QR Scanned:", data)
                // In a real app, you would validate the QR data and link the session
                setSessionLinked(true);
            }} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 h-full flex flex-col">
      <PageHeader 
        title="Live Interview Session"
        description="Your interview with the faculty is in progress."
        actions={
          <div className="flex items-center gap-4">
             {interviewStarted && (
              <div className="flex items-center gap-2 text-lg font-mono bg-muted px-3 py-1.5 rounded-md">
                <Timer className="h-5 w-5" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            )}
            <AudioRecorder />
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 flex-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Live Transcript</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <TranscriptView sessionId={params.sessionId} />
          </CardContent>
        </Card>
      </div>
       <div className="mt-6 flex justify-center">
        {!interviewStarted ? (
          <Button onClick={handleStartInterview} size="lg">Start Interview</Button>
        ) : (
          <Button onClick={handleFinalizeInterview} variant="destructive" size="lg">Finalize Interview</Button>
        )}
      </div>
    </div>
  );
}
