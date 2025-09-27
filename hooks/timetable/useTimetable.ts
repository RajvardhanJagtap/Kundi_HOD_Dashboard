import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getWeeklyTimetable, getDailyTimetable, getMonthlyTimetable, TimetableApiResponse } from '@/lib/timetable/timetable-api';

// Hook for weekly timetable
export const useWeeklyTimetable = (currentDate?: Date, options?: Partial<UseQueryOptions<TimetableApiResponse>>) => {
  // Calculate week start and end dates
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date)
    const dayOfWeek = date.getDay()
    startOfWeek.setDate(date.getDate() - dayOfWeek)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    }
  }

  const weekDates = currentDate ? getWeekDates(currentDate) : null

  return useQuery({
    queryKey: ['timetable', 'weekly', weekDates?.start, weekDates?.end],
    queryFn: () => getWeeklyTimetable(weekDates?.start, weekDates?.end),
    enabled: !!weekDates,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Hook for daily timetable
export const useDailyTimetable = (day: string, options?: Partial<UseQueryOptions<TimetableApiResponse>>) => {
  return useQuery({
    queryKey: ['timetable', 'daily', day.toUpperCase()],
    queryFn: () => getDailyTimetable(day),
    enabled: !!day && day !== '',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Hook for monthly timetable
export const useMonthlyTimetable = (currentDate?: Date, options?: Partial<UseQueryOptions<TimetableApiResponse>>) => {
  const year = currentDate?.getFullYear()
  const month = currentDate ? currentDate.getMonth() + 1 : undefined // getMonth() returns 0-11, API expects 1-12

  return useQuery({
    queryKey: ['timetable', 'monthly', year, month],
    queryFn: () => getMonthlyTimetable(year, month),
    enabled: !!year && !!month,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};