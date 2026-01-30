import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { BookingFormData, PendingSubmission } from '@/lib/booking';
import { PENDING_SUBMISSIONS_KEY, MAX_RETRIES } from '@/lib/booking';

interface FormTranslations {
  successMessage: string;
  errorMessage: string;
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

async function submitToApi(data: BookingFormData & { language: string }): Promise<boolean> {
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
          // Keep it — user can see it was attempted but failed
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

  const submitForm = useCallback(async (data: BookingFormData, language: string): Promise<boolean> => {
    setIsSubmitting(true);
    const payload = { ...data, language };

    try {
      const ok = await submitToApi(payload);
      if (ok) {
        toast.success(translations.successMessage);
        return true;
      }
      throw new Error('API error');
    } catch {
      // Save to localStorage so request is never lost
      const pending = getPendingSubmissions();
      pending.push({ data: payload, timestamp: Date.now(), retryCount: 0 });
      savePendingSubmissions(pending);

      toast.error(translations.errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [translations.successMessage, translations.errorMessage]);

  return { submitForm, isSubmitting };
}
