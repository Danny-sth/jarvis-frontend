import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { logger } from '../lib/logger';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      // Redirect to admin dashboard after successful login
      navigate('/admin', { replace: true });
    } catch (err) {
      setError('Invalid username or password');
      logger.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-jarvis-bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display text-jarvis-cyan mb-2">JARVIS</h1>
          <p className="text-jarvis-text-secondary font-body">Not That Jarvis</p>
        </div>

        {/* Login Card */}
        <div className="bg-jarvis-bg-card border border-jarvis-cyan/20 rounded-lg p-8">
          <h2 className="text-2xl font-display text-jarvis-text-primary mb-6">LOGIN</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-jarvis-orange/10 border border-jarvis-orange/30 text-jarvis-orange px-4 py-3 rounded-lg font-body text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-body text-jarvis-text-secondary mb-2">
                USERNAME
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-body text-jarvis-text-secondary mb-2">
                PASSWORD
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
