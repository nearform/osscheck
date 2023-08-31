import { z } from 'zod'

interface QueryApiSecurityArgs {
  platform: string
  org: string
  repo: string
}

const reqResponseSchema = z.object({
  checks: z.nullable(
    z.array(
      z.object({
        details: z.nullable(z.array(z.string())),
        documentation: z.object({
          short: z.string(),
          url: z.string()
        }),
        name: z.string(),
        reason: z.string(),
        score: z.number()
      })
    )
  ),
  score: z.nullable(z.number())
})

type ReqResponse = z.infer<typeof reqResponseSchema>

export default async function queryApiSecurity({
  platform,
  org,
  repo
}: QueryApiSecurityArgs): Promise<{
  checks: ReqResponse['checks']
  score: number | null
}> {
  return fetch(
    `https://api.securityscorecards.dev/projects/${platform}/${org}/${repo}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
    .then(response =>
      response.status === 200 ? response.json() : { checks: [], score: null }
    )
    .then(data => reqResponseSchema.parse(data))
    .then(({ checks, score }) => ({ checks, score }))
}
