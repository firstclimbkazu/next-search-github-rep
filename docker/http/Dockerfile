# Dockerfile

# Stage 1: ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# package.jsonとyarn.lock/package-lock.jsonをコピー
COPY package.json yarn.lock* package-lock.json* ./

# 依存関係をインストール
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm install --frozen-lockfile; fi

# プロジェクトのソースコードをコピー
COPY . .

# Next.jsアプリケーションをビルド
# next.config.mjs で output: 'standalone' を設定している場合、以下のコマンドは不要です。
# output: 'standalone' にすると自動的に依存関係がバンドルされます。
# NEXT_PUBLIC_XXX のような環境変数はここで設定しても良いですが、
# ランタイムで渡すのが一般的です。
RUN npm run build

# Stage 2: 実行ステージ
FROM node:20-alpine AS runner

WORKDIR /app

# Next.jsのStandaloneモードでビルドされた場合に最適
# .next/standalone ディレクトリが生成されます。
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# 環境変数 (本番環境ではDocker Composeなどで設定することが多い)
# ENV NODE_ENV production
# Next.jsのデフォルトポート
EXPOSE 3000

# Next.jsアプリケーションを起動
CMD ["node", "server.js"]