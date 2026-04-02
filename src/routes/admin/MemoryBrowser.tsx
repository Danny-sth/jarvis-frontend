import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Brain, Plus } from 'lucide-react';
import { useCortexAPI } from '../../contexts/APIContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../lib/utils';
import { StoreMemoryModal } from '../../components/modals/StoreMemoryModal';

export default function MemoryBrowser() {
  const { userId } = useAuth();
  const cortexAPI = useCortexAPI();
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  const { data: results, isLoading } = useQuery({
    queryKey: ['memory-search', userId, searchQuery],
    queryFn: () => cortexAPI.searchMemory(searchQuery, userId!, 20),
    enabled: !!userId && !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-jarvis-cyan mb-2">MEMORY BROWSER</h1>
          <p className="text-jarvis-text-secondary font-body">
            Search through Cortex memory (pgvector)
          </p>
        </div>
        <Button variant="primary" onClick={() => setStoreModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          STORE MEMORY
        </Button>
      </div>

      {/* Search Form */}
      <Card>
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search memories..."
            className="flex-1"
          />
          <Button type="submit" variant="primary" disabled={!query || isLoading}>
            <Search className="w-5 h-5 mr-2" />
            SEARCH
          </Button>
        </form>
      </Card>

      {/* Results */}
      {isLoading ? (
        <Card>
          <p className="text-jarvis-text-muted font-body text-center">Searching...</p>
        </Card>
      ) : results && results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result, idx) => (
            <Card key={idx} hover>
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-jarvis-purple mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-jarvis-text-primary font-body mb-2 leading-relaxed">
                    {result.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-jarvis-text-muted font-mono">
                    <span>Importance: {result.importance}/10</span>
                    {result.distance !== undefined && (
                      <span>Distance: {result.distance.toFixed(4)}</span>
                    )}
                    <span>{formatDate(result.timestamp)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : searchQuery ? (
        <Card>
          <p className="text-jarvis-text-muted font-body text-center">
            No memories found for "{searchQuery}"
          </p>
        </Card>
      ) : null}

      <StoreMemoryModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
      />
    </div>
  );
}
