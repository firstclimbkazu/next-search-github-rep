import { GitHubRepo } from '@/app/types/GitHubRepo';
import OwnerIcon from '../ui/OwnerIcon';
import NameText from '../ui/NameText';
import Loading from '../ui/Loading';
import { useRouter } from 'next/navigation'; // useRouterをインポート
import { RefAttributes, Ref } from 'react';
import HTMLDivElement from 'react';

type RepositoryListProps = {
  repositories: GitHubRepo[];
  loading?: boolean;
  lastRepoElementRef: (node: HTMLDivElement) => void;
};

export default function RepositoryList({
  repositories,
  loading = false,
  lastRepoElementRef,
}: RepositoryListProps) {
  const router = useRouter(); // useRouterフックを使用
  
  return (
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
              }}
              ref={index === repositories.length - 1 ? lastRepoElementRef : null} // 最後の要素にrefをセット
        >
          {/* Owner Icon */}
          <OwnerIcon owner={repo.owner.login} src={repo.owner.avatar_url} />
          {/* リポジトリ名と情報 */}
          <NameText name={repo.name} />
        </div>
      ))}
      {/* ローディング表示 */}
      <Loading loading={loading} />
    </div>
  );
}
