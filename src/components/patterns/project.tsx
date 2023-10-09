import React from 'react'
import { Link } from 'react-router-dom'

import ProjectLogo from '../primitives/project-logo'
import HorizontalScore from '../primitives/horizontal-score'
import type {
  Repo,
  RepositoryInfoStatus,
  Excerpt,
  Details
} from '../../providers/data'

type Props = {
  repo: Repo
  nested?: boolean
  target: string
}

const levels = {
  0: 'stroke-red-500',
  1: 'stroke-orange-400',
  2: 'stroke-yellow-300',
  3: 'stroke-green-400',
  4: 'stroke-green-400'
}

export default function Project({ repo, target, nested }: Props) {
  let state: RepositoryInfoStatus & Excerpt & Details
  if (repo[target].state === 'loaded') {
    state = {
      ...repo.index,
      ...repo[target].data
    }
  } else {
    return (
      <div role="status" className="mt-12 mx-auto pt-12">
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

  const external = e => {
    e.stopPropagation()
  }

  const score = state.rating
    ? state.rating * 10
    : state.score
    ? state.score * 10
    : 0
  const formattedScore = isNaN(score) || score < 0 ? 0 : score
  const level = Math.floor(formattedScore / 25)

  console.log(
    state.rating ? state.rating * 10 : state.score ? state.score * 10 : '--'
  )

  const C = () => {
    return (
      <div className="w-full pb-4 bg-white rounded-2xl flex-col justify-start items-start gap-2 inline-flex overflow-hidden">
        <div className="self-stretch flex-col justify-start items-start gap-0 flex">
          <div className="justify-start items-center gap-4 inline-flex pl-6 pr-8 pt-6">
            <ProjectLogo />
            <div className="flex flex-col">
              <div className="text-gray-700 text-2xl font-semibold leading-9">
                {state.name}
              </div>
              <div className="text-gray-400 text-xs font-normal leading-none italic">
                Updated {formatDuration(state.updatedAt)}
              </div>
            </div>
          </div>
          {nested && state.openGraphImageUrl ? (
            <div className="overflow-hidden h-[50px] w-full mt-4 relative">
              <img
                src={state.openGraphImageUrl}
                alt={state.name}
                className="absolute bottom-[-12px] transform origin-bottom"
              />
              <div className="absolute bg-white right-0 w-16 h-full z-10" />
            </div>
          ) : null}
        </div>
        <div className="self-stretch flex-col justify-start items-start gap-3 flex pl-6 pr-8">
          <div className="justify-start items-center gap-1 inline-flex">
            <a
              href={`https://github.com/${state.organization}/${state.name}`}
              target="_blank"
              className="justify-start items-center gap-1 inline-flex"
              onClick={external}
            >
              <div className="w-4 h-4 relative">
                <img src="./icons/link.svg" />
              </div>
              <div className="justify-start items-baseline gap-2 flex">
                <div className="text-[#3E238B] text-sm font-medium leading-tight">
                  Github
                </div>
              </div>
            </a>
            <div className="text-gray-400 text-xs font-normal leading-none italic">
              Added{' '}
              {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(
                new Date(state.createdAt)
              )}
            </div>
          </div>
          <div className="self-stretch text-gray-500 text-sm font-normal leading-tight">
            {state.description}
          </div>
        </div>
        <div className="flex flex-1 w-full items-center md:pl-6 md:pr-8 flex-col md:flex-row">
          <div className="w-32 h-32 relative md:-ml-2 md:mr-2 mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path
                className="stroke-gray-200"
                d="M 30 90 A43 43 0 1 1 70 90"
                style={{
                  strokeWidth: 5,
                  fill: 'none'
                }}
              />
              <path
                style={{
                  strokeWidth: 5,
                  strokeDasharray: 420,
                  strokeDashoffset: 420 - 230 * ((state.rating || 0) / 10),
                  fill: 'none'
                }}
                className={levels[level]}
                d="M 30 90 A43 43 0 1 1 70 90"
              />
            </svg>
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
              <div className="text-center text-gray-500 text-xs font-normal leading-none mt-1">
                Total
                <div className="text-center text-gray-700 text-2xl font-bold leading-9 -mt-1">
                  {state.rating
                    ? state.rating * 10
                    : state.score
                    ? state.score * 10
                    : '--'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 space-y-2 mt-2 w-full px-4 md:px-0 md:w-auto">
            <HorizontalScore
              checks={state.checks}
              checkKey={'CII-Best-Practices'}
              label={'Best Practices'}
            />
            <HorizontalScore
              checks={state.checks}
              checkKey={'License'}
              label={'License'}
            />
            <HorizontalScore
              checks={state.checks}
              checkKey={'Vulnerabilities'}
              label={'Vulnerabilities'}
            />
            <HorizontalScore
              checks={state.checks}
              checkKey={'Maintained'}
              label={'Maintained'}
            />
            <HorizontalScore
              checks={state.checks}
              checkKey={'Code-Review'}
              label={'Code Review'}
            />
          </div>
        </div>
      </div>
    )
  }

  if (nested) {
    return (
      <Link to={`/repo/${state.name}`} key={state.id} className="group">
        <C />
      </Link>
    )
  }

  return <C />
}

// TODO improve this, maybe use lib
function formatDuration(time: string) {
  const date = new Date(time)
  const duration = (Date.now() - date.getTime()) / 1000

  const buckets = {
    seconds: 0,
    minutes: 60,
    hours: 60 * 60,
    days: 60 * 60 * 24,
    weeks: 60 * 60 * 24 * 7,
    'a long time ago': 60 * 60 * 24 * 7 * 30
  }

  const keys = Object.keys(buckets)
  for (let i = 1; i < keys.length; i += 1) {
    if (duration < buckets[keys[i]]) {
      return `${Math.round(duration / buckets[keys[i - 1]])} ${keys[i - 1]} ago`
    }
  }

  return 'a long time ago'
}
