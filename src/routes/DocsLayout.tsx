import { Outlet, Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';

export default function DocsLayout() {
  return (
    <div className="min-h-screen bg-jarvis-bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-jarvis-bg-sidebar/95 backdrop-blur-sm border-b border-jarvis-cyan/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/docs" className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-jarvis-cyan" />
            <h1 className="text-xl font-display text-jarvis-cyan tracking-wider">
              JARVIS DOCS
            </h1>
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 bg-jarvis-purple hover:bg-jarvis-purple/80 text-white rounded-lg font-body font-medium text-sm transition-colors"
          >
            ADMIN PANEL
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
