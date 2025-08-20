import { FacultyClientPage } from "./client-page";

export default function FacultyInterviewPage({ params }: { params: { sessionId: string } }) {
  return <FacultyClientPage sessionId={params.sessionId} />;
}
