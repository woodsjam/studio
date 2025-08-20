
import { InterviewClientPage } from "./client-page";

export default function StudentInterviewWithFacultyPage({ params }: { params: { sessionId: string } }) {
  // We keep this as a Server Component to handle the params correctly.
  const sessionId = params.sessionId;

  // We pass the sessionId as a simple prop to the actual client component.
  return <InterviewClientPage sessionId={sessionId} />;
}
