import React, { useEffect, useState } from 'react'
import { Check } from '../../providers/data'

type Score = {
  checks: { [key: string]: number } | Check[]
  checkKey: string
  label?: string
}

const levels = {
  0: 'bg-red-500',
  1: 'bg-orange-400',
  2: 'bg-yellow-300',
  3: 'bg-green-400',
  4: 'bg-green-600'
}

export default function HorizontalScore({ checkKey, checks, label }: Score) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 100)
  }, [])

  const target = Array.isArray(checks)
    ? checks.find(x => x.name === checkKey)
    : checks[checkKey]

  if (!target) return null

  const score =
    target && (target as Check).score
      ? (target as Check).score * 10
      : target
      ? (target as number) * 10
      : 0

  const formattedScore = isNaN(score) || score < 0 ? 0 : score
  const level = Math.floor(formattedScore / 25)

  return (
    // <div className="grid grid-cols-3 gap-x-4">
    <div className="flex flex-row gap-x-4">
      {label ? (
        <div className="text-gray-500 text-xs uppercase leading-none break-words font-semibold max-w-[115px] flex-1">
          {label}
        </div>
      ) : null}
      <div
        className={`flex-1 flex items-center ${
          label ? 'col-span-2' : 'col-span-3'
        } space-x-2`}
      >
        <div className="text-gray-700 text-xs font-semibold uppercase leading-none w-6 text-right">
          {formattedScore}
        </div>
        <div className="w-full h-2 flex-1 relative">
          <div className="absolute inset-0 h-2 bg-gray-300 rounded z-0" />
          <div
            style={{
              width: show ? `${formattedScore}%` : '0%'
            }}
            className={`absolute top-0 left-0 bottom-0 h-2 ${levels[level]} rounded z-10 transition-all duration-500`}
          />
        </div>
      </div>
    </div>
  )
}
