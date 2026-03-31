import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Play } from 'lucide-react';
import { api } from '../../lib/api-client';
import type { HeartbeatConfig as IHeartbeatConfig } from '../../lib/api-client';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/auth';

const AVAILABLE_CHECKS = ['gmail', 'calendar', 'tasks', 'system'];

export default function HeartbeatConfig() {
  const { userId } = useAuthStore();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const { data: config, isLoading } = useQuery({
    queryKey: ['heartbeat-config', userId],
    queryFn: () => api.getHeartbeatConfig(userId!),
    enabled: !!userId,
  });

  const [formData, setFormData] = useState<IHeartbeatConfig>(
    config || {
      enabled: true,
      interval_minutes: 60,
      active_hours_start: 9,
      active_hours_end: 22,
      timezone: 'UTC',
      checks: ['gmail', 'calendar'],
      check_configs: {},
    }
  );

  useState(() => {
    if (config) setFormData(config);
  });

  const updateMutation = useMutation({
    mutationFn: (data: IHeartbeatConfig) => api.updateHeartbeatConfig(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heartbeat-config', userId] });
      setMessage('Config saved successfully');
      setTimeout(() => setMessage(''), 3000);
    },
  });

  const runMutation = useMutation({
    mutationFn: () => api.runHeartbeat(userId!),
    onSuccess: () => {
      setMessage('Heartbeat executed');
      setTimeout(() => setMessage(''), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const toggleCheck = (check: string) => {
    setFormData((prev) => ({
      ...prev,
      checks: prev.checks.includes(check)
        ? prev.checks.filter((c) => c !== check)
        : [...prev.checks, check],
    }));
  };

  if (isLoading) {
    return <div className="text-jarvis-cyan font-body">Loading configuration...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display text-jarvis-cyan mb-2">HEARTBEAT CONFIG</h1>
        <p className="text-jarvis-text-secondary font-body">
          Configure periodic health checks and monitoring
        </p>
      </div>

      {message && (
        <Card className="bg-jarvis-cyan/10 border-jarvis-cyan">
          <p className="text-jarvis-cyan font-body font-semibold">{message}</p>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enabled */}
        <Card>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, enabled: e.target.checked }))
              }
              className="w-5 h-5 bg-jarvis-bg-dark border border-jarvis-cyan/30 rounded accent-jarvis-cyan"
            />
            <span className="text-jarvis-text-primary font-body font-semibold">
              ENABLE HEARTBEAT
            </span>
          </label>
        </Card>

        {/* Interval */}
        <Card>
          <Input
            type="number"
            label="INTERVAL (minutes)"
            min={5}
            max={1440}
            value={formData.interval_minutes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                interval_minutes: parseInt(e.target.value) || 60,
              }))
            }
          />
        </Card>

        {/* Active Hours */}
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="ACTIVE HOURS START"
              min={0}
              max={23}
              value={formData.active_hours_start}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  active_hours_start: parseInt(e.target.value) || 0,
                }))
              }
            />
            <Input
              type="number"
              label="ACTIVE HOURS END"
              min={0}
              max={23}
              value={formData.active_hours_end}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  active_hours_end: parseInt(e.target.value) || 23,
                }))
              }
            />
          </div>
        </Card>

        {/* Timezone */}
        <Card>
          <Input
            label="TIMEZONE"
            value={formData.timezone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, timezone: e.target.value }))
            }
            placeholder="UTC"
          />
        </Card>

        {/* Checks */}
        <Card>
          <h3 className="text-lg font-display text-jarvis-cyan mb-4">ENABLED CHECKS</h3>
          <div className="space-y-3">
            {AVAILABLE_CHECKS.map((check) => (
              <label key={check} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.checks.includes(check)}
                  onChange={() => toggleCheck(check)}
                  className="w-5 h-5 bg-jarvis-bg-dark border border-jarvis-cyan/30 rounded accent-jarvis-cyan"
                />
                <span className="text-jarvis-text-primary font-body font-medium uppercase">
                  {check}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={updateMutation.isPending}
            className="flex-1"
          >
            <Save className="w-5 h-5 mr-2" />
            SAVE CONFIG
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => runMutation.mutate()}
            disabled={runMutation.isPending}
          >
            <Play className="w-5 h-5 mr-2" />
            RUN NOW
          </Button>
        </div>
      </form>
    </div>
  );
}
