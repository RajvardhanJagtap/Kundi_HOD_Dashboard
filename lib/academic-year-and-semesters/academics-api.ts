import { api } from "@/lib/api";

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface AcademicYearsResponse {
  success: boolean;
  message: string;
  data: {
    content: AcademicYear[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: string;
}

export const fetchAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const response = await api.get<AcademicYearsResponse>("/academics/academic-years");
    if (response.data.success) {
      // The academic years are in response.data.data.content
      return response.data.data.content;
    } else {
      throw new Error(response.data.message || "Failed to fetch academic years");
    }
  } catch (error: any) {
    console.error("Error fetching academic years:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch academic years");
  }
};

export interface Semester {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
}

export interface SemestersResponse {
  success: boolean;
  message: string;
  data: Semester[];
  timestamp: string;
}

export const fetchSemestersByAcademicYear = async (academicYearId: string): Promise<Semester[]> => {
  try {
    const response = await api.get<SemestersResponse>(`/academics/semesters/academic-year/${academicYearId}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch semesters");
    }
  } catch (error: any) {
    console.error("Error fetching semesters:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch semesters");
  }
};
