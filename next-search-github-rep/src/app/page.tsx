'use client'; // クライアントコンポーネントであることを宣言
import { useState, useEffect, useRef, useCallback } from 'react';
import { GitHubRepo } from './types/GitHubRepo';
import { useRouter } from 'next/navigation'; // useRouterをインポート

export default function Home() {
  const router = useRouter(); // useRouterフックを使用
  const [searchTerm, setSearchTerm] = useState('');
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // ページネーションの現在のページ
  const [hasMore, setHasMore] = useState(true); // 次のページがあるかどうか
  const observer = useRef<IntersectionObserver | null>(null); // Intersection Observerのインスタンスを保持

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('検索キーワードを入力してください。');
      setRepositories([]);
      return;
    }

    setPage(1); // 検索時にページをリセット
    setRepositories([]);
    setHasMore(true);
    searchRepositories(searchTerm, 1);
  };

  const searchRepositories = useCallback(async (term: string, pageNum: number) => {
    if (!term.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/repositories?q=${encodeURIComponent(term)}&page=${pageNum.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'リポジトリの取得に失敗しました。');
        return;
      }

      const data = await response.json();
      setRepositories((prevRepos) => {
        const newRepos = [...prevRepos, ...data.repositories];
        if (newRepos.length >= data.total_count) {
          setHasMore(false); // 全てのリポジトリを取得した場合
        }
        return newRepos;
      });
    } catch (err) {
      console.error('フェッチエラー:', err);
      setError('ネットワークエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  // Intersection Observerをセットアップ
  const lastRepoElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // ページが変わったときにリポジトリを検索
  useEffect(() => {
    if (page > 1) {
      searchRepositories(searchTerm, page);
    }

    return () => {
      setLoading(false);
    }
  }, [page, searchTerm, searchRepositories]);

  return (
    <div className="bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="リポジトリ名を入力してください"
          className="flex-grow p-2 border border-gray-300 rounded-md text-gray-700
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md
                hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          onClick={handleSearch}
        >
          検索
        </button>
      </div>

      {/* リポジトリリスト (検索結果がある場合のみ表示) */}
      {repositories.length > 0 && (
        <div className="space-y-4">
          {repositories.map((repo, index) => (
            <div
              key={repo.id}
              className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200
                         hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => {
                // ここで詳細ページへの遷移ロジックを実装
                // 例: router.push(`/repos/${repo.owner.login}/${repo.name}`);
                router.push(`/${repo.owner.login}/${repo.name}`);
                // alert(`リポジトリ名: ${repo.fullName}\nStar: ${repo.stars}\nLanguage: ${repo.language}`);
              }}
              ref={index === repositories.length - 1 ? lastRepoElementRef : null} // 最後の要素にrefをセット
            >              
              {/* console.log(index === repositories.length - 1) */}
              
              {/* Owner Icon */}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-4 overflow-hidden">
                <img
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* リポジトリ名と情報 */}
              <div className="flex-grow">
                <p className="text-lg font-medium text-gray-800">{repo.name}</p>
              </div>
            </div>
          ))}
          {/* ローディング表示 */}
          {loading && <p className="text-center">読み込み中...</p>}
        </div>
      )}

      {/* 検索結果がない場合のメッセージ */}
      {repositories.length === 0 && !loading && !error && searchTerm.trim() && (
        <p className="text-gray-500 text-center mt-4">該当するリポジトリは見つかりませんでした。</p>
      )}
      {repositories.length === 0 && !loading && !error && !searchTerm.trim() && (
        <p className="text-gray-500 text-center mt-4">検索キーワードを入力してリポジトリを検索してください。</p>
      )}

    </div>
  );
}
