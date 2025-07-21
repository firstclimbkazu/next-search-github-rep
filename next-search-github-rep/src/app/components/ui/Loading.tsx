export default function Loading ({loading}: {loading: boolean}) {
  return (
    <>
      {loading && <p className="text-center">読み込み中...</p>}
    </>
  );
}