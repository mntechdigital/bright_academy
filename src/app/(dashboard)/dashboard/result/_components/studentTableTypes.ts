export interface Student {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  studentId: string;
  totalMark: number;
  obtainedMarks?: number;
  classId: string;
  stdClass: {
    id: string;
    className: string;
  };
  section: {
    id: string;
    sectionName: string;
  };
}
