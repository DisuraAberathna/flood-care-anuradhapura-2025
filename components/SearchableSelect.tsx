'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface SearchableSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  getDisplayValue?: (value: string) => string;
  hideSearch?: boolean;
  className?: string;
}

export default function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  getDisplayValue,
  hideSearch = false,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter options based on search term (only if search is enabled)
  const filteredOptions = hideSearch 
    ? options 
    : options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Get display value - if empty or 'all' and getDisplayValue returns empty, show placeholder
  const displayValue = value 
    ? (getDisplayValue ? getDisplayValue(value) : value)
    : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    
    if (!isOpen) {
      // Calculate if dropdown should open upward
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300; // max-height of dropdown
        
        // Open upward if there's not enough space below but enough space above
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setOpenUpward(true);
        } else {
          setOpenUpward(false);
        }
      }
      
      setSearchTerm('');
      setHighlightedIndex(-1);
      if (!hideSearch) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
    
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
        }
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  return (
    <div className={`searchable-select-container ${className}`} ref={containerRef}>
      <div
        className={`searchable-select ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''} ${className ? className : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={id ? `${id}-listbox` : undefined}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="searchable-select-value">
          {displayValue || <span className="searchable-select-placeholder">{placeholder}</span>}
        </div>
        <FaChevronDown className={`searchable-select-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div className={`searchable-select-dropdown ${hideSearch ? 'no-search' : ''} ${openUpward ? 'open-upward' : ''}`}>
          {!hideSearch && (
            <div className="searchable-select-search">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="searchable-select-input"
                autoFocus
              />
            </div>
          )}
          <ul
            ref={listRef}
            id={id ? `${id}-listbox` : undefined}
            className="searchable-select-list"
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <li className="searchable-select-option no-results">No results found</li>
            ) : (
              filteredOptions.map((option, index) => {
                const displayText = getDisplayValue ? getDisplayValue(option) : option;
                return (
                  <li
                    key={option}
                    className={`searchable-select-option ${
                      option === value ? 'selected' : ''
                    } ${index === highlightedIndex ? 'highlighted' : ''}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={option === value}
                  >
                    {displayText}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
      {required && !value && (
        <input
          type="text"
          tabIndex={-1}
          required
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
          value=""
          onChange={() => {}}
        />
      )}
    </div>
  );
}

