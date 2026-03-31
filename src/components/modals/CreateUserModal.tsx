import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { useToastStore } from '../../store/toastStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES = [
  { value: 'public', label: 'Public' },
  { value: 'admin', label: 'Admin' },
  { value: 'root', label: 'Root' },
];

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('public');
  const [telegramId, setTelegramId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const showToast = useToastStore((state) => state.show);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createUser(data),
    onSuccess: () => {
      showToast({ type: 'success', message: 'User created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to create user',
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

    // Validate
    if (username.trim().length < 3) {
      showToast({ type: 'error', message: 'Username must be at least 3 characters' });
      return;
    }

    if (password.length < 8) {
      showToast({ type: 'error', message: 'Password must be at least 8 characters' });
      return;
    }

    const telegramIdNum = telegramId.trim() ? parseInt(telegramId.trim()) : null;
    if (telegramId.trim() && isNaN(telegramIdNum!)) {
      showToast({ type: 'error', message: 'Telegram ID must be a number' });
      return;
    }

    createMutation.mutate({
      username: username.trim(),
      password,
      role,
      telegram_id: telegramIdNum,
      is_active: isActive,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="CREATE USER" size="md">
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
          label="PASSWORD"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password (min 8 characters)"
          required
          minLength={8}
        />

        <Select
          label="ROLE"
          options={ROLES}
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
          <Button type="submit" variant="primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'CREATING...' : 'CREATE USER'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
