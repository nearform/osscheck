interface QueryApiSecurityArgs {
  platform: string;
  org: string;
  repo: string;
}

interface ReqResponse {
  checks: {
    details: string[];
    documentation: {
      short: string;
      url: string;
    },
    name: string;
    reason: string;
    score: number;
  }[];
  date: string;
  metadata: string;
  repo: {
    commit: string;
    name: string;
  };
  score: number;
  scorecard: {
    commit: string;
    version: string;
  }
}

export default async function queryApiSecurity({ platform, org, repo }: QueryApiSecurityArgs) {
  return fetch(
    `https://api.securityscorecards.dev/projects/${platform}/${org}/${repo}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(async response => response.status === 200 ?
      (({ checks, score }: ReqResponse) => ({ checks, score }))(await response.json()) :
      {
        checks: [],
        score: null
      }
    )
}