import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  animate?: boolean;
}

interface CardContentProps {
  children: ReactNode;
  baseClasses: string;
}

// ✅ Вынесено за пределы функции Card чтобы избежать создания компонента при каждом рендере
const CardContent = ({ children, baseClasses }: CardContentProps) => (
  <div className={baseClasses}>
    {/* Holographic overlay */}
    <div className="absolute inset-0 holographic opacity-30 pointer-events-none" />

    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-jarvis-cyan/30" />
    <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-jarvis-cyan/30" />
    <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-jarvis-cyan/30" />
    <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-jarvis-cyan/30" />

    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export function Card({ children, className = '', hover = true, glow = false, animate = true }: CardProps) {
  const baseClasses = `
    bg-jarvis-bg-card
    border border-jarvis-cyan/20
    rounded-xl
    p-8
    relative
    overflow-hidden
    ${glow ? 'border-glow' : ''}
    ${hover ? 'transition-all duration-300 hover:border-jarvis-cyan/40 hover:shadow-lg hover:shadow-jarvis-cyan/10' : ''}
    ${className}
  `;

  const content = <CardContent children={children} baseClasses={baseClasses} />;

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      {content}
    </motion.div>
  );
}
