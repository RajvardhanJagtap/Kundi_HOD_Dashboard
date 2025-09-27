// Transform API data to component-compatible format
import { TimetableSlot } from '@/lib/timetable/timetable-api';

export interface ScheduleData {
  id: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  moduleCode: string;
  moduleName: string;
  venue: string;
  instructorName: string;
  sessionType: string;
  groupName: string;
  programName: string;
  buildingName: string;
  roomName: string;
  color: string;
  notes?: string;
  durationMinutes: number;
}

// Function to transform API data to ScheduleData
export const transformTimetableSlotToScheduleData = (slot: TimetableSlot): ScheduleData => {
  // Generate a consistent color based on module code
  const getColorForModule = (moduleCode: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-300',
      'bg-orange-300',
      'bg-red-300',
      'bg-teal-300',
      'bg-pink-300',
      'bg-indigo-300',
      'bg-yellow-300',
      'bg-yellow-400'
    ];
    
    // Simple hash function to get consistent colors
    let hash = 0;
    for (let i = 0; i < moduleCode.length; i++) {
      hash = moduleCode.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return {
    id: slot.id,
    date: slot.slotDate,
    startTime: slot.startTime.slice(0, 5), // Remove seconds from HH:MM:SS
    endTime: slot.endTime.slice(0, 5), // Remove seconds from HH:MM:SS
    moduleCode: slot.moduleCode,
    moduleName: slot.moduleName,
    venue: slot.venue,
    instructorName: slot.instructorName,
    sessionType: slot.sessionType,
    groupName: slot.groupName,
    programName: slot.programName,
    buildingName: slot.buildingName,
    roomName: slot.roomName,
    color: getColorForModule(slot.moduleCode),
    notes: slot.notes,
    durationMinutes: slot.durationMinutes,
  };
};

// Function to get day name from date
export const getDayOfWeekFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[date.getDay()];
};