import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CONFIRM DELETE" size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-jarvis-orange/10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-jarvis-orange" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-jarvis-text-primary mb-2">
              Are you sure you want to delete <strong>{itemName}</strong>?
            </p>
            <p className="text-xs text-jarvis-text-muted">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            CANCEL
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'DELETING...' : 'DELETE'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
