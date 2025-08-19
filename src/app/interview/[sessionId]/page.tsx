import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AudioRecorder } from "@/components/interview/AudioRecorder";
import { TranscriptView } from "@/components/interview/TranscriptView";
import { InterviewControls } from "@/components/interview/InterviewControls";
import { Turn } from "@/types";

const mockTurns: Turn[] = [
  {
    id: "q1",
    qId: "q1",
    idx: 0,
    startedAt: 0,
    endedAt: 0,
    markedForFollowUp: false,
    questionText: "Describe a situation where you had to work with a difficult team member. How did you handle it?",
  },
  {
    id: "q2",
    qId: "q2",
    idx: 1,
    startedAt: 0,
    endedAt: 0,
    markedForFollowUp: false,
    questionText: "Tell me about a time you failed. What did you learn from the experience?",
  },
  {
    id: "q3",
    qId: "q3",
    idx: 2,
    startedAt: 0,
    endedAt: 0,
    markedForFollowUp: false,
    questionText: "Where do you see yourself in five years?",
  },
];

export default function StudentInterviewPage({ params }: { params: { sessionId: string } }) {
  const currentTurn = mockTurns[0];

  return (
    <div className="container mx-auto py-6 h-full flex flex-col">
      <PageHeader 
        title="Interview Session"
        description="Level 2 Cognitive Assessment"
        actions={<AudioRecorder />}
      />
      <div className="grid md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Question {currentTurn.idx + 1}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-lg leading-relaxed">{currentTurn.questionText}</p>
            </CardContent>
          </Card>
        </div>
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
      </div>
      <Separator className="my-6" />
      <InterviewControls turns={mockTurns} />
    </div>
  );
}
