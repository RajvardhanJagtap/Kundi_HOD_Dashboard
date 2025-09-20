// lib/module-marks/grading-api.ts
import { api } from '@/lib/api';

// Fetch the marksheet Excel file from database
export const fetchModuleMarkSheetExcel = async (moduleId: string): Promise<Blob> => {
  try {
    const response = await api.get(
      `/grading/student-marks/module/${moduleId}/generateModuleMarkSheetExcel`,
      { 
        responseType: 'blob',
        timeout: 30000, // 30 seconds timeout for large files
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching marksheet Excel:', error);
    if (error.response?.status === 404) {
      throw new Error('Marksheet not found for this module');
    } else if (error.response?.status === 500) {
      throw new Error('Server error while generating marksheet');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - marksheet file might be too large');
    } else {
      throw new Error(error.message || 'Failed to fetch marksheet');
    }
  }
};

// Fetch the exam marksheet Excel file from database
export const fetchModuleExamSheetExcel = async (moduleId: string): Promise<Blob> => {
  try {
    const response = await api.get(
      `/grading/exam-marks/module/${moduleId}/generate-exam-sheet`,
      { 
        responseType: 'blob',
        timeout: 30000, // 30 seconds timeout for large files
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching exam sheet Excel:', error);
    if (error.response?.status === 404) {
      throw new Error('Exam sheet not found for this module');
    } else if (error.response?.status === 500) {
      throw new Error('Server error while generating exam sheet');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - exam sheet file might be too large');
    } else {
      throw new Error(error.message || 'Failed to fetch exam sheet');
    }
  }
};

// Approve assessment marks (CATs) by HOD
export const approveCATMarksByHOD = async (moduleId: string): Promise<any> => {
  try {
    console.log('Attempting to approve CAT marks for module:', moduleId);

    // Prepare the required request body
    const requestBody = {
      comments: "CAT marks have been reviewed and approved",
      forwardToNext: true,
      additionalNotes: "Good performance overall"
    };

    console.log('Sending CAT approval request with body:', requestBody);

    const response = await api.post(
      `/grading/marks-submission/module/${moduleId}/hod/approve-cat`,
      requestBody,
      {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('CAT marks approval successful:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Error approving CAT marks by HOD:', error);
    console.error('Full error response:', error.response);
    
    // Log more details about the error
    if (error.response?.data) {
      console.error('Error response data:', error.response.data);
    }
    
    if (error.response?.status === 404) {
      throw new Error('Module not found or no CAT marks available for approval');
    } else if (error.response?.status === 400) {
      // Get more specific error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Invalid approval request - marks data may be incomplete or invalid';
      throw new Error(errorMessage);
    } else if (error.response?.status === 409) {
      throw new Error('CAT marks have already been approved for this module');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to approve CAT marks for this module');
    } else if (error.response?.status === 422) {
      throw new Error('Marks validation failed - some marks may be missing or invalid');
    } else if (error.response?.status === 500) {
      throw new Error('Server error while approving CAT marks. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - approval is taking longer than expected');
    } else {
      // Generic fallback with more context
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Failed to approve CAT marks';
      throw new Error(`${errorMsg} (Status: ${error.response?.status || 'Unknown'})`);
    }
  }
};

// Approve exam marks by HOD
export const approveExamMarksByHOD = async (moduleId: string): Promise<any> => {
  try {
    console.log('Attempting to approve exam marks for module:', moduleId);

    // Prepare the required request body
    const requestBody = {
      comments: "EXAM marks verified and approved for processing",
      forwardToNext: true,
      additionalNotes: "Examination was conducted fairly"
    };

    console.log('Sending exam approval request with body:', requestBody);

    const response = await api.post(
      `/grading/marks-submission/module/${moduleId}/hod/approve-exam`,
      requestBody,
      {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Exam marks approval successful:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Error approving exam marks by HOD:', error);
    console.error('Full error response:', error.response);
    
    // Log more details about the error
    if (error.response?.data) {
      console.error('Error response data:', error.response.data);
    }
    
    if (error.response?.status === 404) {
      throw new Error('Module not found or no exam marks available for approval');
    } else if (error.response?.status === 400) {
      // Get more specific error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Invalid approval request - marks data may be incomplete or invalid';
      throw new Error(errorMessage);
    } else if (error.response?.status === 409) {
      throw new Error('Exam marks have already been approved for this module');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to approve exam marks for this module');
    } else if (error.response?.status === 422) {
      throw new Error('Marks validation failed - some marks may be missing or invalid');
    } else if (error.response?.status === 500) {
      throw new Error('Server error while approving exam marks. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - approval is taking longer than expected');
    } else {
      // Generic fallback with more context
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Failed to approve exam marks';
      throw new Error(`${errorMsg} (Status: ${error.response?.status || 'Unknown'})`);
    }
  }
};

// Submit group marks to dean for approval
export const submitToDean = async (
  groupId: string, 
  semesterId: string, 
  submissionNotes?: string
): Promise<any> => {
  try {
    const response = await api.post(`/grading/group-submissions/submit-to-dean`, {
      groupId,
      semesterId,
      submissionNotes: submissionNotes || "All marks verified and ready for review",
      priorityLevel: "NORMAL",
      submissionType: "REGULAR"
    });
    return response.data;
  } catch (error: any) {
    console.error('Error submitting to dean:', error);
    if (error.response?.status === 404) {
      throw new Error('Group or semester not found');
    } else if (error.response?.status === 409) {
      throw new Error('Marks have already been submitted to dean');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid submission data');
    } else if (error.response?.status === 500) {
      throw new Error('Server error while submitting to dean');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - submission is taking longer than expected');
    } else {
      throw new Error(error.message || 'Failed to submit marks to dean');
    }
  }
};