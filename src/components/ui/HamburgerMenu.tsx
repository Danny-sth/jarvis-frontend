import { cn } from '../../lib/utils';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function HamburgerMenu({ isOpen, onClick, className }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col justify-center items-center w-10 h-10',
        'text-jarvis-cyan hover:text-jarvis-cyan/80 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-jarvis-cyan rounded',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span
        className={cn(
          'block w-6 h-0.5 bg-current transition-all duration-300',
          isOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0 translate-y-0'
        )}
      />
      <span
        className={cn(
          'block w-6 h-0.5 bg-current transition-all duration-300 my-1',
          isOpen ? 'opacity-0' : 'opacity-100'
        )}
      />
      <span
        className={cn(
          'block w-6 h-0.5 bg-current transition-all duration-300',
          isOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0 translate-y-0'
        )}
      />
    </button>
  );
}
