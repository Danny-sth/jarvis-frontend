import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { api } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth';
import { useToastStore } from '../../store/toastStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_STEPS = [
  {
    id: 'step1',
    action_type: 'wait',
    params: {
      seconds: 5,
    },
  },
];

export function CreateWorkflowModal({ isOpen, onClose }: CreateWorkflowModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stepsJson, setStepsJson] = useState(JSON.stringify(DEFAULT_STEPS, null, 2));
  const [jsonError, setJsonError] = useState('');

  const userId = useAuthStore((state) => state.userId);
  const showToast = useToastStore((state) => state.show);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; steps: any[] }) =>
      api.createWorkflow({
        user_id: userId!,
        name: data.name,
        description: data.description,
        steps: data.steps,
      }),
    onSuccess: () => {
      showToast({ type: 'success', message: 'Workflow created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      handleClose();
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to create workflow',
      });
    },
  });

  const handleClose = () => {
    setName('');
    setDescription('');
    setStepsJson(JSON.stringify(DEFAULT_STEPS, null, 2));
    setJsonError('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (name.trim().length < 3) {
      showToast({ type: 'error', message: 'Name must be at least 3 characters' });
      return;
    }

    // Validate and parse JSON
    let steps;
    try {
      steps = JSON.parse(stepsJson);
      if (!Array.isArray(steps)) {
        throw new Error('Steps must be an array');
      }
      setJsonError('');
    } catch (err: any) {
      setJsonError(err.message);
      showToast({ type: 'error', message: 'Invalid JSON: ' + err.message });
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      steps,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="CREATE WORKFLOW" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter workflow name"
          required
          minLength={3}
          autoFocus
        />

        <Textarea
          label="DESCRIPTION (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this workflow does"
          rows={3}
        />

        <div>
          <label className="block text-sm font-body font-medium text-jarvis-text-secondary mb-2">
            STEPS (JSON)
          </label>
          <div className="border border-jarvis-cyan/20 rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="json"
              value={stepsJson}
              onChange={(value) => setStepsJson(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
          {jsonError && (
            <p className="mt-2 text-sm text-jarvis-orange">{jsonError}</p>
          )}
          <p className="mt-2 text-xs text-jarvis-text-muted">
            Each step should have: id, action_type, and params
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            CANCEL
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'CREATING...' : 'CREATE WORKFLOW'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
