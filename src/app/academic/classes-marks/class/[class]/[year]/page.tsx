"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import ExcelMarksPage from "@/components/marks/over-all";
import RepeatersComponent from "@/components/marks/repeaters";
import SummaryPage from "@/components/marks/summary";
import { AcademicContextProvider } from '@/app/academicContext';
import { useAcademicYears } from "@/hooks/academic-year-and-semesters/useAcademicYears";
import { useSemesters } from "@/hooks/academic-year-and-semesters/useSemesters";
import { useMarksSubmission } from "@/hooks/overall-marks-submission/useMarksSubmission";

// Tab component for the class marks view
const ClassMarksTabs: React.FC<{
    activeTab: string;
    setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { key: "summary", label: "Summary" },
        { key: "overall-marks", label: "Overall Marks" },
        { key: "repeaters-retakers", label: "Repeaters & Retakers" },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.key
                            ? "border-[#026892] text-[#026892] bg-[#026892]/5"
                            : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function ClassMarksPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("summary");
    
    // Get group ID from URL search params or localStorage
    const [groupId, setGroupId] = useState<string>("");
    const [semesterId, setSemesterId] = useState<string>("");
    const [academicYearId, setAcademicYearId] = useState<string>("");
    
    // Get stored academic year and semester from localStorage
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    
    // Persistent state management for approval and submission
    const [isApproved, setIsApproved] = useState(false);
    const [isSubmittedToDean, setIsSubmittedToDean] = useState(false);
    
    // Fetch academic years and semesters
    const { years, isLoading: yearsLoading } = useAcademicYears();
    const { semesters, isLoading: semestersLoading } = useSemesters(selectedYear);
    
    // Marks submission hook
    const {
        isApprovingOverall,
        isSubmittingToDean,
        approvalError,
        submissionError,
        approvalSuccess,
        submissionSuccess,
        approveOverallMarks,
        submitGroupToDean,
        resetApprovalState,
        resetSubmissionState
    } = useMarksSubmission();

    useEffect(() => {
        // Get group ID and other IDs from URL params or localStorage
        const urlGroupId = searchParams.get('groupId') || (typeof window !== "undefined" ? localStorage.getItem("selectedGroupId") : "");
        const urlSemesterId = searchParams.get('semesterId') || (typeof window !== "undefined" ? localStorage.getItem("selectedSemesterId") : "");
        const urlAcademicYearId = (typeof window !== "undefined" ? localStorage.getItem("selectedAcademicYearId") : "");
        
        // Load stored academic year and semester from localStorage
        const storedYear = typeof window !== "undefined" ? localStorage.getItem("selectedAcademicYear") : "";
        const storedSemester = typeof window !== "undefined" ? localStorage.getItem("selectedSemester") : "";
        
        // Load persistent approval and submission states
        const approvalStatus = typeof window !== "undefined" ? localStorage.getItem(`marks_approved_${urlGroupId}_${urlSemesterId}`) === "true" : false;
        const submissionStatus = typeof window !== "undefined" ? localStorage.getItem(`marks_submitted_${urlGroupId}_${urlSemesterId}`) === "true" : false;
        
        if (urlGroupId) setGroupId(urlGroupId);
        if (urlSemesterId) setSemesterId(urlSemesterId);
        if (urlAcademicYearId) setAcademicYearId(urlAcademicYearId);
        if (storedYear) setSelectedYear(storedYear);
        if (storedSemester) setSelectedSemester(storedSemester);
        
        setIsApproved(approvalStatus);
        setIsSubmittedToDean(submissionStatus);
    }, [searchParams]);

    const className = decodeURIComponent(params.class as string);
    const year = params.year as string;

    const handleBackToMarks = () => {
        router.push("/academic/classes-marks");
    };

    const handleYearChange = (yearId: string) => {
        setSelectedYear(yearId);
        localStorage.setItem("selectedAcademicYear", yearId);
    };

    const handleSemesterChange = (semesterId: string) => {
        setSelectedSemester(semesterId);
        localStorage.setItem("selectedSemester", semesterId);
    };

    // Handle HOD approval
    const handleApproveOverall = async () => {
        const moduleId = typeof window !== "undefined" ? localStorage.getItem("selectedModuleId") || "16dd413e-5426-4093-9687-01e15f027ea9" : "16dd413e-5426-4093-9687-01e15f027ea9";
        
        const approvalData = {
            comments: "Overall marks approved and ready for Dean review",
            forwardToNext: true,
            additionalNotes: "Module assessment completed successfully"
        };

        const result = await approveOverallMarks(moduleId, approvalData);
        
        if (result) {
            setIsApproved(true);
            // Persist approval state
            localStorage.setItem(`marks_approved_${groupId}_${semesterId}`, "true");
            toast.success("Overall marks approved successfully!");
        } else if (approvalError) {
            toast.error(approvalError);
        }
    };

    // Handle submit to dean
    const handleSubmitToDean = async () => {
        if (!semesterId || !groupId) {
            toast.error("Missing semester or group information");
            return;
        }

        const submitData = {
            groupId,
            submissionNotes: "All marks verified and ready for review",
            priorityLevel: "NORMAL" as const,
            submissionType: "REGULAR" as const,
            semesterId
        };

        const result = await submitGroupToDean(submitData);
        
        if (result) {
            setIsSubmittedToDean(true);
            // Persist submission state
            localStorage.setItem(`marks_submitted_${groupId}_${semesterId}`, "true");
            toast.success("Marks submitted to dean successfully!");
        } else if (submissionError) {
            toast.error(submissionError);
        }
    };

    // Clear success messages after 3 seconds
    useEffect(() => {
        if (approvalSuccess) {
            setTimeout(() => resetApprovalState(), 3000);
        }
    }, [approvalSuccess, resetApprovalState]);

    useEffect(() => {
        if (submissionSuccess) {
            setTimeout(() => resetSubmissionState(), 3000);
        }
    }, [submissionSuccess, resetSubmissionState]);

    return (
        <AcademicContextProvider
            academicYears={years || []}
            selectedYear={selectedYear}
            academicSemesters={semesters || []}
            selectedSemester={selectedSemester}
            isLoading={yearsLoading || semestersLoading}
            error={null}
            onYearChange={handleYearChange}
            onSemesterChange={handleSemesterChange}
        >
            <div className="p-2 max-w-full overflow-x-hidden">
                {/* Page title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {className} - Marks
                    </h1>
                </div>
                {/* Back button */}
                <div className="mb-4">
                    <Button
                        variant="outline"
                        onClick={handleBackToMarks}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border-none"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Marks Submissions
                    </Button>
                </div>


                {/* HOD Action Buttons - Above all tabs */}
                <Card className="p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">HOD Actions</h3>
                            <p className="text-sm text-gray-600">Review and approve all marks before submitting to dean</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <Button
                                onClick={handleApproveOverall}
                                disabled={isApprovingOverall || isApproved}
                                className={`${isApproved 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-[#026892] hover:bg-[#025a73]'
                                } text-white whitespace-nowrap`}
                            >
                                {isApprovingOverall ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Approving...
                                    </div>
                                ) : isApproved ? (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Approved
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Approve Marks
                                    </div>
                                )}
                            </Button>

                            <Button
                                onClick={handleSubmitToDean}
                                disabled={!isApproved || isSubmittingToDean || isSubmittedToDean}
                                variant={!isApproved ? "outline" : "default"}
                                className={`whitespace-nowrap ${
                                    !isApproved 
                                        ? "border-gray-300 text-gray-500 cursor-not-allowed" 
                                        : isSubmittedToDean
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-[#026892] hover:bg-[#026892]/90 text-white"
                                }`}
                            >
                                {isSubmittingToDean ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </div>
                                ) : isSubmittedToDean ? (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Submitted to Dean
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        Submit to Dean
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Status Messages */}
                    {(approvalError || submissionError) && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                                {approvalError || submissionError}
                            </p>
                        </div>
                    )}
                    
                    {(approvalSuccess || submissionSuccess) && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">
                                {approvalSuccess && "Marks approved successfully!"}
                                {submissionSuccess && "Marks submitted to dean successfully!"}
                            </p>
                        </div>
                    )}
                </Card>

                {/* Tabs */}
                <ClassMarksTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Tab content */}
                <div className="mt-6">
                    {activeTab === "summary" && (
                        <SummaryPage 
                            groupId={groupId} 
                            academicYearId={academicYearId} 
                        />
                    )}
                    {activeTab === "overall-marks" && (
                        <ExcelMarksPage 
                            groupId={groupId} 
                            academicYearId={academicYearId}
                        />
                    )}
                    {activeTab === "repeaters-retakers" && (
                        <RepeatersComponent 
                            className={className} 
                            year={year} 
                            groupId={groupId} 
                            academicYearId={academicYearId} 
                        />
                    )}
                </div>
            </div>
        </AcademicContextProvider>
    );
}