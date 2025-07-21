'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // useRouterをインポート

const title = 'GitHub リポジトリ検索アプリ';
export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  return (
    <header className="bg-white text-black p-4 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {isHomePage ? (
          <h1 className="text-2xl font-bold">{title}</h1>
        ) : (
          <Link href="/" className="hover:underline mb-6 inline-block">
            <h1 className="text-2xl font-bold">{title}</h1>
          </Link>
        )}
      </div>
    </header>
  );
}