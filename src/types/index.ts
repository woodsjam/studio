export interface User {
  uid: string;
  orgId: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'student' | 'faculty' | 'proctor' | 'admin';
}

export interface Interview {
  id: string;
  orgId: string;
  studentUid: string;
  guideRef: string; // Reference to guides collection
  status: 'assigned' | 'started' | 'completed' | 'certified';
  dueAt: Date;
  title: string;
  type: "Online" | "Proctored" | "WithFaculty";
}

export interface InterviewSession {
  id: string;
  orgId: string;
  phase: "interview" | "wrapup" | "ended";
  continuous: boolean;
  faculty: {
    uid?: string;
    linked: boolean;
    facultyId?: string;
  };
  proctor: {
    uid?: string;
    linked: boolean;
    proctorId?: string;
  };
  provenance: {
    manifestHash: string;
    signatureRef: string;
    deviceInfo: any;
  };
}

export interface Turn {
  id: string;
  qId: string;
  idx: number;
  startedAt: number;
  endedAt: number;
  markedForFollowUp: boolean;
  questionText: string;
}

export interface TranscriptLine {
  id: string;
  who: "S" | "F" | "SYS" | "A"; // Student, Faculty, System, AI
  text: string;
  createdAt: number;
  zwspGuarded: boolean;
  meta?: any;
}
