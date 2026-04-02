import type { CreateUserRequest } from '../../lib/api';
import { useUserAPI } from '../../contexts/APIContext';
import { useFormState } from '../../hooks/forms/useFormState';
import { useFormValidation } from '../../hooks/forms/useFormValidation';
import { useFormSubmission } from '../../hooks/forms/useFormSubmission';
import { FormModal } from '../forms/FormModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { USER_ROLES } from '../../lib/constants';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateUserFormValues {
  username: string;
  password: string;
  role: string;
  telegramId: string;
  isActive: boolean;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const userAPI = useUserAPI();

  const { values, setValue, reset } = useFormState<CreateUserFormValues>({
    username: '',
    password: '',
    role: 'public',
    telegramId: '',
    isActive: true,
  });

  const { validate } = useFormValidation<CreateUserFormValues>({
    username: { required: true, minLength: 3 },
    password: { required: true, minLength: 8 },
    telegramId: {
      custom: [
        {
          validate: (value: string) => {
            if (!value.trim()) return true;
            return !isNaN(parseInt(value.trim()));
          },
          message: 'Telegram ID must be a number',
        },
      ],
    },
  });

  const { submit, isSubmitting } = useFormSubmission<unknown, CreateUserRequest>({
    mutationFn: (data) => userAPI.create(data),
    onSuccess: () => {
      reset();
      onClose();
    },
    invalidateQueries: ['users'],
    successMessage: 'User created successfully!',
    errorMessage: 'Failed to create user',
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(values);
    if (errors.length > 0) {
      submit(null as any, errors);
      return;
    }

    const telegramIdNum = values.telegramId.trim()
      ? parseInt(values.telegramId.trim())
      : null;

    submit({
      username: values.username.trim(),
      password: values.password,
      role: values.role,
      telegram_id: telegramIdNum,
      is_active: values.isActive,
    });
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="CREATE USER"
      size="md"
      submitLabel="CREATE USER"
      isSubmitting={isSubmitting}
    >
      <Input
        label="USERNAME"
        value={values.username}
        onChange={(e) => setValue('username', e.target.value)}
        placeholder="Enter username"
        required
        minLength={3}
        autoFocus
      />

      <Input
        label="PASSWORD"
        type="password"
        value={values.password}
        onChange={(e) => setValue('password', e.target.value)}
        placeholder="Enter password (min 8 characters)"
        required
        minLength={8}
      />

      <Select
        label="ROLE"
        options={USER_ROLES.map((r) => ({ value: r.value, label: r.label }))}
        value={values.role}
        onChange={(value) => setValue('role', value as string)}
      />

      <Input
        label="TELEGRAM ID (optional)"
        type="number"
        value={values.telegramId}
        onChange={(e) => setValue('telegramId', e.target.value)}
        placeholder="Enter Telegram ID"
      />

      <Switch
        label="ACTIVE"
        checked={values.isActive}
        onChange={(checked) => setValue('isActive', checked)}
      />
    </FormModal>
  );
}
