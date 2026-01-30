'use client';

import { useForm } from 'react-hook-form';
import { useBookingForm } from '@/hooks/useBookingForm';
import type { BookingFormData } from '@/lib/booking';
import type { Locale } from '@/hooks/useTranslation';

interface BookingFormProps {
  t: {
    contact: {
      form: {
        name: string;
        namePlaceholder: string;
        contact: string;
        contactPlaceholder: string;
        concept: string;
        conceptPlaceholder: string;
        submit: string;
        sending: string;
        successMessage: string;
        errorMessage: string;
        validation: {
          nameRequired: string;
          nameMinLength: string;
          contactRequired: string;
          contactInvalid: string;
          conceptRequired: string;
          conceptMinLength: string;
        };
      };
    };
  };
  locale: Locale;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const IG_REGEX = /^@?[a-zA-Z0-9._]{1,30}$/;

export default function BookingForm({ t, locale }: BookingFormProps) {
  const form = t.contact.form;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  const { submitForm, isSubmitting } = useBookingForm({
    successMessage: form.successMessage,
    errorMessage: form.errorMessage,
  });

  const onSubmit = async (data: BookingFormData) => {
    const ok = await submitForm(data, locale);
    if (ok) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0 border-t border-black">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="group border-b border-black border-r-0 md:border-r relative">
          <label className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
            {form.name}
          </label>
          <input
            type="text"
            className="w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 focus:bg-gray-50 transition-colors"
            placeholder={form.namePlaceholder}
            disabled={isSubmitting}
            {...register('name', {
              required: form.validation.nameRequired,
              minLength: { value: 2, message: form.validation.nameMinLength },
            })}
          />
          {errors.name && (
            <span className="absolute bottom-1 left-2 font-mono text-[10px] text-red-500">
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="group border-b border-black relative">
          <label className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
            {form.contact}
          </label>
          <input
            type="text"
            className="w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 focus:bg-gray-50 transition-colors"
            placeholder={form.contactPlaceholder}
            disabled={isSubmitting}
            {...register('contact', {
              required: form.validation.contactRequired,
              validate: (value: string) => {
                const trimmed = value.trim();
                if (EMAIL_REGEX.test(trimmed) || IG_REGEX.test(trimmed)) return true;
                return form.validation.contactInvalid;
              },
            })}
          />
          {errors.contact && (
            <span className="absolute bottom-1 left-2 font-mono text-[10px] text-red-500">
              {errors.contact.message}
            </span>
          )}
        </div>
      </div>

      <div className="relative border-b border-black">
        <label className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          {form.concept}
        </label>
        <textarea
          className="w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 resize-none h-48 focus:bg-gray-50 transition-colors"
          placeholder={form.conceptPlaceholder}
          disabled={isSubmitting}
          {...register('concept', {
            required: form.validation.conceptRequired,
            minLength: { value: 10, message: form.validation.conceptMinLength },
          })}
        />
        {errors.concept && (
          <span className="absolute bottom-1 left-2 font-mono text-[10px] text-red-500">
            {errors.concept.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-8 font-mono text-sm uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-b hover:border-black transition-all flex justify-between px-8 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
      >
        <span>{isSubmitting ? form.sending : form.submit}</span>
        <span className={isSubmitting ? 'animate-spin' : 'group-hover:translate-x-2 transition-transform'}>
          {isSubmitting ? '◌' : '→'}
        </span>
      </button>
    </form>
  );
}
