import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    // リモート画像のホスト名を許可する設定
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**', // GitHubのアバター画像のパスは /u/ から始まることが多い
      },
    ],
  },
};

export default nextConfig;
