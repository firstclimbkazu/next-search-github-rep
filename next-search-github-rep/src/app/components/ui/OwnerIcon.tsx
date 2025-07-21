type OwnerIconProps = {
  owner: string;
  src: string;
};

export default function OwnerIcon({ src, owner }: OwnerIconProps) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-4 overflow-hidden">
      <img src={src} alt={owner} className="w-full h-full object-cover" />
    </div>
  );
}
