export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  description: string;
  note: string;
  placement: string;
  size: string;
}

export interface BookingSubmissionData extends BookingFormData {
  language: string;
  photo?: string;      // Base64 encoded image
  photoName?: string;  // original file name
}

export interface PendingSubmission {
  data: Omit<BookingSubmissionData, 'photo' | 'photoName'>; // no photo in localStorage
  timestamp: number;
  retryCount: number;
  hadPhoto: boolean; // flag to inform user photo was lost
}

export const PENDING_SUBMISSIONS_KEY = 'tatushkiii_pending_bookings';
export const MAX_RETRIES = 3;
export const MAX_PHOTO_SIZE = 15 * 1024 * 1024; // 15MB
