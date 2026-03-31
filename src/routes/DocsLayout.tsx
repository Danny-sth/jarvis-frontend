import { Link, Outlet, NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, type DocCategory } from '../lib/api-client';
import { useIsMobile } from '../hooks/useMediaQuery';

export default function DocsLayout() {
  const { data: docs, isLoading } = useQuery({
    queryKey: ['docs-list'],
    queryFn: () => api.listDocs(),
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, mobileMenuOpen]);

  const Sidebar = () => (
    <aside className="w-64 bg-jarvis-bg-sidebar border-r border-jarvis-cyan/20 h-screen overflow-y-auto sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-jarvis-cyan/20">
        <Link to="/docs" className="flex items-center gap-3 group">
          <BookOpen className="w-6 h-6 text-jarvis-cyan group-hover:text-jarvis-orange transition-colors" />
          <div>
            <h1 className="text-xl font-display text-jarvis-cyan group-hover:text-jarvis-orange transition-colors">
              DOCS
            </h1>
            <p className="text-xs text-jarvis-text-muted font-body">Not That Jarvis</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {isLoading ? (
          <div className="text-sm text-jarvis-text-muted">Loading...</div>
        ) : docs && docs.length > 0 ? (
          <div className="space-y-6">
            {docs.map((category: DocCategory) => (
              <div key={category.category}>
                <h3 className="text-xs font-body text-jarvis-text-muted uppercase tracking-wider mb-2 px-3">
                  {category.category}
                </h3>
                <ul className="space-y-1">
                  {category.files.map((file) => (
                    <li key={file.path}>
                      <NavLink
                        to={file.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded text-sm font-body transition-colors ${
                            isActive
                              ? 'bg-jarvis-cyan/10 text-jarvis-cyan border-l-2 border-jarvis-cyan'
                              : 'text-jarvis-text-secondary hover:bg-jarvis-bg-card hover:text-jarvis-text-primary'
                          }`
                        }
                      >
                        {file.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-jarvis-text-muted px-3">No documentation found</div>
        )}
      </nav>

      {/* Footer Link */}
      <div className="p-4 border-t border-jarvis-cyan/20 mt-auto">
        <Link
          to="/admin"
          className="flex items-center gap-2 px-3 py-2 text-sm font-body text-jarvis-text-secondary hover:text-jarvis-cyan transition-colors"
        >
          ← Back to Admin
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-jarvis-bg-dark flex">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile */}
      {isMobile && (
        <>
          {/* Mobile Header */}
          <header className="fixed top-0 left-0 right-0 z-40 bg-jarvis-bg-sidebar border-b border-jarvis-cyan/20 px-4 py-3 flex items-center justify-between">
            <Link to="/docs" className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-jarvis-cyan" />
              <h1 className="text-lg font-display text-jarvis-cyan">DOCS</h1>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-jarvis-text-muted hover:text-jarvis-cyan transition-colors p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>

          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <div className="fixed top-0 left-0 z-50 h-screen w-80 max-w-[85vw] animate-in slide-in-from-left duration-300">
                <Sidebar />
              </div>
            </>
          )}
        </>
      )}

      {/* Content */}
      <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-14' : ''}`}>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
