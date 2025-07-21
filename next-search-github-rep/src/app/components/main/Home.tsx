'use client'; // クライアントコンポーネントであることを宣言
import { useState, useEffect, useRef, useCallback, use } from 'react';
import { GitHubRepo } from '@/app/types/GitHubRepo'; // GitHubリポジトリの型をインポート
import SearchText from '../ui/SearchText';
import SearchButton from '../ui/SearchButton';
import RepositoryList from './RepositoryList';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
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
    setHasMore(true);
    searchRepositories(searchTerm, 1);
  };

  const searchRepositories = useCallback(async (term: string, pageNum: number) => {
    if (!term.trim()) return;
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const response = await fetch(`/api/repositories?q=${encodeURIComponent(term)}&page=${pageNum.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'リポジトリの取得に失敗しました。');
        return;
      }

      const data = await response.json();
      if (data.total_count === 0) {
        setError('該当するリポジトリは見つかりませんでした。');
        return;
      }
      setRepositories((prevRepos) => {
        // ページ番号が1の場合は新しい検索なので、結果を置き換える
        // それ以外の場合は、既存の結果に新しい結果を追加する（無限スクロール）
        const newRepos =
          pageNum === 1 ? data.repositories : [...prevRepos, ...data.repositories];
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

  useEffect(() => {
    setInfo('検索キーワードを入力してリポジトリを検索してください。');
  }, []);

  return (
    <div className="bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <SearchText
          searchTerm={searchTerm}
          placeholder="リポジトリ名を入力してください"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton
          buttonText="検索"
          disabled={loading}
          onClick={handleSearch}
        />
      </div>

      {/* リポジトリリスト (検索結果がある場合のみ表示) */}
      {repositories.length > 0 && <RepositoryList repositories={repositories} loading={loading} lastRepoElementRef={lastRepoElementRef} />}
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}
      {!error && info && (
        <p className="text-gray-500 text-center mt-4">{info}</p>
      )}
    </div>
  );
}
