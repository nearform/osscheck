import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type Scorecard = {
  date: string
  score: string
  scorecard: {
    commit: string
    version: string
  }
  repo: {
    name: string
    commit: string
  }
  metadata: any[]
  checks: {
    name: string
    reason: string
    score: string
    details: any[]
    documentation: {
      short: string
      url: string
    }
  }[]
}

type State = {
  loading: boolean
  scorecard: Scorecard[] | null
  current: Scorecard | null
}

export default function RepoRoute() {
  const { repo } = useParams()
  const [state, setState] = useState<State>({
    loading: true,
    scorecard: null,
    current: null
  })

  useEffect(() => {
    fetch(`./data/${repo}/scorecard.json`)
      .then(response => response.json())
      .then(scorecard => {
        const collection = scorecard.reverse() as Scorecard[]
        setState({
          loading: false,
          scorecard: collection,
          current: collection[0]
        })
      })
  }, [repo])

  console.log('state', state)

  if (state.loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (!state.current) {
    return null
  }

  const organization = state.current.repo.name
    .split('github.com/')[1]
    .split('/')[0]

  const scoreInt = parseInt(state.current.score)
  let scoreClass = 'text-green-400 bg-green-400/10 ring-green-400/30'
  if (scoreInt < 8 && scoreInt >= 5) {
    scoreClass = 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/30'
  }
  if (scoreInt < 5) {
    scoreClass = 'text-red-400 bg-red-400/10 ring-red-400/30'
  }

  const versionDate = format(new Date(state.current.date), 'MMM d, yyyy')

  return (
    <>
      <header className="sticky top-12 bg-white shadow">
        <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-x-3">
              <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                <div className="h-2 w-2 rounded-full bg-current"></div>
              </div>
              <h1 className="flex gap-x-3 text-base leading-7">
                {organization ? (
                  <>
                    <span className="font-semibold text-gray-800">
                      {organization}
                    </span>
                    <span className="text-gray-600">/</span>
                  </>
                ) : null}
                <span className="font-semibold text-gray-800">{repo}</span>
              </h1>
            </div>
            <p className="mt-2 text-xs leading-6 text-gray-400">
              {versionDate}
            </p>
            <p className="mt-2 text-xs leading-6 text-gray-400">
              Commit: {state.current.repo.commit}
            </p>
          </div>
          <div
            className={`order-first flex-none rounded-full px-3 py-2 text-sm font-medium ring-1 ring-inset sm:order-none ${scoreClass}`}
          >
            {state.current.score}
          </div>
        </div>
      </header>

      <ul
        role="list"
        className="divide-y divide-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8"
      >
        {state.current.checks.map(check => {
          const checkScore = parseInt(check.score)
          let checkScoreClass = 'text-green-400 bg-green-400/10 ring-green-400/30'
          if (checkScore < 8 && checkScore >= 5) {
            checkScoreClass = 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/30'
          }
          if (checkScore < 5) {
            checkScoreClass = 'text-red-400 bg-red-400/10 ring-red-400/30'
          }
          return (
            <li
              key={check.name}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
            >
              <div>
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {check.name}
                </p>
                <p className='text-xs leading-5 text-gray-500'>{check.documentation.short}</p>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p>{check.reason}</p>
                  {/* <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg> */}
                </div>
              </div>
              <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
                <div className="flex -space-x-0.5">
                  <dt className="sr-only">Score</dt>
                  <div
                    className={`order-first flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset sm:order-none ${checkScoreClass}`}
                  >
                    {check.score}
                  </div>
                </div>
              </dl>
            </li>
          )
        })}
      </ul>
    </>
  )
}
