import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/app/api/repositories/[owner]/[repo]/route';
import { NextRequest } from 'next/server';

// fetchのグローバルモック
global.fetch = vi.fn();

describe('API Route: /api/repositories/[owner]/[repo]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常にリポジトリ詳細を取得し、結果を返すこと', async () => {
    const mockRepoDetails = {
      id: 1,
      name: 'test-repo',
      full_name: 'test-owner/test-repo',
      owner: { login: 'test-owner' },
    };
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepoDetails),
    });

    const request = new NextRequest('http://localhost/api/repositories/test-owner/test-repo');
    const context = { params: { owner: 'test-owner', repo: 'test-repo' } };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.repoDetails.name).toBe('test-repo');

    // GitHub APIが正しいURLで呼び出されたか確認
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo',
      expect.any(Object)
    );
  });

  it('リポジトリが見つからない場合、GitHub APIからの404エラーを返すこと', async () => {
    (fetch as Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not Found' }),
    });

    const request = new NextRequest('http://localhost/api/repositories/unknown/unknown');
    const context = { params: { owner: 'unknown', repo: 'unknown' } };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('GitHub APIからの取得に失敗しました。');
  });

  it('fetchでネットワークエラーが発生した場合、500エラーを返すこと', async () => {
    (fetch as Mock).mockRejectedValue(new Error('Network error'));

    const request = new NextRequest('http://localhost/api/repositories/test-owner/test-repo');
    const context = { params: { owner: 'test-owner', repo: 'test-repo' } };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('サーバー内部エラーが発生しました。');
  });
});

