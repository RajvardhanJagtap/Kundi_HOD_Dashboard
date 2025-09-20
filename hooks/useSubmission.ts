// hooks/useSubmission.ts
import { useState, useCallback } from 'react';
import { approveCATMarksByHOD, approveExamMarksByHOD } from '@/lib/module-marks/grading-api';

interface SubmissionData {
  success: boolean;
  message: string;
  data?: any;
}

interface SubmissionOptions {
  comments?: string;
  additionalNotes?: string;
}

interface UseSubmissionReturn {
  isSubmitting: boolean;
  submissionData: SubmissionData | null;
  error: string | null;
  submit: (moduleId: string, type: 'cat' | 'exam', options?: SubmissionOptions) => Promise<void>;
  clearSubmission: () => void;
}

export const useSubmission = (): UseSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (
    moduleId: string, 
    type: 'cat' | 'exam',
    options?: SubmissionOptions
  ) => {
    if (!moduleId) {
      setError('Module ID is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmissionData(null);

    try {
      console.log(`Attempting to submit ${type} marks for module:`, moduleId);
      console.log('Submission options:', options);

      let result;
      
      if (type === 'cat') {
        result = await approveCATMarksByHOD(
          moduleId
        );
      } else if (type === 'exam') {
        result = await approveExamMarksByHOD(
          moduleId
        );
      } else {
        throw new Error('Invalid submission type. Must be "cat" or "exam"');
      }

      // Handle successful submission
      const successData: SubmissionData = {
        success: true,
        message: result?.message || `${type.toUpperCase()} marks approved successfully!`,
        data: result
      };

      setSubmissionData(successData);
      console.log(`${type.toUpperCase()} marks submission successful:`, successData);
      
    } catch (err: any) {
      console.error(`Error submitting ${type} marks:`, err);
      
      // Extract meaningful error message
      let errorMessage = err.message;
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('already been approved')) {
        errorMessage = `${type.toUpperCase()} marks have already been approved for this module.`;
      } else if (errorMessage.includes('not found')) {
        errorMessage = `Module not found or no ${type.toUpperCase()} marks available for approval.`;
      } else if (errorMessage.includes('permission')) {
        errorMessage = `You do not have permission to approve ${type.toUpperCase()} marks for this module.`;
      } else if (errorMessage.includes('validation failed')) {
        errorMessage = `${type.toUpperCase()} marks validation failed. Some marks may be missing or invalid.`;
      } else if (errorMessage.includes('timeout')) {
        errorMessage = `Request timeout - ${type.toUpperCase()} marks approval is taking longer than expected. Please try again.`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearSubmission = useCallback(() => {
    setSubmissionData(null);
    setError(null);
  }, []);

  return {
    isSubmitting,
    submissionData,
    error,
    submit,
    clearSubmission,
  };
};