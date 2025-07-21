// src/app/api/repositories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { GitHubRepo } from '@/src/app/types/GitHubRepo'; // GitHubリポジトリの型定義をインポート

// GitHub APIのベースURL
const GITHUB_API_BASE_URL = process.env.NEXT_PUBLIC_GITHUB_API_URL || 'https://api.github.com';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q'); // 検索文字列のパラメータ 'q' を取得
  const page = searchParams.get('page'); // ページ番号のパラメータ 'page' を取得
  if (!query) {
    return NextResponse.json(
      { message: '検索クエリ (q) が必要です。' },
      { status: 400 }
    );
  }

  try {
    // GitHub APIへのリクエスト
    // q: 検索クエリ, sort: star数でソート, order: 降順, per_page: 取得件数 (最大100), page: ページ番号
    const githubApiResponse = await fetch(
      `${GITHUB_API_BASE_URL}/search/repositories?q=${query}&sort=stars&order=desc&per_page=10&page=${page}`,
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

    // console.log('API-headers:', githubApiResponse.headers);
    const data = await githubApiResponse.json();
    console.log('APIレスポンス:', data.total_count);
    const repositories = (data.items as GitHubRepo[]).map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      language: repo.language, // 対応しているプログラム言語
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url, // リポジトリのアイコン画像URL (ownerのアバター)
      },
      stargazers_count: repo.stargazers_count, // star数
      watchers_count: repo.watchers_count, // watcher数
      forks_count: repo.forks_count, // Fork数
      open_issues_count: repo.open_issues_count, // issue数 (オープンなIssueの数)
      description: repo.description,
      html_url: repo.html_url, // リポジトリへのURL
    }));

    // クライアントに整形されたデータを返す
    return NextResponse.json({ total_count: data.total_count, repositories });
  } catch (error) {
    console.error('API処理エラー:', error);
    return NextResponse.json(
      { message: 'サーバー内部エラーが発生しました。' },
      { status: 500 }
    );
  }
}
