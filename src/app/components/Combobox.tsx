import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import clsx from 'clsx';

interface ComboboxProps {
  items: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  allowCreate?: boolean;
}

export default function CustomCombobox({ 
  items, 
  value, 
  onChange, 
  placeholder, 
  label, 
  disabled,
  allowCreate = true
}: ComboboxProps) {
  const [query, setQuery] = useState('');

  const filteredItems = query === ''
    ? items
    : items.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Combobox value={value} onChange={onChange}>
      {label && <Combobox.Label className="block text-sm font-medium mb-1 text-text-primary">{label}</Combobox.Label>}
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded text-left shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <Combobox.Input
            className="w-full rounded backdrop-blur-sm border border-gray-200/50 shadow-sm py-2 pl-3 pr-10 text-sm leading-5 text-text-primary focus:ring-0 focus:outline-none"
            displayValue={(item: string | null) => item || ''}
            onChange={(event) => {
                setQuery(event.target.value);
                // Optional: clear selected value when typing begins
                // onChange(null);
            }}
            placeholder={placeholder}
            disabled={disabled}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 hover:cursor-pointer">
            {/* Chevron icon */}
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
           // Do not clear query after leave to allow 'Create New' to persist
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gradient-to-b from-gray-100 to-gray-200 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredItems.length === 0 && query !== '' && !allowCreate ? (
                <div className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-700">
                    Not Found
                </div>
            ) : (
                filteredItems.map((item) => (
                    <Combobox.Option
                        key={item || 'null'}
                        className={({ active }) =>
                            clsx(
                                'relative cursor-default select-none py-2 pl-10 pr-4',
                                active ? 'bg-gray-200 text-gray-800' : 'text-gray-700'
                            )
                        }
                        value={item}
                    >
                        {({ selected, active }) => (
                            <>
                                <span
                                    className={clsx(
                                        'block truncate',
                                        selected ? 'font-medium' : 'font-normal'
                                    )}
                                >
                                    {item === null ? "Select an option" : item}
                                </span>
                                {selected ? (
                                    <span
                                        className={clsx(
                                            'absolute inset-y-0 left-0 flex items-center pl-3',
                                            active ? 'text-gray-800' : 'text-blue-600'
                                        )}
                                    >
                                        {/* Checkmark icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.154.114l-3.5-3.5a.75.75 0 011.06-1.06l2.872 2.872 7.462-9.78a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                ) : null}
                            </>
                        )}
                    </Combobox.Option>
                ))
            )}
             {/* Allow creating new category if query doesn't match existing and query is not empty */}
            {allowCreate && query !== '' && !items.some(item => item.toLowerCase() === query.toLowerCase()) && (
                 <Combobox.Option
                    value={query}
                    className={({ active }) =>
                       clsx(
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                         active ? 'bg-gray-200 text-gray-800' : 'text-gray-700'
                       )
                    }
                 >
                     {({ active }) => (
                        <span
                            className={clsx('block truncate', active ? 'font-medium' : 'font-normal')}
                        >
                            Create "{query}"
                        </span>
                     )}
                 </Combobox.Option>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
} 