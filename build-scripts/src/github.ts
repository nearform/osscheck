import { App, Octokit } from 'octokit'

interface GqlResponse {
  organization: {
    repositories: {
      edges: {
        cursor: string
        node: GqlResponseNode
      }[]
    }
  }
  errors?: {
    message: string
  }[]
}

interface GqlResponseNode {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  forkCount: number
  hasIssuesEnabled: boolean
  homepageUrl: string
  openGraphImageUrl: string
  issues: {
    totalCount: number
  }
  licenseInfo: {
    key: string
    name: string
  }
}

interface QueryGitHubArgs {
  itemsPerPage: number
  org: string
}

interface GitHubClientArgs {
  gh_priv_key: string
  gh_app_id: string
  gh_app_install_id: number
}

export default async function* queryGitHub(
  args: QueryGitHubArgs & GitHubClientArgs
): AsyncGenerator<GqlResponseNode> {
  // fetch first page
  let data = await fetchData(args)

  while (data.length) {
    for (const item of data) {
      yield item.node
    }
    // fetch next page
    data = await fetchData({ ...args, cursor: data[data.length - 1].cursor })
  }
}

type GitHubClient = {
  (args: GitHubClientArgs): Promise<Octokit>
  octokit?: Octokit
}

const gitHubClient: GitHubClient = async (args): Promise<Octokit> => {
  if (gitHubClient.octokit) {
    return gitHubClient.octokit
  }

  const app = new App({
    appId: args.gh_app_id,
    privateKey: args.gh_priv_key
  })

  gitHubClient.octokit = await app.getInstallationOctokit(
    args.gh_app_install_id
  )

  return gitHubClient.octokit
}

const fetchData = async (
  args: QueryGitHubArgs & GitHubClientArgs & { cursor?: string }
): Promise<GqlResponse['organization']['repositories']['edges']> => {
  const client = await gitHubClient(args)
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
              openGraphImageUrl
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
      org: args.org,
      itemsPerPage: args.itemsPerPage,
      cursor: args.cursor
    }
  )

  if (res.errors) {
    console.error(res.errors.map(err => err.message))
    throw Error('Unable to fetch data from GitHub GQL API')
  }

  return res.organization.repositories.edges
}
