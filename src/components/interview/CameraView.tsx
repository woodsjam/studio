
"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CameraViewProps {
    onQrScan: (data: string) => void;
}

export function CameraView({ onQrScan }: CameraViewProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // In a real app, you would add QR code scanning logic here.
        // For now, we'll simulate a scan after a delay.
        setTimeout(() => {
            onQrScan("simulated-qr-code-data-for-linking");
            toast({ title: "Success", description: "Faculty session linked successfully!"});
        }, 3000);

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    // Cleanup
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [onQrScan, toast]);

  return (
    <div className="w-full relative">
        <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />

        {hasCameraPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center">
                <Alert variant="destructive" className="w-auto">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature.
                    </AlertDescription>
                </Alert>
            </div>
        )}
        {hasCameraPermission === null && (
             <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Requesting camera permission...</p>
            </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="w-full h-full border-4 border-dashed border-primary/50 rounded-lg" />
        </div>
    </div>
  );
}
