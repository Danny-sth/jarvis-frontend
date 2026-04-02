import { useEffect } from 'react';
import type { User, UpdateUserRequest } from '../../lib/api';
import { useUserAPI } from '../../hooks/useAPI';
import { useFormState } from '../../hooks/forms/useFormState';
import { useFormValidation } from '../../hooks/forms/useFormValidation';
import { useFormSubmission } from '../../hooks/forms/useFormSubmission';
import { FormModal } from '../forms/FormModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { USER_ROLES } from '../../lib/constants';
import { useToast } from '../../hooks/useToast';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface EditUserFormValues {
  username: string;
  password: string;
  role: string;
  telegramId: string;
  isActive: boolean;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const userAPI = useUserAPI();
  const { show: showToast } = useToast();

  const { values, setValue, setMultipleValues, reset } = useFormState<EditUserFormValues>({
    username: '',
    password: '',
    role: 'public',
    telegramId: '',
    isActive: true,
  });

  // Pre-fill form when user changes
  useEffect(() => {
    if (user) {
      setMultipleValues({
        username: user.username,
        role: user.role,
        telegramId: user.telegram_id ? String(user.telegram_id) : '',
        isActive: user.is_active,
        password: '', // Don't pre-fill password
      });
    }
  }, [user, setMultipleValues]);

  const { validate } = useFormValidation<EditUserFormValues>({
    username: { required: true, minLength: 3 },
    password: { minLength: 8 }, // Optional but must be 8+ if provided
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

  const { submit, isSubmitting } = useFormSubmission<unknown, UpdateUserRequest>({
    mutationFn: (data) => userAPI.update(user!.id, data),
    onSuccess: () => {
      reset();
      onClose();
    },
    invalidateQueries: ['users'],
    successMessage: 'User updated successfully!',
    errorMessage: 'Failed to update user',
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const errors = validate(values);
    if (errors.length > 0) {
      submit(null, errors);
      return;
    }

    const telegramIdNum = values.telegramId.trim()
      ? parseInt(values.telegramId.trim())
      : null;

    const updates: UpdateUserRequest = {};

    // Only include changed fields
    if (values.username.trim() !== user.username) {
      updates.username = values.username.trim();
    }

    if (values.password) {
      updates.password = values.password;
    }

    if (values.role !== user.role) {
      updates.role = values.role;
    }

    const currentTgId = user.telegram_id ? String(user.telegram_id) : '';
    if (values.telegramId.trim() !== currentTgId) {
      updates.telegram_id = telegramIdNum;
    }

    if (values.isActive !== user.is_active) {
      updates.is_active = values.isActive;
    }

    if (Object.keys(updates).length === 0) {
      showToast({ type: 'info', message: 'No changes detected' });
      return;
    }

    submit(updates);
  };

  if (!user) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="EDIT USER"
      size="md"
      submitLabel="UPDATE USER"
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
        label="PASSWORD (leave empty to keep current)"
        type="password"
        value={values.password}
        onChange={(e) => setValue('password', e.target.value)}
        placeholder="Enter new password"
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
