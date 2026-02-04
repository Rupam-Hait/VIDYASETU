import { Notice, RAGDocument, UserRole, ClassSession } from "./types";

// Simulated "Vector Database" content for RAG
export const SCHOOL_KNOWLEDGE_BASE: RAGDocument[] = [
  {
    id: "kb_1",
    category: "policy",
    content: "School hours are from 8:00 AM to 2:30 PM. Late arrival after 8:15 AM is marked as half-day."
  },
  {
    id: "kb_2",
    category: "fees",
    content: "Tuition fees must be paid by the 10th of every quarter. A fine of $50 applies for late payments. Online payment is available via the portal."
  },
  {
    id: "kb_3",
    category: "exam",
    content: "Mid-term exams for 2024 are scheduled from October 15th to October 25th. The grading system uses GPA scale 4.0."
  },
  {
    id: "kb_4",
    category: "transport",
    content: "Bus Route 5 covers the Downtown area. The driver is Mr. Singh, contact: 555-0123. Real-time tracking is enabled in the app."
  },
  {
    id: "kb_5",
    category: "library",
    content: "Students can borrow up to 3 books for 14 days. Lost books incur a replacement fee plus 20% processing charge."
  },
  {
    id: "kb_6",
    category: "contact",
    content: "Principal office email: principal@vidyasetu.edu. Tech support: support@vidyasetu.edu."
  },
  {
    id: "kb_7",
    category: "sports",
    content: "Annual Sports Day is on December 12th. Registration for cricket, football, and athletics opens on November 1st."
  },
  {
    id: "kb_8",
    category: "cafeteria",
    content: "The cafeteria serves breakfast from 7:30 AM to 8:30 AM and lunch from 12:00 PM to 1:30 PM. Weekly menu is available on the notice board."
  },
  {
    id: "kb_9",
    category: "holidays",
    content: "Winter break starts from December 24th to January 5th. Summer break is from May 15th to June 30th."
  },
  {
    id: "kb_10",
    category: "policy",
    content: "Mobile phones are strictly prohibited in classrooms. If found, they will be confiscated for a week."
  },
  {
    id: "kb_11",
    category: "uniform",
    content: "Boys: White shirt, grey trousers, school tie. Girls: White shirt, grey skirt/trousers. Black shoes are mandatory."
  }
];

export const MOCK_NOTICES: Notice[] = [
  { id: '1', title: 'Science Fair 2024', date: '2024-05-20', content: 'Annual Science Fair registration open.', type: 'academic' },
  { id: '2', title: 'Bus Route 5 Delay', date: '2024-05-21', content: 'Due to roadwork, Route 5 will be 10 mins late.', type: 'transport' },
  { id: '3', title: 'Fee Reminder', date: '2024-05-18', content: 'Q2 Fees due next week.', type: 'academic' },
];

export const DEMO_USERS = [
  { id: 'admin1', name: 'Dr. A. Sharma', role: UserRole.ADMIN, password: '123' },
  { id: 'teach1', name: 'Mrs. K. Verma', role: UserRole.TEACHER, class: '10-A', password: '123' },
  { id: 'stud1', name: 'Rohan Gupta', role: UserRole.STUDENT, class: '10-A', password: '123' },
];

export const MOCK_CLASSES: ClassSession[] = [
  {
    id: 'c1',
    title: 'Linear Algebra Fundamentals',
    subject: 'Mathematics',
    teacherId: 'teach1',
    teacherName: 'Mrs. K. Verma',
    date: new Date().toISOString().split('T')[0], // Today
    startTime: '10:00',
    duration: 60,
    status: 'scheduled',
    attendees: 0
  },
  {
    id: 'c2',
    title: 'Thermodynamics',
    subject: 'Physics',
    teacherId: 'teach2',
    teacherName: 'Mr. R. Singh',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    duration: 45,
    status: 'scheduled',
    attendees: 0
  }
];