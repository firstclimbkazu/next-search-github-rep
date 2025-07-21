

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GitHub リポジトリ検索アプリ',
  description: 'GitHubのリポジトリを検索して詳細情報を表示するアプリケーション',
  openGraph: {
    title: 'GitHub リポジトリ検索アプリ',
    description: 'GitHubのリポジトリを検索して詳細情報を表示するアプリケーション',
    url: 'https://github.com/machidakazutoshi/next-search-github-rep',
    siteName: 'GitHub リポジトリ検索アプリ',
    images: [
      {
        url: 'https://avatars.githubusercontent.com/u/12345678?v=4', // ここは実際の画像URLに置き換えてください
        width: 1200,
        height: 630,
        alt: 'GitHub リポジトリ検索アプリのサムネイル',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-white`}>
        {/* アプリケーション全体のヘッダー */}
        <Header />
        {/* 各ページコンテンツがここにレンダリングされる */}
        <main className="container mx-auto flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
