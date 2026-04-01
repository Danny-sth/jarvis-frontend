import { AIHead } from './AIHead';
import { AIEyes } from './AIEyes';

export function AIPresence() {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
      {/* Head silhouette backdrop */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <AIHead />
      </div>

      {/* Eyes in foreground */}
      <div className="relative">
        <AIEyes />
      </div>
    </div>
  );
}
