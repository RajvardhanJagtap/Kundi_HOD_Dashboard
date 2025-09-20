import { useState, useEffect } from "react";
import { fetchAcademicYears, AcademicYear } from "@/lib/academic-year-and-semesters/academics-api";

export function useAcademicYears() {
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchAcademicYears()
        .then((data) => setYears(data))
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }, []);

    return { years, isLoading, error };
}
