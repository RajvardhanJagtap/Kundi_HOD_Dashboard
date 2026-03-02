import { api } from "@/lib/api";

export interface HodDashboardStats {
  staffCount: number;
  enrolledStudents: number;
  activeModules: number;
  pendingApprovals: number;
}

interface HodDashboardResponse {
  success: boolean;
  message: string;
  data: HodDashboardStats;
  timestamp?: string;
}

export async function fetchHodDashboardStats(params: {
  departmentId: string;
  academicYearId: string;
  semesterId: string;
}): Promise<HodDashboardStats> {
  const { departmentId, academicYearId, semesterId } = params;

  if (!departmentId || !academicYearId || !semesterId) {
    throw new Error("Missing required dashboard params");
  }

  try {
    const response = await api.get<HodDashboardResponse>("/api/hod/dashboard", {
      params: {
        departmentId,
        academicYearId,
        semesterId,
      },
    });

    console.log("Dashboard stats response:", response.data);

    // Handle both wrapped and direct response formats
    const data = response.data;

    if (data.success === false) {
      throw new Error(data.message || "Failed to fetch dashboard stats");
    }

    // If response has the stats directly or nested in data property
    const statsData = data.data || data;

    if (statsData && typeof statsData === "object") {
      return statsData as HodDashboardStats;
    }

    throw new Error("Invalid dashboard stats response format");
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch dashboard stats",
    );
  }
}
