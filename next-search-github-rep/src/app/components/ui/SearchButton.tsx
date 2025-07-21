type SearchButtonProps = {
  buttonText?: string;
  disabled?: boolean;
  onClick: () => void;
};

export default function SearchButton({
  buttonText,
  disabled,
  onClick,
}: SearchButtonProps) {
  return (
    <button
      className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md
                hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText || '検索'}
    </button>
  );
}
