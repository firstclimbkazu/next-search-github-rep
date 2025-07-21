import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/app/api/repositories/route';
import { NextRequest } from 'next/server';

// fetchのグローバルモック
global.fetch = vi.fn();

describe('API Route: /api/repositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('検索クエリ(q)がない場合、400エラーを返すこと', async () => {
    const request = new NextRequest('http://localhost/api/repositories');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('検索クエリ (q) が必要です。');
  });

  it('正常にリポジトリを検索し、結果を返すこと', async () => {
    const mockApiResponse = {
      total_count: 1,
      items: [{ id: 1, name: 'test-repo', owner: { login: 'test' } }],
    };
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const request = new NextRequest('http://localhost/api/repositories?q=test&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total_count).toBe(1);
    expect(data.repositories).toHaveLength(1);
    expect(data.repositories[0].name).toBe('test-repo');

    // GitHub APIが正しいURLで呼び出されたか確認
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/search/repositories?q=test&sort=stars&order=desc&per_page=10&page=1',
      expect.any(Object)
    );
  });

  it('GitHub APIがエラーを返した場合、そのエラーステータスとメッセージを返すこと', async () => {
    (fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Internal Server Error' }),
    });

    const request = new NextRequest('http://localhost/api/repositories?q=test&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('GitHub APIからの取得に失敗しました。');
  });

  it('fetchでネットワークエラーが発生した場合、500エラーを返すこと', async () => {
    (fetch as Mock).mockRejectedValue(new Error('Network error'));

    const request = new NextRequest('http://localhost/api/repositories?q=test&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('サーバー内部エラーが発生しました。');
  });
});