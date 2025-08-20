
"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import * as ID3 from 'node-id3';

interface AudioRecorderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  onAudioChunk: (blob: Blob) => void;
}

export interface AudioRecorderHandle {
  stopRecording: () => void;
}

export const AudioRecorder = forwardRef<AudioRecorderHandle, AudioRecorderProps>(({ 
  isRecording, 
  onToggleRecording,
  onAudioChunk 
}, ref) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useImperativeHandle(ref, () => ({
    stopRecording: () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
  }));

  useEffect(() => {
    const handleStartRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Use a specific MIME type if available, otherwise let the browser decide.
        // 'audio/webm;codecs=opus' is widely supported and good for this use case.
        const options = { mimeType: 'audio/webm;codecs=opus' };
        mediaRecorderRef.current = new MediaRecorder(stream, options);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            onAudioChunk(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
        };

        // We send chunks every 3 seconds to simulate real-time transcription.
        mediaRecorderRef.current.start(3000); 

      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not access microphone. Please check your browser permissions.");
        if(isRecording) onToggleRecording(); // Toggle back if permission fails
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

    return () => {
      handleStopRecording();
    };
  }, [isRecording, onToggleRecording, onAudioChunk]);

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
});

AudioRecorder.displayName = "AudioRecorder";
