import { test } from 'tap'
import querySecurityScorecard from '../src/security-scorecard';

test('security scorecard', async t => {
  const origFetch = global.fetch
  t.afterEach(() => {
    global.fetch = origFetch
  })

  t.test('it returns empty data for an unreported repo', async t => {
    global.fetch = function (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
      t.equal(input, 'https://api.securityscorecards.dev/projects/github.com/myorg/myrepo');
      t.same(init, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      return Promise.resolve({
        status: 404,
      } as any)
    }
    const res = await querySecurityScorecard({ platform: 'github.com', org: 'myorg', repo: 'myrepo' })
    t.same(res, { checks: [], score: null })
  })

  t.test('it returns non empty data for an reported repo', async t => {
    const fixture = {
      "date": "2023-08-07",
      "repo": {
        "name": "github.com/myorg/myotherrepo",
        "commit": "Zidk0R463oTR8vRwmM7TE67caLETBef4hIZR0prX"
      },
      "scorecard": {
        "version": "v1.2.3-94-g7ed886f1",
        "commit": "Zidk0R463oTR8vRwmM7TE67caLETBef4hIZR0prX"
      },
      "score": 5.2,
      "checks": [
        {
          "name": "Code-Review",
          "score": 8,
          "reason": "found 2 unreviewed changesets out of 18 -- score normalized to 8",
          "details": null,
          "documentation": {
            "short": "Determines if the project requires human code review before pull requests (aka merge requests) are merged.",
            "url": "https://github.com/ossf/scorecard/blob/Zidk0R463oTR8vRwmM7TE67caLETBef4hIZR0prX/docs/checks.md#code-review"
          }
        }
      ]
    }
    global.fetch = function (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
      t.equal(input, 'https://api.securityscorecards.dev/projects/github.com/myorg/myotherrepo');
      t.same(init, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(fixture)
      } as any)
    }
    const res = await querySecurityScorecard({ platform: 'github.com', org: 'myorg', repo: 'myotherrepo' })
    t.same(res, { checks: fixture.checks, score: fixture.score })
  })
})