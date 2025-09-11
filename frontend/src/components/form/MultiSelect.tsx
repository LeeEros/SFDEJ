import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, EyeIcon, InfoIcon } from '../../icons';

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
};

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
    setSearchTerm(''); // Limpa a busca ao selecionar
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

  return (
    <div className="relative" ref={ref}>
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <div
        className="min-h-[42px] flex flex-wrap items-center gap-2 p-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 cursor-pointer relative" // Adicionado `relative` e `pr-10`
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <span
              key={option.value}
              className="flex items-center gap-2 px-2 py-1 bg-primary text-white rounded-full text-sm"
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
                className="text-white hover:text-gray-200"
              >
                &times;
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400">Selecione...</span>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <InfoIcon className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedValues.includes(option.value) ? 'bg-primary text-white' : 'text-gray-900 dark:text-white'
                    }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 dark:text-gray-400">Nenhum resultado encontrado.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;