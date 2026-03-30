'use client';

import { useState } from 'react';
import { toastError, toastSuccess } from '@/utils/toast';
import { UseCMSFormOptions } from '@/types/hooks.types';

export function useCMSForm<T>({
  initialData,
  emptyData,
  createFn,
  updateFn,
  existingId,
  validate,
  onSuccess,
}: UseCMSFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFieldChange = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (validate) {
      const validationError = validate(formData);
      if (validationError) {
        setError(validationError);
        toastError(validationError);
        return;
      }
    }

    try {
      const result = existingId
        ? await updateFn(existingId, formData)
        : await createFn(formData);

      if (result.success) {
        setFormData(emptyData);
        toastSuccess(
          existingId
            ? 'Successfully updated item'
            : 'Successfully created item',
        );
        onSuccess?.();
      } else {
        setError(result.error || 'An unexpected error occurred');
        toastError('An unexpected error occurred');
      }
    } catch (error) {
      console.error((error as Error).message);
      setError('An unexpected error occurred');
      toastError('An unexpected error occurred');
    }
  };

  return {
    formData,
    error,
    handleInputChange,
    handleSelectChange,
    handleFieldChange,
    handleSubmit,
  };
}
