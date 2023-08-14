module.exports = async function queryApiSecurity({ platform, org, repo }) {
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
      (({ checks, score }) => ({ checks, score }))(await response.json()) :
      {
        checks: [],
        score: null
      }
    )
}