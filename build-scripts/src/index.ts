#!/usr/bin/env node
import fs, { promises as fsp } from 'fs';
import { program } from 'commander';
import queryGitHub from './github';
import querySecurityScorecard from './security-scorecard';

program
  .version('1.0.0', '-v, --version')
  .requiredOption('-p, --path <string>', 'The path where the files should be saved.')
  .requiredOption('-o, --org <string>', 'The github organisation.')
  .parse();
const options = program.opts();

if (!fs.existsSync(options.path)){
  fs.mkdirSync(options.path, { recursive: true });
}

(async () => {
  const index = [] // main doc, used for searches & pagination

  for await (const gitHubItem of queryGitHub({ org: options.org, itemsPerPage: 10 })) {
    const scorecard = await querySecurityScorecard({ platform: 'github.com', org: options.org, repo: gitHubItem.name })

    index.push({
      id: gitHubItem.id,
      name: gitHubItem.name,
      rating: scorecard.score,
      createdAt: gitHubItem.createdAt,
      updatedAt: gitHubItem.updatedAt
    })

    await Promise.all([
      saveJson(`${options.path}/${gitHubItem.id}.excerpt.json`, {
        ...gitHubItem,// TODO cleanup schema
        ...scorecard
      }),
      saveJson(`${options.path}/${gitHubItem.id}.details.json`, {
        ...gitHubItem,// TODO cleanup schema
        ...scorecard
      }),
    ])
  }

  saveJson(`${options.path}/index.json`, index)
})()

async function saveJson(filePath: string, data: Record<string, any>) {
  await fsp.writeFile(filePath, JSON.stringify(data), 'utf8');
}
