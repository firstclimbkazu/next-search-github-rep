// src/app/api/repositories/[owner]/[repo]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { GitHubRepo } from '@/src/app/types/GitHubRepo'; // GitHubリポジトリの型定義をインポート
import type { RepoDetailPageProps } from '@/src/app/[owner]/[repo]/page'; // ページコンポーネントのProps型をインポート

// GitHub APIのベースURL
const GITHUB_API_BASE_URL = process.env.NEXT_PUBLIC_GITHUB_API_URL || 'https://api.github.com';

export async function GET(
  request: NextRequest,
  { params }: RepoDetailPageProps,
) {
    console.log(await params);
    const { owner, repo } = await params;
  if (!params || !owner || !repo) {
    return NextResponse.json(
      { message: 'オーナー名 (owner) とリポジトリ名 (repo) が必要です。' },
      { status: 400 }
    );
  }

  try {
    // GitHub APIへのリクエスト
    // q: 検索クエリ, sort: star数でソート, order: 降順, per_page: 取得件数 (最大100)
    const githubApiResponse = await fetch(
      `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}`,
      {
        headers: {
          // 認証ヘッダー (推奨: GitHub PATを使用)
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json', // APIバージョン指定
        },
        // Next.jsのキャッシュ設定 (必要に応じて調整)
        // revalidate: 60, // ISR (Incremental Static Regeneration) のような挙動
        // cache: 'no-store', // キャッシュしない場合
      }
    );

    if (!githubApiResponse.ok) {
      // GitHub APIからのエラーレスポンスを処理
      const errorData = await githubApiResponse.json();
      console.error('GitHub APIエラー:', githubApiResponse.status, errorData);

      // 特にレートリミット超過エラー (403) の場合は、メッセージを分かりやすくする
      if (githubApiResponse.status === 403 && errorData.message.includes('API rate limit exceeded')) {
        return NextResponse.json(
          { message: 'GitHub APIのレートリミットを超過しました。しばらく待ってから再試行してください。' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { message: 'GitHub APIからの取得に失敗しました。', details: errorData },
        { status: githubApiResponse.status }
      );
    }

    const data = await githubApiResponse.json();
    const repoDetails = {
      id: data.id,
      name: data.name,
      full_name: data.full_name,
      language: data.language, // 対応しているプログラム言語
      owner: {
        login: data.owner.login,
        avatar_url: data.owner.avatar_url, // リポジトリのアイコン画像URL (ownerのアバター)
      },
      stargazers_count: data.stargazers_count, // star数
      watchers_count: data.watchers_count, // watcher数
      forks_count: data.forks_count, // Fork数
      open_issues_count: data.open_issues_count, // issue数 (オープンなIssueの数)
      description: data.description,
      html_url: data.html_url, // リポジトリへのURL
    };

    // クライアントに整形されたデータを返す
    return NextResponse.json({ repoDetails });
  } catch (error) {
    console.error('API処理エラー:', error);
    return NextResponse.json(
      { message: 'サーバー内部エラーが発生しました。' },
      { status: 500 }
    );
  }
}
