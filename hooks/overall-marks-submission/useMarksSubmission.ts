import { useState } from 'react';
import { 
  hodApproveOverallSubmission, 
  submitToDean,
  downloadOverallMarks,
  HodApprovalRequest,
  SubmitToDeanRequest,
  HodApprovalResponse,
  SubmitToDeanResponse
} from '@/lib/api-mark-submition';

export interface UseMarksSubmissionReturn {
  // Loading states
  isApprovingOverall: boolean;
  isSubmittingToDean: boolean;
  isDownloadingOverall: boolean;
  
  // Error states
  approvalError: string | null;
  submissionError: string | null;
  downloadError: string | null;
  
  // Success states
  approvalSuccess: boolean;
  submissionSuccess: boolean;
  downloadSuccess: boolean;
  
  // Functions
  approveOverallMarks: (moduleId: string, approvalData: HodApprovalRequest) => Promise<HodApprovalResponse | null>;
  submitGroupToDean: (submitData: SubmitToDeanRequest) => Promise<SubmitToDeanResponse | null>;
  downloadOverallSheet: (academicYearId: string, groupId: string, fileName?: string) => Promise<boolean>;
  
  // Reset functions
  resetApprovalState: () => void;
  resetSubmissionState: () => void;
  resetDownloadState: () => void;
  resetAllStates: () => void;
}

export const useMarksSubmission = (): UseMarksSubmissionReturn => {
  // Loading states
  const [isApprovingOverall, setIsApprovingOverall] = useState(false);
  const [isSubmittingToDean, setIsSubmittingToDean] = useState(false);
  const [isDownloadingOverall, setIsDownloadingOverall] = useState(false);
  
  // Error states
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  
  // Success states
  const [approvalSuccess, setApprovalSuccess] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  /**
   * Approve overall marks for a module (HOD approval)
   */
  const approveOverallMarks = async (
    moduleId: string, 
    approvalData: HodApprovalRequest
  ): Promise<HodApprovalResponse | null> => {
    setIsApprovingOverall(true);
    setApprovalError(null);
    setApprovalSuccess(false);

    try {
      const response = await hodApproveOverallSubmission(moduleId, approvalData);
      setApprovalSuccess(true);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve overall marks';
      setApprovalError(errorMessage);
      return null;
    } finally {
      setIsApprovingOverall(false);
    }
  };

  /**
   * Submit group marks to dean
   */
  const submitGroupToDean = async (
    submitData: SubmitToDeanRequest
  ): Promise<SubmitToDeanResponse | null> => {
    setIsSubmittingToDean(true);
    setSubmissionError(null);
    setSubmissionSuccess(false);

    try {
      const response = await submitToDean(submitData);
      setSubmissionSuccess(true);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit to dean';
      setSubmissionError(errorMessage);
      return null;
    } finally {
      setIsSubmittingToDean(false);
    }
  };

  /**
   * Download overall marks sheet
   */
  const downloadOverallSheet = async (
    academicYearId: string, 
    groupId: string,
    fileName?: string
  ): Promise<boolean> => {
    setIsDownloadingOverall(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      const blob = await downloadOverallMarks(academicYearId, groupId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp if not provided
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const defaultFileName = `overall-marks-${groupId}-${timestamp}.xlsx`;
      link.download = fileName || defaultFileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadSuccess(true);
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to download overall marks';
      setDownloadError(errorMessage);
      return false;
    } finally {
      setIsDownloadingOverall(false);
    }
  };

  /**
   * Reset approval-related states
   */
  const resetApprovalState = () => {
    setApprovalError(null);
    setApprovalSuccess(false);
  };

  /**
   * Reset submission-related states
   */
  const resetSubmissionState = () => {
    setSubmissionError(null);
    setSubmissionSuccess(false);
  };

  /**
   * Reset download-related states
   */
  const resetDownloadState = () => {
    setDownloadError(null);
    setDownloadSuccess(false);
  };

  /**
   * Reset all states
   */
  const resetAllStates = () => {
    resetApprovalState();
    resetSubmissionState();
    resetDownloadState();
  };

  return {
    // Loading states
    isApprovingOverall,
    isSubmittingToDean,
    isDownloadingOverall,
    
    // Error states
    approvalError,
    submissionError,
    downloadError,
    
    // Success states
    approvalSuccess,
    submissionSuccess,
    downloadSuccess,
    
    // Functions
    approveOverallMarks,
    submitGroupToDean,
    downloadOverallSheet,
    
    // Reset functions
    resetApprovalState,
    resetSubmissionState,
    resetDownloadState,
    resetAllStates,
  };
};