import { GitHubRepo } from "@/app/types/GitHubRepo";
import IconImage from "../ui/IconImage";

export default function RepositoryDetail({ repoDetails }: { repoDetails: GitHubRepo }) {
  return (
     // 全体を囲むコンテナ (最大幅、中央寄せ、背景、影など)
        <div className="max-w-xl mx-auto bg-white p-6 my-8">
          {/* リポジトリ名とオーナーアイコン、言語 */}
          <div className="flex items-start mb-8"> {/* items-startで上揃え */}
            {/* Owner Icon (Imageコンポーネントを使用) */}
            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 mr-4 overflow-hidden relative">
              {repoDetails.owner.avatar_url ?
              <IconImage 
                alt={`${repoDetails.owner.login}'s avatar`}
                src={repoDetails.owner.avatar_url} /> :
              (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-600">
                  NO IMAGE
                </div>
              )}
            </div>
    
            {/* リポジトリ名と言語 */}
            <div className="flex-grow pt-2">
              <p className="text-xl font-bold text-gray-800 break-words">{repoDetails.name}</p> {/* break-wordsで長い単語を改行 */}
              <p className="text-sm text-gray-600">言語: {repoDetails.language || 'N/A'}</p>
            </div>
          </div>
    
          {/* Star数、Watcher数、Fork数、Issue数 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
            {/* Star数 */}
            <div className="p-3 text-center">
              <p className="text-sm font-medium">Star数</p>
              <p className="text-xl font-bold">{repoDetails.stargazers_count.toLocaleString()}</p>
            </div>
            {/* Watcher数 */}
            <div className="p-3 text-center">
              <p className="text-sm font-medium">Watcher数</p>
              <p className="text-xl font-bold">{repoDetails.watchers_count.toLocaleString()}</p>
            </div>
            {/* Fork数 */}
            <div className="p-3 text-center">
              <p className="text-sm font-medium">Fork数</p>
              <p className="text-xl font-bold">{repoDetails.forks_count.toLocaleString()}</p>
            </div>
            {/* Issue数 */}
            <div className="p-3 text-center">
              <p className="text-sm font-medium">Issue数</p>
              <p className="text-xl font-bold">{repoDetails.open_issues_count.toLocaleString()}</p>
            </div>
          </div>
        </div>
  );
}
