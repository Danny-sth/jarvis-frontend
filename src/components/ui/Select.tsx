import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  label,
  disabled = false,
  multiple = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : [value];

  // Get display text
  const getDisplayText = () => {
    if (selectedValues.length === 0 || (selectedValues.length === 1 && !selectedValues[0])) {
      return placeholder;
    }
    if (multiple) {
      return `${selectedValues.length} selected`;
    }
    return options.find((opt) => opt.value === selectedValues[0])?.label || placeholder;
  };

  // Handle option click
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % options.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(options[highlightedIndex].value);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-body font-medium text-jarvis-text-secondary mb-2">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        {/* Select button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between px-4 py-2.5',
            'bg-jarvis-bg-dark border rounded-lg',
            'font-body text-base transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-jarvis-orange focus:border-jarvis-orange focus:ring-1 focus:ring-jarvis-orange'
              : 'border-jarvis-cyan/20 focus:border-jarvis-cyan focus:ring-1 focus:ring-jarvis-cyan',
            selectedValues.length > 0 && selectedValues[0]
              ? 'text-jarvis-text-primary'
              : 'text-jarvis-text-muted'
          )}
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-jarvis-cyan transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-50 w-full mt-2',
              'bg-jarvis-bg-card border border-jarvis-cyan/20 rounded-lg',
              'shadow-2xl max-h-60 overflow-y-auto',
              'animate-in fade-in slide-in-from-top-2 duration-200'
            )}
          >
            {options.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5',
                    'font-body text-sm text-left transition-colors',
                    isHighlighted && 'bg-jarvis-cyan/10',
                    isSelected
                      ? 'text-jarvis-cyan'
                      : 'text-jarvis-text-secondary hover:text-jarvis-text-primary'
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-jarvis-cyan" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-jarvis-orange">{error}</p>
      )}
    </div>
  );
}
