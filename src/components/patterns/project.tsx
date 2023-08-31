import React from 'react'
import { Link } from 'react-router-dom'

import ProjectLogo from '../primitives/project-logo'
import HorizontalScore from '../primitives/horizontal-score'
import type { Repo, RepositoryInfoStatus, Excerpt } from '../../providers/data'

type Props = {
  repo: Repo
}

export default function Project({ repo }: Props) {
  let state: RepositoryInfoStatus & Excerpt
  if (repo.excerpt.state === 'loaded') {
    state = {
      ...repo.index,
      ...repo.excerpt.data
    }
  } else {
    return <div>loading</div> // TODO  switch case and propper handling
  }

  return (
    <Link to={`/repo/${state.name}`} key={state.id} className="group">
      <div className="w-full pb-4 bg-white rounded-2xl flex-col justify-start items-start gap-4 inline-flex group-hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="self-stretch flex-col justify-start items-start gap-0 flex">
          <div className="justify-start items-center gap-4 inline-flex pl-6 pr-8 pt-6">
            <ProjectLogo />
            <div className="text-gray-700 text-2xl font-semibold leading-9">
              {state.name}
            </div>
          </div>
          {state.openGraphImageUrl ? (
            <div className="overflow-hidden h-[64px] relative w-full mt-4">
              <img
                src={state.openGraphImageUrl}
                alt={state.name}
                className="absolute bottom-0 transform origin-bottom"
              />
            </div>
          ) : null}
        </div>
        <div className="self-stretch flex-col justify-start items-start gap-3 flex pl-6 pr-8">
          <div className="justify-start items-center gap-2 inline-flex">
            {/* <div className="px-2.5 py-0.5 bg-gray-100 rounded-md justify-center items-center flex">
            <div className="text-center text-gray-700 text-xs font-medium leading-none">
              Sandbox
            </div>
          </div> */}
            <div className="text-gray-400 text-xs font-normal leading-none italic">
              Updated {formatDuration(state.updatedAt)}
            </div>
          </div>
          <div className="justify-start items-center gap-1 inline-flex">
            <div className="w-4 h-4 relative">
              <img src="./icons/link.svg" />
            </div>
            <div className="justify-start items-baseline gap-2 flex">
              <div className="text-violet-900 text-sm font-medium leading-tight">
                <a href={`https://github.com/nearform/${state.name}`}>Github</a>
                {/* TODO get the org name from data  */}
              </div>
              <div className="text-gray-400 text-xs font-normal leading-none italic">
                Added{' '}
                {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(
                  new Date(state.createdAt)
                )}
              </div>
            </div>
          </div>
          <div className="self-stretch text-gray-500 text-sm font-normal leading-tight">
            {state.description}
          </div>
        </div>
        <div className="flex flex-1 w-full items-center pl-6 pr-8">
          <div className="w-32 h-32 relative -ml-2 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path
                className="stroke-gray-200"
                d="M40,90 A40,40 0 1,1 60,90"
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
                className="stroke-green-400"
                d="M40,90 A40,40 0 1,1 60,90"
              />
            </svg>
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
              <div className="text-center text-gray-500 text-xs font-normal leading-none mt-1">
                Total
                <div className="text-center text-gray-700 text-2xl font-bold leading-9 -mt-1">
                  {(state.rating && state.rating * 10) || '--'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 space-y-2 mt-2">
            {/* 
          We have the following
          "checks": {
              "Maintained": 0,
              "Code-Review": 0,
              "CII-Best-Practices": 0,
              "Signed-Releases": -1,
              "License": 0,
              "Dangerous-Workflow": -1,
              "Token-Permissions": -1,
              "Packaging": -1,
              "SAST": 0,
              "Branch-Protection": 0,
              "Binary-Artifacts": 10,
              "Pinned-Dependencies": 10,
              "Fuzzing": 0,
              "Vulnerabilities": 10,
              "Security-Policy": 0
          }
          */}
            {state.checks['CII-Best-Practices'] > 0 && (
              <HorizontalScore
                score={state.checks['CII-Best-Practices'] * 10}
                label={'Best Practices'}
              />
            )}
            {state.checks['License'] > 0 && (
              <HorizontalScore
                score={state.checks['License'] * 10}
                label={'License'}
              />
            )}
            {state.checks['Vulnerabilities'] > 0 && (
              <HorizontalScore
                score={state.checks['Vulnerabilities'] * 10}
                label={'Vulnerabilities'}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
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
