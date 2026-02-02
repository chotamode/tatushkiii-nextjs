'use client';

import { useForm } from 'react-hook-form';
import { useRef, useState, useCallback } from 'react';
import { useBookingForm } from '@/hooks/useBookingForm';
import type { BookingFormData } from '@/lib/booking';
import { MAX_PHOTO_SIZE } from '@/lib/booking';
import type { Locale } from '@/hooks/useTranslation';

interface BookingFormProps {
  t: {
    contact: {
      form: {
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        tattooSectionTitle: string;
        description: string;
        descriptionPlaceholder: string;
        note: string;
        notePlaceholder: string;
        placement: string;
        placementPlaceholder: string;
        size: string;
        sizePlaceholder: string;
        photoUpload: string;
        photoMaxSize: string;
        photoRemove: string;
        submit: string;
        sending: string;
        successMessage: string;
        errorMessage: string;
        errorPhotoLost: string;
        validation: {
          nameRequired: string;
          nameMinLength: string;
          emailRequired: string;
          emailInvalid: string;
          descriptionRequired: string;
          descriptionMinLength: string;
          photoTooLarge: string;
        };
      };
    };
  };
  locale: Locale;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const IG_REGEX = /^@?[a-zA-Z0-9._]{1,30}$/;

// Reusable field wrapper
function FormField({
  label,
  error,
  className = '',
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`group border-b border-black relative ${className}`}>
      <label className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {children}
      {error && (
        <span className="absolute bottom-1 left-2 font-mono text-[10px] text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

export default function BookingForm({ t, locale }: BookingFormProps) {
  const form = t.contact.form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>();

  const { submitForm, isSubmitting } = useBookingForm({
    successMessage: form.successMessage,
    errorMessage: form.errorMessage,
    errorPhotoLost: form.errorPhotoLost,
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError(form.validation.photoTooLarge);
      e.target.value = '';
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setPhotoName(file.name);

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // strip data:image/...;base64,
      setPhotoBase64(base64);
    };
    reader.readAsDataURL(file);
  }, [form.validation.photoTooLarge]);

  const removePhoto = useCallback(() => {
    setPhotoBase64(null);
    setPhotoName(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [photoPreview]);

  const onSubmit = async (data: BookingFormData) => {
    const ok = await submitForm(data, locale, photoBase64 || undefined, photoName || undefined);
    if (ok) {
      reset();
      removePhoto();
    }
  };

  const inputClass = 'w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 focus:bg-gray-50 transition-colors';
  const textareaClass = 'w-full bg-transparent p-8 pt-10 focus:outline-none font-display text-2xl placeholder-gray-200 resize-none h-36 focus:bg-gray-50 transition-colors';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0 border-t border-black">
      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <FormField label={form.name} error={errors.name?.message} className="border-r-0 md:border-r">
          <input
            type="text"
            className={inputClass}
            placeholder={form.namePlaceholder}
            disabled={isSubmitting}
            {...register('name', {
              required: form.validation.nameRequired,
              minLength: { value: 2, message: form.validation.nameMinLength },
            })}
          />
        </FormField>
        <FormField label={form.email} error={errors.email?.message}>
          <input
            type="text"
            className={inputClass}
            placeholder={form.emailPlaceholder}
            disabled={isSubmitting}
            {...register('email', {
              required: form.validation.emailRequired,
              validate: (value: string) => {
                const trimmed = value.trim();
                if (EMAIL_REGEX.test(trimmed) || IG_REGEX.test(trimmed)) return true;
                return form.validation.emailInvalid;
              },
            })}
          />
        </FormField>
      </div>

      {/* Row 2: Phone (full width) */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <FormField label={form.phone} className="border-r-0 md:border-r">
          <input
            type="tel"
            className={inputClass}
            placeholder={form.phonePlaceholder}
            disabled={isSubmitting}
            {...register('phone')}
          />
        </FormField>
        <div className="border-b border-black hidden md:block" />
      </div>

      {/* Tattoo section title */}
      <div className="border-b border-black py-6 px-8">
        <p className="font-display text-xl md:text-2xl text-center text-gray-600">
          {form.tattooSectionTitle}
        </p>
      </div>

      {/* Row 3: Description + Note */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <FormField label={form.description} error={errors.description?.message} className="border-r-0 md:border-r">
          <textarea
            className={textareaClass}
            placeholder={form.descriptionPlaceholder}
            disabled={isSubmitting}
            {...register('description', {
              required: form.validation.descriptionRequired,
              minLength: { value: 10, message: form.validation.descriptionMinLength },
            })}
          />
        </FormField>
        <FormField label={form.note}>
          <textarea
            className={textareaClass}
            placeholder={form.notePlaceholder}
            disabled={isSubmitting}
            {...register('note')}
          />
        </FormField>
      </div>

      {/* Row 4: Placement (full width) */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <FormField label={form.placement} className="border-r-0 md:border-r">
          <input
            type="text"
            className={inputClass}
            placeholder={form.placementPlaceholder}
            disabled={isSubmitting}
            {...register('placement')}
          />
        </FormField>
        <div className="border-b border-black hidden md:block" />
      </div>

      {/* Row 5: Size + Photo upload */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <FormField label={form.size} className="border-r-0 md:border-r">
          <input
            type="text"
            className={inputClass}
            placeholder={form.sizePlaceholder}
            disabled={isSubmitting}
            {...register('size')}
          />
        </FormField>
        <div className="border-b border-black relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />

          {photoPreview ? (
            // Photo preview
            <div className="flex items-center gap-4 p-4 pt-4 h-full">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-16 h-16 object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-gray-500 truncate">{photoName}</p>
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="font-mono text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors px-2 py-1 border border-red-200 hover:border-red-400"
              >
                {form.photoRemove}
              </button>
            </div>
          ) : (
            // Upload button
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="w-full h-full min-h-[4.5rem] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span className="font-display text-2xl text-gray-300">+</span>
              <span className="font-mono text-sm uppercase tracking-widest text-gray-400">
                {form.photoUpload}
              </span>
            </button>
          )}

          {photoError && (
            <span className="absolute bottom-1 left-2 font-mono text-[10px] text-red-500">
              {photoError}
            </span>
          )}
        </div>
      </div>

      {/* Max file size note */}
      <div className="border-b border-black py-2 px-8">
        <p className="font-mono text-[10px] text-gray-400 text-center tracking-widest">
          {form.photoMaxSize}
        </p>
      </div>

      {/* Submit button */}
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
