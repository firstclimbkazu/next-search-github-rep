export default function NameText({ name }: { name: string }) {
  return (
    <div className="flex-grow">
      <p className="text-lg font-medium text-gray-800">{name}</p>
    </div>
  );
}
