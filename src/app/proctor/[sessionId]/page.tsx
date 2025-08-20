import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranscriptView } from "@/components/interview/TranscriptView";
import { ProctorQRCodeLink } from "@/components/proctor/ProctorQRCodeLink";

export default function ProctorInterviewPage({ params }: { params: { sessionId: string } }) {
  return (
    <div className="container mx-auto py-6 h-full flex flex-col">
      <PageHeader 
        title="Proctor Live Session"
        description={`Monitoring student interview: ${params.sessionId}`}
      />
      <div className="grid md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2">
           <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Live Transcript</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <TranscriptView sessionId={params.sessionId} />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Proctor</CardTitle>
            </CardHeader>
            <CardContent>
              <ProctorQRCodeLink sessionId={params.sessionId} />
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
    </div>
  );
}
