import { test } from 'tap'

test('it returns an async iterator', async t => {
    const fixtures = [
        {
            vars: { org: 'myorg', itemsPerPage: 1, cursor: undefined },
            res: {
                organization: {
                    repositories: {
                        edges: [
                            {
                                cursor: "Y3Vyc29yOnYyOpHOBDT4Cw==",
                                node: {
                                    id: "MDEwOlJlcG9zaXRvcnk3MDU4MDIzNQ==",
                                    name: "slow-rest-api",
                                    description: "A REST API that is slow",
                                    createdAt: "2016-10-11T10:00:28Z",
                                    updatedAt: "2023-01-19T17:18:22Z",
                                    forkCount: 17,
                                    hasIssuesEnabled: true,
                                    homepageUrl: null,
                                    issues: {
                                        totalCount: 0
                                    },
                                    licenseInfo: {
                                        key: "mit",
                                        name: "MIT License"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        {
            vars: { org: 'myorg', itemsPerPage: 1, cursor: 'Y3Vyc29yOnYyOpHOBDT4Cw==' },
            res: {
                "organization": {
                    "repositories": {
                        "edges": []
                    }
                }
            }
        }
    ]
    const { default: queryGitHub } = t.mock('../src/github', {
        octokit: {
            App: class App {
                getInstallationOctokit = () => ({
                    graphql: (_: string, vars: Record<string, any>) => {
                        const fixture = fixtures.shift()
                        t.same(vars, fixture?.vars)
                        return fixture?.res
                    }
                })
            }
        }
    })

    const queryGitHubArgs = {
        org: 'myorg',
        itemsPerPage: 1,
        gh_priv_key: '-----------',
        gh_app_id: '-----------',
        gh_app_install_id: '-----------'
    }
    const result: any = []
    for await (const gitHubItem of queryGitHub(queryGitHubArgs)) {
        result.push(gitHubItem)
    }

    t.same(result, [
        {
            id: "MDEwOlJlcG9zaXRvcnk3MDU4MDIzNQ==",
            name: "slow-rest-api",
            description: "A REST API that is slow",
            createdAt: "2016-10-11T10:00:28Z",
            updatedAt: "2023-01-19T17:18:22Z",
            forkCount: 17,
            hasIssuesEnabled: true,
            homepageUrl: null,
            issues: {
                totalCount: 0,
            },
            licenseInfo: {
                key: "mit",
                name: "MIT License",
            },
        },
    ])
})

test('it throws if the API ever changes', async t => {
    const { default: queryGitHub } = t.mock('../src/github', {
        octokit: {
            App: class App {
                getInstallationOctokit = () => ({
                    graphql: () => ({
                        "errors": [
                            {
                                "path": [
                                    "query GetRepoData",
                                    "organization",
                                    "repositories",
                                    "edges",
                                    "node",
                                    "homepageUrl"
                                ],
                                "extensions": {
                                    "code": "undefinedField",
                                    "typeName": "Repository",
                                    "fieldName": "homepageUrl"
                                },
                                "locations": [
                                    {
                                        "line": 20,
                                        "column": 15
                                    }
                                ],
                                "message": "Field 'homepageUrl' doesn't exist on type 'Repository'"
                            }
                        ]
                    })
                })
            }
        }
    })

    const queryGitHubArgs = {
        org: 'myorg',
        itemsPerPage: 1,
        gh_priv_key: '-----------',
        gh_app_id: '-----------',
        gh_app_install_id: '-----------'
    }
    try {
        await queryGitHub(queryGitHubArgs).next()
        t.fail("Should have thrown an error")
    } catch (err: any) {
        t.equal(err?.message, "Unable to fetch data from GitHub GQL API")
    }
})