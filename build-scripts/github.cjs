const { App } = require('octokit')

const GH_PRIV_KEY = process.env.GH_PRIV_KEY
const GH_APP_ID = process.env.GH_APP_ID
const GH_APP_INSTALL_ID = process.env.GH_APP_INSTALL_ID

if(!GH_PRIV_KEY) throw Error('Missing env var GH_PRIV_KEY')
if(!GH_APP_ID) throw Error('Missing env var GH_APP_ID')
if(!GH_APP_INSTALL_ID) throw Error('Missing env var GH_APP_INSTALL_ID')

module.exports = async function* queryGitHub({ itemsPerPage, org }) {
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

async function gitHubClient() {
  if (gitHubClient.octokit) {
    return gitHubClient.octokit
  }

  const app = new App({
    appId: GH_APP_ID,
    privateKey: GH_PRIV_KEY,
  })
  gitHubClient.octokit = await app.getInstallationOctokit(GH_APP_INSTALL_ID)

  return gitHubClient.octokit
}

const fetchData = async ({ org, itemsPerPage, cursor }) => {
  const client = await gitHubClient()
  const res = await client.graphql(
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