
"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface AudioRecorderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export function AudioRecorder({ isRecording, onToggleRecording }: AudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleStartRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorderRef.current.onstop = () => {
          // In a real app, you would upload audioChunksRef.current to Firebase Storage
          console.log("Recording stopped. Chunks:", audioChunksRef.current);
          audioChunksRef.current = [];
          // Stop all media tracks
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not access microphone. Please check your browser permissions.");
        onToggleRecording(); // Toggle back if permission fails
      }
    };

    const handleStopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };

    if (isRecording) {
      handleStartRecording();
    } else {
      handleStopRecording();
    }

    // Cleanup function to stop recording if component unmounts
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording, onToggleRecording]);

  return (
    <div className="flex items-center space-x-2 flex-col gap-4">
       {isRecording && (
        <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm text-red-500 font-medium">Recording</span>
        </div>
      )}
      <Button onClick={onToggleRecording} variant={isRecording ? "destructive" : "default"} size="lg">
        {isRecording ? <Square className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
        {isRecording ? "Stop & Finalize" : "Start Interview"}
      </Button>
    </div>
  );
}
