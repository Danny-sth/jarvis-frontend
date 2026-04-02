import { useState, useCallback } from 'react';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { useToastStore } from '../../store/toastStore';
import type { ValidationError } from './useFormValidation';

export interface UseFormSubmissionOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Form submission hook with mutation, toast notifications, and query invalidation
 */
export function useFormSubmission<TData = unknown, TVariables = unknown>(
  options: UseFormSubmissionOptions<TData, TVariables>
) {
  const showToast = useToastStore((state) => state.show);
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const mutation = useMutation({
    mutationFn: options.mutationFn,
    onSuccess: (data) => {
      showToast({
        type: 'success',
        message: options.successMessage || 'Operation completed successfully!',
      });

      // Invalidate queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }

      // Clear validation errors on success
      setValidationErrors([]);

      // Call custom success handler
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      showToast({
        type: 'error',
        message: options.errorMessage || error.message || 'Operation failed',
      });

      options.onError?.(error);
    },
  } as UseMutationOptions<TData, Error, TVariables>);

  const submit = useCallback(
    (variables: TVariables | null, errors?: ValidationError[]) => {
      // Set validation errors if provided
      if (errors && errors.length > 0) {
        setValidationErrors(errors);
        showToast({
          type: 'error',
          message: errors[0].message,
        });
        return;
      }

      // Cannot submit without variables
      if (variables === null) {
        return;
      }

      // Clear validation errors and submit
      setValidationErrors([]);
      mutation.mutate(variables);
    },
    [mutation, showToast]
  );

  return {
    submit,
    isSubmitting: mutation.isPending,
    validationErrors,
    setValidationErrors,
  };
}
