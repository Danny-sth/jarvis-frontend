import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useWorkflowAPI } from '../../contexts/APIContext';
import { useAuth } from '../../hooks/useAuth';
import { useFormState } from '../../hooks/forms/useFormState';
import { useFormValidation } from '../../hooks/forms/useFormValidation';
import { useFormSubmission } from '../../hooks/forms/useFormSubmission';
import { FormModal } from '../forms/FormModal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../../hooks/useToast';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateWorkflowFormValues {
  name: string;
  description: string;
  stepsJson: string;
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
  const [jsonError, setJsonError] = useState('');

  const { userId } = useAuth();
  const workflowAPI = useWorkflowAPI();
  const { show: showToast } = useToast();

  const { values, setValue, reset } = useFormState<CreateWorkflowFormValues>({
    name: '',
    description: '',
    stepsJson: JSON.stringify(DEFAULT_STEPS, null, 2),
  });

  const { validate } = useFormValidation<CreateWorkflowFormValues>({
    name: { required: true, minLength: 3 },
  });

  const { submit, isSubmitting } = useFormSubmission<
    unknown,
    { name: string; description?: string; steps: any[] }
  >({
    mutationFn: (data) =>
      workflowAPI.createWorkflow({
        user_id: userId!,
        name: data.name,
        description: data.description,
        steps: data.steps,
      }),
    onSuccess: () => {
      reset();
      setJsonError('');
      onClose();
    },
    invalidateQueries: ['workflows'],
    successMessage: 'Workflow created successfully!',
    errorMessage: 'Failed to create workflow',
  });

  const handleClose = () => {
    reset();
    setJsonError('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(values);
    if (errors.length > 0) {
      submit(null as any, errors);
      return;
    }

    // Validate and parse JSON
    let steps;
    try {
      steps = JSON.parse(values.stepsJson);
      if (!Array.isArray(steps)) {
        throw new Error('Steps must be an array');
      }
      setJsonError('');
    } catch (err: any) {
      setJsonError(err.message);
      showToast({ type: 'error', message: 'Invalid JSON: ' + err.message });
      return;
    }

    submit({
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      steps,
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="CREATE WORKFLOW"
      size="lg"
      submitLabel="CREATE WORKFLOW"
      isSubmitting={isSubmitting}
    >
      <Input
        label="NAME"
        value={values.name}
        onChange={(e) => setValue('name', e.target.value)}
        placeholder="Enter workflow name"
        required
        minLength={3}
        autoFocus
      />

      <Textarea
        label="DESCRIPTION (optional)"
        value={values.description}
        onChange={(e) => setValue('description', e.target.value)}
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
            value={values.stepsJson}
            onChange={(value) => setValue('stepsJson', value || '')}
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
        {jsonError && <p className="mt-2 text-sm text-jarvis-orange">{jsonError}</p>}
        <p className="mt-2 text-xs text-jarvis-text-muted">
          Each step should have: id, action_type, and params
        </p>
      </div>
    </FormModal>
  );
}
