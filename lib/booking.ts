export interface BookingFormData {
  name: string;
  contact: string;
  concept: string;
}

export interface PendingSubmission {
  data: BookingFormData & { language: string };
  timestamp: number;
  retryCount: number;
}

export const PENDING_SUBMISSIONS_KEY = 'tatushkiii_pending_bookings';
export const MAX_RETRIES = 3;
