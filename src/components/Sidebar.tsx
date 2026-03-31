import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Heart,
  Workflow,
  Clock,
  Brain,
  Settings,
  LogOut,
  BookOpen,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'DASHBOARD' },
  { path: '/admin/queue', icon: ListTodo, label: 'QUEUE' },
  { path: '/admin/heartbeat', icon: Heart, label: 'HEARTBEAT' },
  { path: '/admin/workflows', icon: Workflow, label: 'WORKFLOWS' },
  { path: '/admin/recurring', icon: Clock, label: 'RECURRING' },
  { path: '/admin/memory', icon: Brain, label: 'MEMORY' },
  { path: '/admin/system', icon: Settings, label: 'SYSTEM' },
  { path: '/admin/users', icon: Users, label: 'USERS', adminOnly: true },
];

export default function Sidebar() {
  const { logout, username, role } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-jarvis-bg-sidebar border-r border-jarvis-cyan/20 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-jarvis-cyan/20">
        <h1 className="text-2xl font-display text-jarvis-cyan tracking-wider">JARVIS</h1>
        <p className="text-xs text-jarvis-text-muted font-body mt-1">Not That Jarvis</p>
        {username && (
          <p className="text-sm text-jarvis-text-secondary font-body mt-2 font-mono">
            @{username}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label, adminOnly }) => {
          // Hide admin-only links for non-admin users
          if (adminOnly && role !== 'root' && role !== 'admin') {
            return null;
          }

          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-jarvis-cyan/10 text-jarvis-cyan border border-jarvis-cyan/30'
                    : 'text-jarvis-text-secondary hover:bg-jarvis-bg-card hover:text-jarvis-text-primary'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-body font-semibold text-sm">{label}</span>
            </NavLink>
          );
        })}

        {/* Link to Documentation */}
        <a
          href="/docs"
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-jarvis-text-secondary hover:bg-jarvis-bg-card hover:text-jarvis-text-primary"
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-body font-semibold text-sm">DOCUMENTATION</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-jarvis-cyan/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-jarvis-orange hover:bg-jarvis-orange/80 text-white rounded-lg font-body font-semibold text-sm transition-colors"
        >
          <LogOut className="w-5 h-5" />
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
