// Event status and type variant mappings
export const STATUS_VARIANTS: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  success: 'success',
  error: 'error',
  timeout: 'warning',
};

export const TYPE_VARIANTS: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  api_request: 'info',
  tool_execution: 'default',
  worker_task: 'warning',
  external_service: 'success',
};

export function getStatusVariant(status: string): 'success' | 'error' | 'warning' | 'default' {
  return STATUS_VARIANTS[status] ?? 'default';
}

export function getTypeVariant(type: string): 'success' | 'error' | 'warning' | 'info' | 'default' {
  return TYPE_VARIANTS[type] ?? 'default';
}
