import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { api } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth';
import { useToastStore } from '../../store/toastStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { CronPreview } from '../CronPreview';

interface CreateRecurringTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow' },
  { value: 'America/New_York', label: 'America/New York' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
];

const TASK_TYPES = [
  { value: 'message', label: 'Message' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'email', label: 'Email' },
  { value: 'workflow', label: 'Run Workflow' },
];

const DEFAULT_PARAMS: Record<string, any> = {
  message: { text: 'Hello!', channel: 'general' },
  reminder: { text: 'Reminder text', notify: true },
  email: { to: 'user@example.com', subject: 'Subject', body: 'Body' },
  workflow: { workflow_id: 'workflow-id', variables: {} },
};

export function CreateRecurringTaskModal({ isOpen, onClose }: CreateRecurringTaskModalProps) {
  const [name, setName] = useState('');
  const [cronExpression, setCronExpression] = useState('0 10 * * *');
  const [taskType, setTaskType] = useState('message');
  const [timezone, setTimezone] = useState('UTC');
  const [enabled, setEnabled] = useState(true);
  const [taskParamsJson, setTaskParamsJson] = useState(
    JSON.stringify(DEFAULT_PARAMS.message, null, 2)
  );
  const [jsonError, setJsonError] = useState('');

  const userId = useAuthStore((state) => state.userId);
  const showToast = useToastStore((state) => state.show);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createRecurring(data),
    onSuccess: () => {
      showToast({ type: 'success', message: 'Recurring task created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
      handleClose();
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to create recurring task',
      });
    },
  });

  const handleClose = () => {
    setName('');
    setCronExpression('0 10 * * *');
    setTaskType('message');
    setTimezone('UTC');
    setEnabled(true);
    setTaskParamsJson(JSON.stringify(DEFAULT_PARAMS.message, null, 2));
    setJsonError('');
    onClose();
  };

  const handleTaskTypeChange = (newType: string) => {
    setTaskType(newType);
    setTaskParamsJson(JSON.stringify(DEFAULT_PARAMS[newType] || {}, null, 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (name.trim().length < 3) {
      showToast({ type: 'error', message: 'Name must be at least 3 characters' });
      return;
    }

    // Validate cron
    if (cronExpression.trim().length === 0) {
      showToast({ type: 'error', message: 'Cron expression is required' });
      return;
    }

    // Validate and parse JSON
    let taskParams;
    try {
      taskParams = JSON.parse(taskParamsJson);
      setJsonError('');
    } catch (err: any) {
      setJsonError(err.message);
      showToast({ type: 'error', message: 'Invalid JSON: ' + err.message });
      return;
    }

    createMutation.mutate({
      user_id: userId!,
      name: name.trim(),
      cron_expression: cronExpression.trim(),
      task_type: taskType,
      task_params: taskParams,
      timezone,
      enabled,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="CREATE RECURRING TASK" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          required
          minLength={3}
          autoFocus
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CRON EXPRESSION"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="0 10 * * *"
            required
          />

          <Select
            label="TIMEZONE"
            options={TIMEZONES}
            value={timezone}
            onChange={(value) => setTimezone(value as string)}
          />
        </div>

        <CronPreview cron={cronExpression} timezone={timezone} count={5} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="TASK TYPE"
            options={TASK_TYPES}
            value={taskType}
            onChange={(value) => handleTaskTypeChange(value as string)}
          />

          <Switch
            label="ENABLED"
            checked={enabled}
            onChange={setEnabled}
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-jarvis-text-secondary mb-2">
            TASK PARAMETERS (JSON)
          </label>
          <div className="border border-jarvis-cyan/20 rounded-lg overflow-hidden">
            <Editor
              height="300px"
              defaultLanguage="json"
              value={taskParamsJson}
              onChange={(value) => setTaskParamsJson(value || '')}
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
            {createMutation.isPending ? 'CREATING...' : 'CREATE TASK'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
