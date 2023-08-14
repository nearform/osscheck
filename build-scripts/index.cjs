const { promises:fs } = require('fs');
const queryGitHub = require('./github.cjs')
const querySecurityScorecard = require('./security-scorecard.cjs')

const base = "./build-scripts/data"; // TODO get this path from vite

(async () => {

  // main doc, used for searches & pagination
  const index = []

  for await (const gitHubItem of queryGitHub({ org: 'nearform', itemsPerPage: 10 })) {
    const scorecard = await querySecurityScorecard({ platform: 'github.com', org: 'nearform', repo: gitHubItem.name })

    index.push({
      id: gitHubItem.id,
      name: gitHubItem.name,
      rating: scorecard.score,
      createdAt: gitHubItem.createdAt,
      updatedAt: gitHubItem.updatedAt
    })

    await Promise.all([
      saveJson(`${base}/${gitHubItem.id}.excerpt.json`, {
        ...gitHubItem,// TODO cleanup schema
        ...scorecard
      }),
      saveJson(`${base}/${gitHubItem.id}.details.json`, {
        ...gitHubItem,// TODO cleanup schema
        ...scorecard
      }),
    ])
  }

  saveJson(`${base}/index.json`, index)
})()

async function saveJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data), 'utf8');
}
