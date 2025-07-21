import { InputHTMLAttributes, ChangeEventHandler } from 'react';

type SearchTextProps = {
  searchTerm: string;
  placeholder?: string;
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
};

export default function SearchText({ searchTerm, onChange, placeholder }: SearchTextProps) {
  return (
    <input
      type="text"
      placeholder={placeholder ?? ''}
      className="flex-grow p-2 border border-gray-300 rounded-md text-gray-700
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                placeholder-gray-400"
      value={searchTerm}
      onChange={onChange}
    />
  );
}
