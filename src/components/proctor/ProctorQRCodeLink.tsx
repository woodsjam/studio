
"use client";

import Image from "next/image";
import { Button } from "../ui/button";

export function ProctorQRCodeLink({ sessionId }: { sessionId: string }) {
  // In a real app, this URL would be a Firebase Dynamic Link
  const linkUrl = `${window.location.origin}/link-proctor?session=${sessionId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkUrl).then(() => {
      // Potentially show a toast notification
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-muted/50">
      <p className="text-center text-sm text-muted-foreground">
        Scan this QR code with another device to link a proctor to this session.
      </p>
      <div className="p-2 bg-white rounded-md shadow-md">
        <Image 
          src={`https://placehold.co/256x256.png`} 
          alt="QR Code for session link" 
          width={256} 
          height={256}
          data-ai-hint="qr code"
        />
      </div>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        Copy Link
      </Button>
    </div>
  );
}
