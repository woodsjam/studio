
"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DialogClose } from "@/components/ui/dialog";

interface CameraViewProps {
    onQrScan: (data: string) => void;
}

export function CameraView({ onQrScan }: CameraViewProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    let scanTimeout: NodeJS.Timeout | null = null;

    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // In a real app, you would add QR code scanning logic here.
        // For now, we'll simulate a scan after a delay.
        scanTimeout = setTimeout(() => {
            onQrScan("simulated-qr-code-data-for-linking");
            toast({ title: "Success", description: "Faculty session linked successfully!"});
            // Programmatically click the hidden close button
            if (closeButtonRef.current) {
                closeButtonRef.current.click();
            }
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
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (scanTimeout) {
            clearTimeout(scanTimeout);
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
        <DialogClose ref={closeButtonRef} className="hidden" />
    </div>
  );
}
