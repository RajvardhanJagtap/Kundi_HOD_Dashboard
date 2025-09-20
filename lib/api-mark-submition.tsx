import { api } from './api';

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string like "1.2 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Interface for group submission data from API
export interface GroupSubmission {
  id: string;
  groupId: string;
  groupName: string;
  groupCode: string;
  status: string;
  statusDisplayName: string;
  statusColorCode: string;
  statusIcon: string;
  isActive: boolean;
  isLocked: boolean;
  lockedAt: string | null;
  lockedBy: string | null;
  submissionNotes: string;
  priorityLevel: string;
  submissionType: string;
  submittedToDeanAt: string;
  submittedToDeanBy: string;
  deanReviewedAt: string | null;
  deanReviewedBy: string | null;
  deanComments: string | null;
  registrarReviewedAt: string | null;
  registrarReviewedBy: string | null;
  registrarComments: string | null;
  principalReviewedAt: string | null;
  principalReviewedBy: string | null;
  principalComments: string | null;
  finalApprovedAt: string | null;
  publishedAt: string | null;
  rejectionReason: string | null;
  currentOfficeId: string;
  responsibleOfficeId: string;
  responsibleOfficeName: string;
  workflowStageDescription: string;
  nextApproverRole: string;
  canBeForwarded: boolean;
  canBeEdited: boolean;
  isFinalState: boolean;
  isHighPriority: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface GroupSubmissionsResponse {
  success: boolean;
  message: string;
  data: GroupSubmission[];
  timestamp: string;
}

// Interface for HOD approval request data
export interface HodApprovalRequest {
  comments: string;
  forwardToNext: boolean;
  additionalNotes: string;
}

export interface HodApprovalResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Interface for submit to dean request data
export interface SubmitToDeanRequest {
  groupId: string;
  submissionNotes: string;
  priorityLevel: 'NORMAL' | 'HIGH' | 'LOW';
  submissionType: 'REGULAR' | 'SUPPLEMENTARY' | 'RETAKE';
  semesterId: string;
}

export interface SubmitToDeanResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * Fetch pending group submissions for officer review
 * @returns Promise<GroupSubmissionsResponse>
 */
export const fetchPendingGroupSubmissions = async (): Promise<GroupSubmissionsResponse> => {
  try {
    const response = await api.get('/grading/group-submissions/submit-to-dean');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending group submissions:', error);
    throw error;
  }
};

// Interface for approval request data
export interface ApprovalRequest {
  submissionId: string;
  approved: boolean;
  comments: string;
}

export interface ApprovalResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * Submit approval/rejection for a group submission
 * @param approvalData - The approval data containing submissionId, approved status, and comments
 * @returns Promise<ApprovalResponse>
 */
export const submitGroupSubmissionApproval = async (approvalData: ApprovalRequest): Promise<ApprovalResponse> => {
  try {
    const response = await api.post('/grading/group-submissions/submit-to-dean', approvalData);
    return response.data;
  } catch (error) {
    console.error('Error submitting group submission approval:', error);
    throw error;
  }
};

/**
 * HOD approve overall marks submission for a module
 * @param moduleId - The module ID
 * @param approvalData - The approval data containing comments, forwardToNext, and additionalNotes
 * @returns Promise<HodApprovalResponse>
 */
export const hodApproveOverallSubmission = async (
  moduleId: string, 
  approvalData: HodApprovalRequest
): Promise<HodApprovalResponse> => {
  try {
    const response = await api.post(
      `/grading/marks-submission/module/${moduleId}/hod/approve-overall`,
      approvalData
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting HOD approval for overall marks:', error);
    throw error;
  }
};

/**
 * Submit group marks to dean for review
 * @param submitData - The submission data containing groupId, submissionNotes, priorityLevel, submissionType, and semesterId
 * @returns Promise<SubmitToDeanResponse>
 */
export const submitToDean = async (submitData: SubmitToDeanRequest): Promise<SubmitToDeanResponse> => {
  try {
    const response = await api.post('/grading/group-submissions/submit-to-dean', submitData);
    return response.data;
  } catch (error) {
    console.error('Error submitting to dean:', error);
    throw error;
  }
};