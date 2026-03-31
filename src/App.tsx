import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      refetchOnWindowFocus: false,
    },
  },
});

// Temporary placeholder components
function DocsPage() {
  return (
    <div className="min-h-screen bg-jarvis-bg-dark text-jarvis-text-primary p-8">
      <h1 className="text-4xl font-display text-jarvis-cyan mb-4">JARVIS</h1>
      <p className="text-lg text-jarvis-text-secondary font-body">Documentation — Coming Soon</p>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="min-h-screen bg-jarvis-bg-dark text-jarvis-text-primary p-8">
      <h1 className="text-4xl font-display text-jarvis-cyan mb-4">JARVIS ADMIN</h1>
      <p className="text-lg text-jarvis-text-secondary font-body">Admin Panel — Coming Soon</p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<Navigate to="/docs" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
