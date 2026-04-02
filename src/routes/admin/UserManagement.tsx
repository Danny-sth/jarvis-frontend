import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useUserAPI } from '../../contexts/APIContext';
import type { User } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../lib/utils';
import { CreateUserModal } from '../../components/modals/CreateUserModal';
import { EditUserModal } from '../../components/modals/EditUserModal';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';

export default function UserManagement() {
  const userAPI = useUserAPI();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { show: showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: () => userAPI.list(searchQuery || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userAPI.deleteUser(id),
    onSuccess: () => {
      showToast({ type: 'success', message: 'User deleted successfully!' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteModal({ isOpen: false, user: null });
    },
    onError: (error: Error) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to delete user',
      });
    },
  });

  const handleDelete = () => {
    if (deleteModal.user) {
      deleteMutation.mutate(deleteModal.user.id);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'root') return 'error';
    if (role === 'admin') return 'warning';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-jarvis-cyan mb-2">USER MANAGEMENT</h1>
          <p className="text-jarvis-text-secondary font-body">
            Manage user accounts and permissions
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          NEW USER
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex gap-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by username..."
            className="flex-1"
          />
          <Button variant="secondary">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      {isLoading ? (
        <Card>
          <p className="text-jarvis-text-muted font-body text-center">Loading users...</p>
        </Card>
      ) : users && users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-jarvis-cyan/20">
                <th className="text-left px-4 py-3 text-sm font-body font-semibold text-jarvis-text-secondary">
                  USERNAME
                </th>
                <th className="text-left px-4 py-3 text-sm font-body font-semibold text-jarvis-text-secondary">
                  ROLE
                </th>
                <th className="text-left px-4 py-3 text-sm font-body font-semibold text-jarvis-text-secondary">
                  TELEGRAM ID
                </th>
                <th className="text-left px-4 py-3 text-sm font-body font-semibold text-jarvis-text-secondary">
                  STATUS
                </th>
                <th className="text-left px-4 py-3 text-sm font-body font-semibold text-jarvis-text-secondary">
                  CREATED
                </th>
                <th className="text-right px-4 py-3 text-sm font-body font-semibold text-jarvis-text-secondary">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-jarvis-cyan/10 hover:bg-jarvis-bg-card/50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-jarvis-text-primary">{user.username}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                      {user.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-jarvis-text-muted text-sm">
                      {user.telegram_id || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.is_active ? 'success' : 'error'} size="sm">
                      {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-jarvis-text-muted text-sm">
                      {formatDate(user.created_at)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditModal({ isOpen: true, user })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteModal({ isOpen: true, user })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <p className="text-jarvis-text-muted font-body mb-4">No users found</p>
            <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              CREATE FIRST USER
            </Button>
          </div>
        </Card>
      )}

      <CreateUserModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />

      <EditUserModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        user={editModal.user}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDelete}
        itemName={`user '${deleteModal.user?.username}'`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
