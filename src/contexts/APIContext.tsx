/* eslint-disable react-refresh/only-export-components */
// API Context - provides API clients via React Context for dependency injection
import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { APIClients } from '../lib/api/base/APIFactory';
import { apiClients } from '../lib/api/base/APIFactory';

// ✅ Export context for use in hooks/useAPI.ts
export const APIContext = createContext<APIClients | null>(null);

interface APIProviderProps {
  children: ReactNode;
  clients?: APIClients; // Allow injecting custom clients for testing
}

export function APIProvider({ children, clients = apiClients }: APIProviderProps) {
  return <APIContext.Provider value={clients}>{children}</APIContext.Provider>;
}
