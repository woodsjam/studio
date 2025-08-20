
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TranscriptView } from "@/components/interview/TranscriptView";
import { CameraView } from "@/components/interview/CameraView";
import { AudioRecorder } from "@/components/interview/AudioRecorder";
import { Timer, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function InterviewClientPage({ sessionId }: { sessionId: string }) {
  const [isClient, setIsClient] = useState(false);
  const [sessionLinked, setSessionLinked] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);


  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleStartInterview = () => {
    if (!sessionLinked) {
      toast({
        variant: "destructive",
        title: "Faculty Not Linked",
        description: "Please link to a faculty member before starting the interview.",
      });
      return;
    }
    setInterviewStarted(true);
  };
  
  const handleFinalizeInterview = () => {
    setInterviewStarted(false);
    // Add logic to submit the interview data
    toast({
      title: "Interview Finalized",
      description: "Your interview session has been successfully submitted.",
    });
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto py-6 h-full flex flex-col">
      <PageHeader 
        title="Live Interview Session"
        description={interviewStarted ? "Your interview with the faculty is in progress." : "Prepare for your interview."}
        actions={
          <div className="flex items-center gap-4">
             {interviewStarted && (
              <>
                <div className="flex items-center gap-2 text-lg font-mono bg-muted px-3 py-1.5 rounded-md">
                  <Timer className="h-5 w-5" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
                <AudioRecorder />
              </>
            )}
             {!interviewStarted && !sessionLinked && (
               <Dialog>
                <DialogTrigger asChild>
                   <Button variant="outline">
                    <Link2 className="mr-2 h-4 w-4" />
                    Link to Faculty
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Link to Faculty Session</DialogTitle>
                    <DialogDescription>
                      Scan the QR code presented by your faculty member to begin.
                    </DialogDescription>
                  </DialogHeader>
                  <CameraView onQrScan={(data) => {
                      console.log("QR Scanned:", data)
                      // In a real app, you would validate the QR data and link the session
                      setSessionLinked(true);
                  }} />
                </DialogContent>
              </Dialog>
            )}
            {sessionLinked && !interviewStarted && (
                <div className="text-green-600 font-semibold text-sm flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    <span>Faculty Linked</span>
                </div>
            )}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 flex-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Live Transcript</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <TranscriptView sessionId={sessionId} />
          </CardContent>
        </Card>
      </div>
       <div className="mt-6 flex justify-center">
        {!interviewStarted ? (
          <Button onClick={handleStartInterview} size="lg" disabled={!sessionLinked}>Start Interview</Button>
        ) : (
          <Button onClick={handleFinalizeInterview} variant="destructive" size="lg">Finalize Interview</Button>
        )}
      </div>
    </div>
  );
}
