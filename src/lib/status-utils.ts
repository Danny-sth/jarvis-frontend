/**
 * Status Utility Functions
 * Centralized status-to-style mapping
 */

import { STATUS_COLORS, EVENT_TYPE_COLORS, ROLE_BADGE_VARIANTS } from './constants';

// =============================================================================
// STATUS COLOR MAPPING
// =============================================================================

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending;
}

export function getEventTypeColor(eventType: string): string {
  return EVENT_TYPE_COLORS[eventType as keyof typeof EVENT_TYPE_COLORS] || EVENT_TYPE_COLORS.api_request;
}

// =============================================================================
// BADGE VARIANT MAPPING
// =============================================================================

export type BadgeVariant = 'success' | 'error' | 'warning' | 'default' | 'info';

export function getStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'success':
    case 'completed':
      return 'success';
    case 'error':
    case 'failed':
      return 'error';
    case 'timeout':
    case 'running':
    case 'pending':
      return 'warning';
    case 'cancelled':
    default:
      return 'default';
  }
}

export function getEventTypeBadgeVariant(eventType: string): BadgeVariant {
  switch (eventType) {
    case 'api_request':
      return 'info';
    case 'tool_execution':
      return 'success';
    case 'worker_task':
      return 'warning';
    case 'external_service':
      return 'default';
    default:
      return 'default';
  }
}

export function getRoleBadgeVariant(role: string): BadgeVariant {
  const variant = ROLE_BADGE_VARIANTS[role as keyof typeof ROLE_BADGE_VARIANTS];
  return (variant as BadgeVariant) || 'default';
}

// =============================================================================
// STATUS TEXT FORMATTING
// =============================================================================

export function formatStatus(status: string): string {
  return status.toUpperCase().replace(/_/g, ' ');
}

export function formatEventType(eventType: string): string {
  return eventType.replace(/_/g, ' ').toUpperCase();
}

// =============================================================================
// DURATION FORMATTING
// =============================================================================

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(' ');
}

// =============================================================================
// PERCENTAGE FORMATTING
// =============================================================================

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// =============================================================================
// DATE/TIME FORMATTING
// =============================================================================

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDateTime(dateString);
}
