import Image from 'next/image'; // Next.jsのImageコンポーネント

type IconImageProps = { src: string; alt: string }
export default function IconImage({ src, alt }: IconImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes="64px" // 画像のサイズを指定
      fill={true} // 親要素のサイズに合わせて埋める
      style={{ objectFit: 'cover' }} // 画像の表示方法
      className="rounded-full" // Imageコンポーネント内でも角丸を適用
    />
  );
}
