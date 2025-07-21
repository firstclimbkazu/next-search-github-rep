# GitHub リポジトリ検索アプリ

https://github.com/user-attachments/assets/7ca7e2c8-4a22-47fd-bed6-550eb2ce338d

## 概要 (Overview)

GitHub APIを利用して、キーワードに一致するリポジトリを検索・表示するWebアプリケーションです。Next.js 14のApp RouterやVitestによるテストなど、モダンな技術スタックを用いて開発しました。


## 主な機能 (Features)

-   **リポジトリ検索**: キーワード入力によるリアルタイムなリポジトリ検索機能
-   **無限スクロール**: スクロールに応じて検索結果を動的に追加読み込み
-   **詳細ページ**: 各リポジトリの詳細情報ページへのリンク

## 使用技術 (Tech Stack)

<p>
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vitest-1-blue?logo=vitest" alt="Vitest">
</p>

-   **フロントエンド**: Next.js 15 (App Router), React 18, TypeScript
-   **スタイリング**: Tailwind CSS
-   **テスト**: Vitest
-   **API**: GitHub REST API

## こだわった点・工夫した点 (Highlights)

このプロジェクトでは、以下の点に注力して開発を行いました。

### 1. モダンなフロントエンド開発の実践

-   **Next.js App Router**: 最新のApp Routerを採用し、サーバーコンポーネントとクライアントコンポーネントを適切に使い分けることで、パフォーマンスと開発体験の向上を目指しました。
-   **状態管理**: `useState`や`useCallback`といったReactの標準フックを効果的に利用し、シンプルかつ宣言的な状態管理を実現しました。

### 2. ユーザー体験 (UX) の向上

-   **無限スクロール**: `Intersection Observer API` を利用して、ユーザーがページの最下部に到達した際に次のページのデータを自動で読み込む無限スクロールを実装しました。これにより、ページネーションボタンをクリックする手間を省き、シームレスなブラウジング体験を提供します。
-   **エラーハンドリング**: GitHub APIのレートリミットやネットワークエラーを考慮し、ユーザーに分かりやすいエラーメッセージを表示するように実装しました。

## 環境構築 (Getting Started)

1.  **リポジトリをクローン**
    ```bash
    git clone https://github.com/your-username/next-search-github-rep.git
    cd next-search-github-rep
    ```

2.  **依存関係をインストール**
    ```bash
    npm install
    ```

3.  **環境変数の設定**
    `example.env.local` ファイルをコピーして `.env.local` を作成し、GitHubのPersonal Access Tokenを設定してください。
    ```bash
    cp example.env.local .env.local
    ```
    ```.env.local
    GITHUB_API_TOKEN=#Githubより取得したトークンを設定
    ```

4.  **開発サーバーを起動**
    dockerコンテナ起動にて`npm run dev`を起動します。
    ```bash
    docker compose up --build -d(ビルド済み時: docker compose up -d)
    ```
    http://localhost:3000 にアクセスしてください。  
  

5. AI使用のレポート

    今回は`Gemini`にて調査を行い、コードアシストをVisualStudioCodeの
    `Gemini Code Assist`を用いました。  
    環境構築、コード実装はGeminiのサンプルコードを参考に実装し、
    不備のある箇所をリファクタリングする形をとっております。
    リファクタリングの例としては
    コンポーネントのAI側実装でpage.tsxに全てのコンテンツが集約されていたため、
    コンポーネントの分割を行っていました。

## 今後の展望 (Future Work)

-   [ ] 検索結果のソート機能（スター数、更新日時など）
-   [ ] お気に入り登録機能
-   [ ] E2Eテストの導入 (Playwright / Cypress)
-   [ ] 外部リリース機能

## ライセンス (License)

このプロジェクトはMITライセンスです。

MIT License
