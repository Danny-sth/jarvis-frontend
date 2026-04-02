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
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-jarvis-red opacity-40" />
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-jarvis-orange opacity-40" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-jarvis-orange opacity-40" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-jarvis-gold opacity-40" />

    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export function Card({ children, className = '', hover = true, glow = false, animate = true }: CardProps) {
  const baseClasses = `
    bg-jarvis-bg-card
    border border-jarvis-red/20
    rounded-lg
    p-6
    relative
    overflow-hidden
    ${glow ? 'border-glow' : ''}
    ${hover ? 'transition-all duration-300 hover:border-jarvis-orange/40 hover:shadow-lg hover:shadow-jarvis-red/20 hover:scale-[1.02]' : ''}
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
