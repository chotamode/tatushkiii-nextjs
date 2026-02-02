import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { BookingFormData, BookingSubmissionData, PendingSubmission } from '@/lib/booking';
import { PENDING_SUBMISSIONS_KEY, MAX_RETRIES } from '@/lib/booking';

interface FormTranslations {
  successMessage: string;
  errorMessage: string;
  errorPhotoLost: string;
}

function getPendingSubmissions(): PendingSubmission[] {
  try {
    return JSON.parse(localStorage.getItem(PENDING_SUBMISSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function savePendingSubmissions(pending: PendingSubmission[]) {
  try {
    localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(pending));
  } catch {
    // localStorage unavailable (private browsing) — silently fail
  }
}

async function submitToApi(data: BookingSubmissionData): Promise<boolean> {
  const res = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export function useBookingForm(translations: FormTranslations) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retry pending submissions on mount
  useEffect(() => {
    const retryPending = async () => {
      const pending = getPendingSubmissions();
      if (pending.length === 0) return;

      const stillPending: PendingSubmission[] = [];

      for (const item of pending) {
        if (item.retryCount >= MAX_RETRIES) {
          stillPending.push(item);
          continue;
        }
        try {
          const ok = await submitToApi(item.data);
          if (!ok) {
            stillPending.push({ ...item, retryCount: item.retryCount + 1 });
          }
          // If ok, it's delivered — drop from queue
        } catch {
          stillPending.push({ ...item, retryCount: item.retryCount + 1 });
        }
      }

      savePendingSubmissions(stillPending);
    };

    retryPending();
  }, []);

  const submitForm = useCallback(async (
    data: BookingFormData,
    language: string,
    photo?: string,
    photoName?: string,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    const payload: BookingSubmissionData = { ...data, language, photo, photoName };

    try {
      const ok = await submitToApi(payload);
      if (ok) {
        toast.success(translations.successMessage);
        return true;
      }
      throw new Error('API error');
    } catch {
      // Save to localStorage — but WITHOUT photo (too large for localStorage)
      const { photo: _p, photoName: _pn, ...dataWithoutPhoto } = payload;
      const hadPhoto = !!photo;
      const pending = getPendingSubmissions();
      pending.push({ data: dataWithoutPhoto, timestamp: Date.now(), retryCount: 0, hadPhoto });
      savePendingSubmissions(pending);

      toast.error(translations.errorMessage);
      if (hadPhoto) {
        toast.warning(translations.errorPhotoLost, { duration: 8000 });
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [translations.successMessage, translations.errorMessage, translations.errorPhotoLost]);

  return { submitForm, isSubmitting };
}
