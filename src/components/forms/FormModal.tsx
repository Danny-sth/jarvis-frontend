import type { ReactNode } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  showCancel?: boolean;
}

/**
 * Reusable form modal wrapper
 * Wraps Modal component with form-specific functionality
 */
export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  size = 'md',
  submitLabel = 'SUBMIT',
  cancelLabel = 'CANCEL',
  isSubmitting = false,
  showCancel = true,
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}

        <div className="flex justify-end gap-3 pt-4">
          {showCancel && (
            <Button type="button" variant="ghost" onClick={onClose}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'PROCESSING...' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
