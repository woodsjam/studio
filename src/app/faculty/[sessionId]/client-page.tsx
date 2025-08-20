"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranscriptView } from "@/components/interview/TranscriptView";
import { QRCodeLink } from "@/components/faculty/QRCodeLink";
import { AudioRecorder, AudioRecorderHandle } from "@/components/interview/AudioRecorder";
import type { TranscriptLine } from "@/types";
import { transcribeAudio } from "@/ai/flows/transcribe-audio";

export function FacultyClientPage({ sessionId }: { sessionId: string }) {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderRef = useRef<AudioRecorderHandle>(null);

  const handleToggleRecording = () => {
    if (isRecording) {
      audioRecorderRef.current?.stopRecording();
    }
    setIsRecording(prev => !prev);
  };

  const handleAudioChunk = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const { text } = await transcribeAudio({ audioDataUri: base64data });
        if (text) {
          const facultyLine: TranscriptLine = {
            id: `f-${Date.now()}`,
            who: "F",
            text,
            createdAt: Date.now(),
            zwspGuarded: false,
          };
          setTranscript(prev => [...prev, facultyLine]);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("Transcription error:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 h-full flex flex-col">
      <PageHeader
        title="Faculty Live Session"
        description={`Monitoring student interview: ${sessionId}`}
      />
      <div className="grid md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Live Transcript</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <TranscriptView transcript={transcript} sessionId={sessionId} />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Proctor/Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <QRCodeLink sessionId={sessionId} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p><strong>Student:</strong> student@credible.com</p>
              <p><strong>Guide:</strong> Level 2 Cognitive Assessment</p>
              <p><strong>Status:</strong> <span className="text-green-500 font-semibold">Live</span></p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <AudioRecorder
          ref={audioRecorderRef}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          onAudioChunk={handleAudioChunk}
        />
      </div>
    </div>
  );
}
