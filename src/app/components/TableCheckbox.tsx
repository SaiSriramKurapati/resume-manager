import { Checkbox } from '@headlessui/react';
import { ComponentProps } from 'react';

interface TableCheckboxProps extends Omit<ComponentProps<typeof Checkbox>, 'checked' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function TableCheckbox({ checked, onChange, ...props }: TableCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      className={({ checked }: { checked: boolean }) =>
        `h-5 w-5 rounded border-2 flex items-center justify-center transition-colors
        ${checked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`
      }
      {...props}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </Checkbox>
  );
} 