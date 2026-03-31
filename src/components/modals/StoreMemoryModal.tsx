import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth';
import { useToastStore } from '../../store/toastStore';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';

interface StoreMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreMemoryModal({ isOpen, onClose }: StoreMemoryModalProps) {
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState(5);

  const userId = useAuthStore((state) => state.userId);
  const showToast = useToastStore((state) => state.show);
  const queryClient = useQueryClient();

  const storeMutation = useMutation({
    mutationFn: (data: { content: string; importance: number }) =>
      api.storeMemory(data.content, userId!, data.importance),
    onSuccess: () => {
      showToast({ type: 'success', message: 'Memory stored successfully!' });
      queryClient.invalidateQueries({ queryKey: ['memory'] });
      handleClose();
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to store memory',
      });
    },
  });

  const handleClose = () => {
    setContent('');
    setImportance(5);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim().length === 0) {
      showToast({ type: 'error', message: 'Content is required' });
      return;
    }

    storeMutation.mutate({
      content: content.trim(),
      importance,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="STORE MEMORY" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="CONTENT"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter memory content..."
          rows={6}
          required
          autoFocus
          maxLength={5000}
          showCount
        />

        <Slider
          label="IMPORTANCE"
          value={importance}
          onChange={setImportance}
          min={1}
          max={10}
          showValue
        />

        <div className="bg-jarvis-bg-dark border border-jarvis-cyan/20 rounded p-3">
          <p className="text-xs text-jarvis-text-muted">
            <strong>Importance levels:</strong>
            <br />
            1-3: Low priority (general notes)
            <br />
            4-7: Medium priority (important context)
            <br />
            8-10: High priority (critical information)
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            CANCEL
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={storeMutation.isPending}
          >
            {storeMutation.isPending ? 'STORING...' : 'STORE MEMORY'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
