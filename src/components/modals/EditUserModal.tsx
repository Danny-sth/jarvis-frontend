import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type User, type UpdateUserRequest } from '../../lib/api-client';
import { useToastStore } from '../../store/toastStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { USER_ROLES } from '../../lib/constants';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('public');
  const [telegramId, setTelegramId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const showToast = useToastStore((state) => state.show);
  const queryClient = useQueryClient();

  // Pre-fill form when user changes
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRole(user.role);
      setTelegramId(user.telegram_id ? String(user.telegram_id) : '');
      setIsActive(user.is_active);
      setPassword(''); // Don't pre-fill password
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => api.updateUser(user!.id, data),
    onSuccess: () => {
      showToast({ type: 'success', message: 'User updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
    },
    onError: (error: Error) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to update user',
      });
    },
  });

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setRole('public');
    setTelegramId('');
    setIsActive(true);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validate
    if (username.trim().length < 3) {
      showToast({ type: 'error', message: 'Username must be at least 3 characters' });
      return;
    }

    if (password && password.length < 8) {
      showToast({ type: 'error', message: 'Password must be at least 8 characters if provided' });
      return;
    }

    const telegramIdNum = telegramId.trim() ? parseInt(telegramId.trim()) : null;
    if (telegramId.trim() && isNaN(telegramIdNum!)) {
      showToast({ type: 'error', message: 'Telegram ID must be a number' });
      return;
    }

    const updates: UpdateUserRequest = {};

    // Only include changed fields
    if (username.trim() !== user.username) {
      updates.username = username.trim();
    }

    if (password) {
      updates.password = password;
    }

    if (role !== user.role) {
      updates.role = role;
    }

    const currentTgId = user.telegram_id ? String(user.telegram_id) : '';
    if (telegramId.trim() !== currentTgId) {
      updates.telegram_id = telegramIdNum;
    }

    if (isActive !== user.is_active) {
      updates.is_active = isActive;
    }

    if (Object.keys(updates).length === 0) {
      showToast({ type: 'info', message: 'No changes detected' });
      return;
    }

    updateMutation.mutate(updates);
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="EDIT USER" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
          minLength={3}
          autoFocus
        />

        <Input
          label="PASSWORD (leave empty to keep current)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          minLength={8}
        />

        <Select
          label="ROLE"
          options={USER_ROLES.map(r => ({ value: r.value, label: r.label }))}
          value={role}
          onChange={(value) => setRole(value as string)}
        />

        <Input
          label="TELEGRAM ID (optional)"
          type="number"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          placeholder="Enter Telegram ID"
        />

        <Switch label="ACTIVE" checked={isActive} onChange={setIsActive} />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            CANCEL
          </Button>
          <Button type="submit" variant="primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'UPDATING...' : 'UPDATE USER'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
