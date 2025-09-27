import { api } from '@/lib/api';

export interface TimetableSlot {
  id: string;
  timeTableId: string;
  timeTableName: string;
  moduleAssignmentId: string;
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleCredits: number;
  instructorId: string;
  instructorName: string;
  instructorEmail: string | null;
  groupId: string;
  groupCode: string | null;
  groupName: string;
  programId: string;
  programName: string;
  programCode: string | null;
  yearLevel: string | null;
  academicYearId: string;
  academicYearName: string;
  semesterId: string;
  semesterName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string;
  sessionType: string;
  notes: string;
  isActive: boolean;
  durationMinutes: number;
  roomCapacity: number | null;
  equipmentNeeded: string | null;
  specialInstructions: string | null;
  isRecurring: boolean;
  weekNumber: number | null;
  building: string | null;
  floor: string | null;
  hasConflict: boolean;
  conflictReason: string | null;
  isExamSlot: boolean | null;
  isMakeupSlot: boolean | null;
  departmentName: string | null;
  schoolName: string | null;
  collegeName: string;
  conflicts: string | null;
  expectedAttendance: number | null;
  actualAttendance: number | null;
  attendancePercentage: number | null;
  currentStatus: string | null;
  lastUpdated: string | null;
  venueType: string | null;
  venueCapacity: number | null;
  venueLocation: string | null;
  availableEquipment: string | null;
  preparationTimeMinutes: number | null;
  recurringPattern: string;
  recurringEndDate: string | null;
  slotDate: string;
  roomId: string;
  roomName: string;
  roomCapacityCount: number;
  buildingName: string;
  multipleGroups: string | null;
  groupNames: string | null;
  isCapacitySufficient: boolean;
  capacityUtilization: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface TimetableApiResponse {
  success: boolean;
  message: string;
  data: TimetableSlot[];
  timestamp: string;
}

// Get weekly timetable slots with specific date range
export const getWeeklyTimetable = async (startDate?: string, endDate?: string): Promise<TimetableApiResponse> => {
  let url = '/academics/timetable-slots/hod/department-slots/weekly';
  
  // Add date parameters if provided
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

// Get daily timetable slots
export const getDailyTimetable = async (day: string): Promise<TimetableApiResponse> => {
  const response = await api.get(`/academics/timetable-slots/hod/department-slots/day/${day.toUpperCase()}`);
  return response.data;
};

// Get monthly timetable slots with specific month/year
export const getMonthlyTimetable = async (year?: number, month?: number): Promise<TimetableApiResponse> => {
  let url = '/academics/timetable-slots/hod/department-slots/monthly';
  
  // Add date parameters if provided
  if (year && month) {
    url += `?year=${year}&month=${month}`;
  }
  
  const response = await api.get(url);
  return response.data;
};