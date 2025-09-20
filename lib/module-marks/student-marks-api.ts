import { api } from '@/lib/api';

// Interfaces for the student marks response
export interface StudentMark {
  studentId: string;
  studentRegNumber: string;
  studentName?: string;
  gender?: string;
  cat1?: number;
  cat2?: number;
  testAverage?: number;
  quiz1?: number;
  quiz2?: number;
  quizAverage?: number;
  assignment1?: number;
  assignment2?: number;
  assignmentAverage?: number;
  lab1?: number;
  lab2?: number;
  lab3?: number;
  labAverage?: number;
  totalMarks?: number;
  remark?: string;
  grade?: string;
}

export interface ModuleMarksheet {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  instructorId: string;
  instructorName: string;
  academicYear: string;
  semester: string;
  students: StudentMark[];
  totalStudents: number;
  submissionStatus?: string;
  isPublished?: boolean;
  isSubmittedToDean?: boolean;
}

export interface StudentMarksResponse {
  success: boolean;
  message: string;
  data: ModuleMarksheet;
  timestamp: string;
}

// API functions
export const studentMarksApi = {
  // Get module marksheet by module assignment ID
  getModuleMarksheet: async (moduleAssignmentId: string): Promise<StudentMarksResponse> => {
    const response = await api.get(`/grading/student-marks/module/${moduleAssignmentId}/generateModuleMarkSheetExcel`);
    return response.data;
  },

  // Submit marks to dean
  submitMarksToDean: async (moduleAssignmentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/grading/student-marks/module/${moduleAssignmentId}/submit-to-dean`);
    return response.data;
  },

  // Publish marks to students
  publishMarksToStudents: async (moduleAssignmentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/grading/student-marks/module/${moduleAssignmentId}/publish`);
    return response.data;
  },

  // Export marks as Excel
  exportMarksExcel: async (moduleAssignmentId: string): Promise<Blob> => {
    const response = await api.get(`/grading/student-marks/module/${moduleAssignmentId}/export-excel`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Update student marks
  updateStudentMarks: async (moduleAssignmentId: string, marks: Partial<StudentMark>[]): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/grading/student-marks/module/${moduleAssignmentId}`, { marks });
    return response.data;
  },

  // Get marks statistics
  getMarksStatistics: async (moduleAssignmentId: string): Promise<{
    success: boolean;
    data: {
      totalStudents: number;
      passRate: number;
      averageMarks: number;
      highestMarks: number;
      lowestMarks: number;
      gradeDistribution: { grade: string; count: number; percentage: number }[];
    }
  }> => {
    const response = await api.get(`/grading/student-marks/module/${moduleAssignmentId}/statistics`);
    return response.data;
  }
};