import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useAlert } from '../context/AlertContext';

interface MultiSelectComboboxProps {
  items: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  maxItems?: number;
  allowCreate?: boolean;
}

export default function MultiSelectCombobox({ items, value, onChange, placeholder, label, disabled, maxItems, allowCreate = false }: MultiSelectComboboxProps) {
  const [query, setQuery] = useState('');
  const { showAlert } = useAlert();

  // Filter items based on query and exclude already selected items from the main list
  const filteredItems = query === ''
    ? items.filter(item => !value.includes(item))
    : items.filter(item => !value.includes(item) && item.toLowerCase().includes(query.toLowerCase()));

  // Correctly handle the array of selected items from Headless UI
  const handleHeadlessSelect = (selectedItems: string[]) => {
    // Check if adding more items would exceed the limit
    if (maxItems !== undefined && selectedItems.length > maxItems) {
      showAlert(`Maximum ${maxItems} labels allowed.`, 'warning');
      return;
    }
    onChange(selectedItems);
    setQuery(''); // Clear query after selection
  };

  return (
    <Combobox value={value} onChange={handleHeadlessSelect} multiple disabled={disabled}>
      {label && <Combobox.Label className="block text-sm font-medium mb-1 text-text-primary">{label}</Combobox.Label>}
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded text-left shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 flex flex-wrap items-center py-1 px-2 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          {value.map((item) => (
            <span
              key={item}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center mr-1 mb-1"
            >
              {item}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleHeadlessSelect(value.filter(selectedItem => selectedItem !== item));
                }}
                className="ml-1 text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))}

          <Combobox.Input
            className="flex-grow border-none py-1 pl-1 pr-10 text-sm leading-5 text-text-primary focus:ring-0 focus:outline-none bg-transparent"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={value.length === 0 ? placeholder : ''}
            displayValue={() => query}
            disabled={disabled}
            onKeyDown={(e) => {
              if ((e.key === 'Backspace' || e.key === 'Delete') && query === '' && value.length > 0) {
                e.preventDefault();
                const newValue = value.slice(0, -1);
                onChange(newValue);
              }
            }}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 hover:cursor-pointer top-0 bottom-0 mt-auto mb-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gray-400" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.29a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
            </svg>
          </Combobox.Button>
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-gradient-to-b from-gray-100 to-gray-200 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {query !== '' && allowCreate && !filteredItems.includes(query) && (
              <Combobox.Option
                value={query}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-4',
                    active ? 'bg-gray-200 text-gray-800' : 'text-gray-700'
                  )
                }
              >
                Create &quot;{query}&quot;
              </Combobox.Option>
            )}
            {filteredItems.length === 0 ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-default select-none py-2 pl-3 pr-4',
                      active ? 'bg-gray-200 text-gray-800' : 'text-gray-700'
                    )
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <div className="flex items-center">
                      {selected ? (
                        <span
                          className={clsx(
                            'absolute inset-y-0 left-0 flex items-center pl-3',
                            active ? 'text-white' : 'text-gray-300'
                          )}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.154.114l-3.5-3.5a.75.75 0 011.06-1.06l2.872 2.872 7.462-9.78a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-transparent"> </span>
                      )}
                      <span
                        className={clsx(
                          'block truncate',
                          value.includes(item) ? 'font-medium' : 'font-normal'
                        )}
                      >
                        {item}
                      </span>
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
} 