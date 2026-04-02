import { useState, lazy, Suspense } from 'react';
const Editor = lazy(() => import('@monaco-editor/react'));
import { useRecurringTasksAPI } from '../../hooks/useAPI';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useFormState } from '../../hooks/forms/useFormState';
import { useFormValidation } from '../../hooks/forms/useFormValidation';
import { useFormSubmission } from '../../hooks/forms/useFormSubmission';
import { FormModal } from '../forms/FormModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { CronPreview } from '../CronPreview';
import type { ConfigRecord } from '../../lib/api/types';

interface CreateRecurringTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateRecurringTaskFormValues {
  name: string;
  cronExpression: string;
  taskType: string;
  timezone: string;
  enabled: boolean;
  taskParamsJson: string;
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

const DEFAULT_PARAMS: Record<string, ConfigRecord> = {
  message: { text: 'Hello!', channel: 'general' },
  reminder: { text: 'Reminder text', notify: true },
  email: { to: 'user@example.com', subject: 'Subject', body: 'Body' },
  workflow: { workflow_id: 'workflow-id', variables: {} },
};

export function CreateRecurringTaskModal({ isOpen, onClose }: CreateRecurringTaskModalProps) {
  const [jsonError, setJsonError] = useState('');

  const { userId } = useAuth();
  const recurringTasksAPI = useRecurringTasksAPI();
  const { show: showToast } = useToast();

  const { values, setValue, reset } = useFormState<CreateRecurringTaskFormValues>({
    name: '',
    cronExpression: '0 10 * * *',
    taskType: 'message',
    timezone: 'UTC',
    enabled: true,
    taskParamsJson: JSON.stringify(DEFAULT_PARAMS.message, null, 2),
  });

  const { validate } = useFormValidation<CreateRecurringTaskFormValues>({
    name: { required: true, minLength: 3 },
    cronExpression: { required: true, minLength: 1 },
  });

  const { submit, isSubmitting } = useFormSubmission<
    unknown,
    {
      user_id: string;
      name: string;
      cron_expression: string;
      task_type: string;
      task_params: ConfigRecord;
      timezone: string;
      enabled: boolean;
    }
  >({
    mutationFn: (data) => recurringTasksAPI.create(data),
    onSuccess: () => {
      reset();
      setJsonError('');
      onClose();
    },
    invalidateQueries: ['recurring'],
    successMessage: 'Recurring task created successfully!',
    errorMessage: 'Failed to create recurring task',
  });

  const handleClose = () => {
    reset();
    setJsonError('');
    onClose();
  };

  const handleTaskTypeChange = (newType: string) => {
    setValue('taskType', newType);
    setValue('taskParamsJson', JSON.stringify(DEFAULT_PARAMS[newType] || {}, null, 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(values);
    if (errors.length > 0) {
      submit(null, errors);
      return;
    }

    // Validate and parse JSON
    let taskParams;
    try {
      taskParams = JSON.parse(values.taskParamsJson);
      setJsonError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON format';
      setJsonError(message);
      showToast({ type: 'error', message: 'Invalid JSON: ' + message });
      return;
    }

    submit({
      user_id: userId!,
      name: values.name.trim(),
      cron_expression: values.cronExpression.trim(),
      task_type: values.taskType,
      task_params: taskParams,
      timezone: values.timezone,
      enabled: values.enabled,
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="CREATE RECURRING TASK"
      size="lg"
      submitLabel="CREATE TASK"
      isSubmitting={isSubmitting}
    >
      <Input
        label="NAME"
        value={values.name}
        onChange={(e) => setValue('name', e.target.value)}
        placeholder="Enter task name"
        required
        minLength={3}
        autoFocus
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="CRON EXPRESSION"
          value={values.cronExpression}
          onChange={(e) => setValue('cronExpression', e.target.value)}
          placeholder="0 10 * * *"
          required
        />

        <Select
          label="TIMEZONE"
          options={TIMEZONES}
          value={values.timezone}
          onChange={(value) => setValue('timezone', value as string)}
        />
      </div>

      <CronPreview cron={values.cronExpression} timezone={values.timezone} count={5} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="TASK TYPE"
          options={TASK_TYPES}
          value={values.taskType}
          onChange={(value) => handleTaskTypeChange(value as string)}
        />

        <Switch
          label="ENABLED"
          checked={values.enabled}
          onChange={(checked) => setValue('enabled', checked)}
        />
      </div>

      <div>
        <label className="block text-sm font-body font-medium text-jarvis-text-secondary mb-2">
          TASK PARAMETERS (JSON)
        </label>
        <div className="border border-jarvis-cyan/20 rounded-lg overflow-hidden">
          <Suspense
            fallback={
              <div className="h-[300px] flex items-center justify-center bg-jarvis-bg-dark text-jarvis-text-muted">
                Loading editor...
              </div>
            }
          >
            <Editor
              height="300px"
              defaultLanguage="json"
              value={values.taskParamsJson}
              onChange={(value) => setValue('taskParamsJson', value || '')}
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
          </Suspense>
        </div>
        {jsonError && <p className="mt-2 text-sm text-jarvis-orange">{jsonError}</p>}
      </div>
    </FormModal>
  );
}
