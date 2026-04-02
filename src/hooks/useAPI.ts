// API Hooks - extracted from APIContext to fix Fast Refresh issues
import { useContext } from 'react';
import { APIContext } from '../contexts/APIContext';
import type { APIClients } from '../lib/api/base/APIFactory';

/**
 * Hook to access API clients
 * Throws error if used outside APIProvider
 */
export function useAPI(): APIClients {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within APIProvider');
  }
  return context;
}

// Individual client hooks for convenience and better type safety
export function useAuthAPI() {
  return useAPI().auth;
}

export function useQueueAPI() {
  return useAPI().queue;
}

export function useWorkflowAPI() {
  return useAPI().workflow;
}

export function useChatAPI() {
  return useAPI().chat;
}

export function useCortexAPI() {
  return useAPI().cortex;
}

export function useObsidianAPI() {
  return useAPI().obsidian;
}

export function useHeartbeatAPI() {
  return useAPI().heartbeat;
}

export function useRecurringTasksAPI() {
  return useAPI().recurringTasks;
}

export function useReflectionAPI() {
  return useAPI().reflection;
}

export function useSubtasksAPI() {
  return useAPI().subtasks;
}

export function useSystemAPI() {
  return useAPI().system;
}

export function useUserAPI() {
  return useAPI().user;
}

export function useDocsAPI() {
  return useAPI().docs;
}

export function useMonitoringAPI() {
  return useAPI().monitoring;
}

export function useActivityAPI() {
  return useAPI().activity;
}
