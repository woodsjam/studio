import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Interview } from "@/types";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

const mockInterviews: Interview[] = [
  {
    id: "session-123",
    orgId: "org-abc",
    studentUid: "user-xyz",
    guideRef: "guide-1",
    status: "assigned",
    dueAt: new Date(2024, 6, 25),
    title: "Level 2 Cognitive Assessment",
    type: "WithFaculty",
  },
  {
    id: "session-456",
    orgId: "org-abc",
    studentUid: "user-xyz",
    guideRef: "guide-2",
    status: "assigned",
    dueAt: new Date(2024, 6, 28),
    title: "Situational Judgement Test",
    type: "Online",
  },
  {
    id: "session-789",
    orgId: "org-abc",
    studentUid: "user-xyz",
    guideRef: "guide-3",
    status: "completed",
    dueAt: new Date(2024, 6, 15),
    title: "Technical Skills Validation",
    type: "Proctored",
  },
  {
    id: "session-abc",
    orgId: "org-abc",
    studentUid: "user-xyz",
    guideRef: "guide-4",
    status: "certified",
    dueAt: new Date(2024, 6, 10),
    title: "Leadership Principles Interview",
    type: "WithFaculty",
  },
];

export default function InterviewsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="My Interviews" 
        description="Here are the interviews assigned to you."
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interview</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInterviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">{interview.title}</TableCell>
                  <TableCell>{interview.type}</TableCell>
                  <TableCell>
                    <Badge variant={
                      interview.status === 'certified' ? 'default' :
                      interview.status === 'completed' ? 'secondary' : 'outline'
                    } className={interview.status === 'certified' ? 'bg-accent text-accent-foreground' : ''}>
                      {interview.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(interview.dueAt, "PPP")}</TableCell>
                  <TableCell className="text-right">
                    {interview.status === 'assigned' && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/interview/${interview.id}`}>
                          Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                     {interview.status !== 'assigned' && (
                       <Button asChild variant="outline" size="sm" disabled>
                        <span className="cursor-not-allowed">View Details</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
