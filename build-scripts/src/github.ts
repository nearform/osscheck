import { App, Octokit } from 'octokit'

const GH_PRIV_KEY = process.env.GH_PRIV_KEY
const GH_APP_ID = process.env.GH_APP_ID
const GH_APP_INSTALL_ID = process.env.GH_APP_INSTALL_ID

interface GqlResponse { 
  organization: {
    repositories: {
      edges: {
        cursor: string;
        node: {
          id: string;
          name: string;
          description: string;
          createdAt: string;
          updatedAt: string;
          forkCount: number;
          hasIssuesEnabled: boolean;
          homepageUrl: string;
          issues: {
            totalCount: number;
          };
          licenseInfo: {
            key: string;
            name: string;
          };
        };
      }[]
    }
  }
}
interface QueryGitHubArgs {
  itemsPerPage: number;
  org: string;
}

export default async function* queryGitHub({ itemsPerPage, org }: QueryGitHubArgs) {
  // fetch first page
  let data = await fetchData({ org, itemsPerPage })

  while (data.length) {
    for (const item of data) {
      yield item.node;
    }
    // fetch next page
    data = await fetchData({ org, itemsPerPage, cursor: data[data.length - 1].cursor })
  }
}

type GitHubClient = {
  (): Promise<Octokit>;
  octokit?: Octokit;
}
const gitHubClient: GitHubClient = async () => {
  if (!GH_PRIV_KEY) throw Error('Missing env var GH_PRIV_KEY')
  if (!GH_APP_ID) throw Error('Missing env var GH_APP_ID')
  if (!GH_APP_INSTALL_ID) throw Error('Missing env var GH_APP_INSTALL_ID')

  const instalationId = parseInt(GH_APP_INSTALL_ID, 10);
  if (!instalationId) {
    throw Error('Invalid env var GH_APP_INSTALL_ID. Must be a valid Int.')
  }

  if (gitHubClient.octokit) {
    return gitHubClient.octokit
  }

  const app = new App({
    appId: GH_APP_ID,
    privateKey: GH_PRIV_KEY,
  });

  gitHubClient.octokit = await app.getInstallationOctokit(instalationId)

  return gitHubClient.octokit 
}

const fetchData = async ({ org, itemsPerPage, cursor }: QueryGitHubArgs & { cursor?: string }) => {
  const client = await gitHubClient()
  const res = await client.graphql<GqlResponse>(
    `query GetRepoData($org: String!, $itemsPerPage: Int!, $cursor: String ) {
      organization(login: $org) {
        repositories(
          first: $itemsPerPage
          affiliations: OWNER
          isArchived: false
          privacy: PUBLIC
          after: $cursor
        ) {
          edges {
            cursor
            node {
              id
              name
              description
              createdAt
              updatedAt
              forkCount
              hasIssuesEnabled
              homepageUrl
              issues(filterBy: {states: OPEN}) {
                totalCount
              }
              licenseInfo {
                key
                name
              }
            }
          }
        }
      }
    }`,
    {
      org,
      itemsPerPage,
      cursor
    }
  )

  return res.organization?.repositories?.edges || []
}