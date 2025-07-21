    // 必要な情報のみを抽出し、整形
    export interface GitHubRepo {
      id: number;
      name: string;
      full_name: string;
      language: string | null;
      owner: {
        login: string;
        avatar_url: string;
      };
      stargazers_count: number;
      watchers_count: number;
      forks_count: number;
      open_issues_count: number;
      description: string | null;
      html_url: string;
    };
