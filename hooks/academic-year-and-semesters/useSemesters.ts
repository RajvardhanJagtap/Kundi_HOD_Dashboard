import { useState, useEffect } from "react";
import { fetchSemestersByAcademicYear, Semester } from "@/lib/academic-year-and-semesters/academics-api";

export function useSemesters(academicYearId: string) {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (!academicYearId) return;
    setIsLoading(true);
    setError(null);
    fetchSemestersByAcademicYear(academicYearId)
    .then((data) => setSemesters(data))
    .catch((err) => setError(err.message))
    .finally(() => setIsLoading(false));
}, [academicYearId]);

return { semesters, isLoading, error };
}
