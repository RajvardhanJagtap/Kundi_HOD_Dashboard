import { useState } from 'react';
import { 
  hodApproveOverallSubmission, 
  submitToDean,
  HodApprovalRequest,
  SubmitToDeanRequest,
  HodApprovalResponse,
  SubmitToDeanResponse
} from '@/lib/api-mark-submition';

export interface UseMarksSubmissionReturn {
  // Loading states
  isApprovingOverall: boolean;
  isSubmittingToDean: boolean;
  
  // Error states
  approvalError: string | null;
  submissionError: string | null;
  
  // Success states
  approvalSuccess: boolean;
  submissionSuccess: boolean;
  
  // Functions
  approveOverallMarks: (moduleId: string, approvalData: HodApprovalRequest) => Promise<HodApprovalResponse | null>;
  submitGroupToDean: (submitData: SubmitToDeanRequest) => Promise<SubmitToDeanResponse | null>;
  
  // Reset functions
  resetApprovalState: () => void;
  resetSubmissionState: () => void;
  resetAllStates: () => void;
}

export const useMarksSubmission = (): UseMarksSubmissionReturn => {
  // Loading states
  const [isApprovingOverall, setIsApprovingOverall] = useState(false);
  const [isSubmittingToDean, setIsSubmittingToDean] = useState(false);
  
  // Error states
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Success states
  const [approvalSuccess, setApprovalSuccess] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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
   * Reset all states
   */
  const resetAllStates = () => {
    resetApprovalState();
    resetSubmissionState();
  };

  return {
    // Loading states
    isApprovingOverall,
    isSubmittingToDean,
    
    // Error states
    approvalError,
    submissionError,
    
    // Success states
    approvalSuccess,
    submissionSuccess,
    
    // Functions
    approveOverallMarks,
    submitGroupToDean,
    
    // Reset functions
    resetApprovalState,
    resetSubmissionState,
    resetAllStates,
  };
};