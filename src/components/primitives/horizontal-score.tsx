import React, { useEffect, useState } from 'react'

type Score = {
  score: number
  label?: string
}

const levels = {
  0: 'bg-red-400',
  1: 'bg-orange-400',
  2: 'bg-yellow-400',
  3: 'bg-emerald-400',
  4: 'bg-emerald-600'
}

export default function HorizontalScore({ score, label }: Score) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 100)
  }, [])

  const level = Math.floor(score / 25)

  return (
    <div className="grid grid-cols-3 gap-x-4">
      {label ? (
        <div className="text-gray-500 text-[11px] uppercase leading-none">
          {label}
        </div>
      ) : null}
      <div
        className={`flex-1 flex items-center ${
          label ? 'col-span-2' : 'col-span-3'
        } space-x-2`}
      >
        <div className="text-gray-700 text-xs font-semibold uppercase leading-none">
          {score}
        </div>
        <div className="w-full h-2 flex-1 relative">
          <div className="absolute inset-0 h-2 bg-gray-100 rounded z-0" />
          <div
            style={{
              width: show ? `${score}%` : '0%'
            }}
            className={`absolute top-0 left-0 bottom-0 h-2 ${levels[level]} rounded z-10 transition-all duration-500`}
          />
        </div>
      </div>
    </div>
  )
}
