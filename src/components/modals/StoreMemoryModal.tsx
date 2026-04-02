import { useCortexAPI } from '../../hooks/useAPI';
import { useAuth } from '../../hooks/useAuth';
import { useFormState } from '../../hooks/forms/useFormState';
import { useFormValidation } from '../../hooks/forms/useFormValidation';
import { useFormSubmission } from '../../hooks/forms/useFormSubmission';
import { FormModal } from '../forms/FormModal';
import { Textarea } from '../ui/Textarea';
import { Slider } from '../ui/Slider';

interface StoreMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StoreMemoryFormValues {
  content: string;
  importance: number;
}

export function StoreMemoryModal({ isOpen, onClose }: StoreMemoryModalProps) {
  const { userId } = useAuth();
  const cortexAPI = useCortexAPI();

  const { values, setValue, reset } = useFormState<StoreMemoryFormValues>({
    content: '',
    importance: 5,
  });

  const { validate } = useFormValidation<StoreMemoryFormValues>({
    content: { required: true, minLength: 1 },
    importance: { min: 1, max: 10 },
  });

  const { submit, isSubmitting } = useFormSubmission<unknown, { content: string; importance: number }>({
    mutationFn: (data) => cortexAPI.storeMemory(data.content, userId!, data.importance),
    onSuccess: () => {
      reset();
      onClose();
    },
    invalidateQueries: ['memory'],
    successMessage: 'Memory stored successfully!',
    errorMessage: 'Failed to store memory',
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(values);
    if (errors.length > 0) {
      submit(null, errors);
      return;
    }

    submit({
      content: values.content.trim(),
      importance: values.importance,
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="STORE MEMORY"
      size="md"
      submitLabel="STORE MEMORY"
      isSubmitting={isSubmitting}
    >
      <Textarea
        label="CONTENT"
        value={values.content}
        onChange={(e) => setValue('content', e.target.value)}
        placeholder="Enter memory content..."
        rows={6}
        required
        autoFocus
        maxLength={5000}
        showCount
      />

      <Slider
        label="IMPORTANCE"
        value={values.importance}
        onChange={(value) => setValue('importance', value)}
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
    </FormModal>
  );
}
