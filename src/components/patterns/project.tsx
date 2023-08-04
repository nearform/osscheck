import React from 'react'
import ProjectLogo from '../primitives/project-logo'
import HorizontalScore from '../primitives/horizontal-score'

type Props = {
  project: { name: string }
  name: string
}

export default function Project(props: Props) {
  return (
    <div className="w-full pl-6 pr-8 pt-7 pb-8 bg-white rounded-2xl flex-col justify-start items-start gap-6 inline-flex group-hover:shadow-lg transition-shadow duration-300">
      <div className="self-stretch flex-col justify-start items-start gap-3 flex">
        <div className="justify-start items-center gap-4 inline-flex">
          <ProjectLogo />
          <div className="text-gray-700 text-2xl font-semibold leading-9">
            {props.name}
          </div>
        </div>
        <div className="justify-start items-center gap-2 inline-flex">
          <div className="px-2.5 py-0.5 bg-gray-100 rounded-md justify-center items-center flex">
            <div className="text-center text-gray-700 text-xs font-medium leading-none">
              Sandbox
            </div>
          </div>
          <div className="text-gray-400 text-xs font-normal leading-none italic">
            Updated 5hrs ago
          </div>
        </div>
        <div className="justify-start items-center gap-1 inline-flex">
          <div className="w-4 h-4 relative">
            <img src="./icons/link.svg" />
          </div>
          <div className="justify-start items-baseline gap-2 flex">
            <div className="text-violet-900 text-sm font-medium leading-tight">
              Github
            </div>
            <div className="text-gray-400 text-xs font-normal leading-none italic">
              Added 6th April 2022
            </div>
          </div>
        </div>
        <div className="self-stretch text-gray-500 text-sm font-normal leading-tight">
          Lorem ipsum dolor sit amet consectetur. Nunc quis orci scelerisque
          egestas et egestas amet nibh elementum.
        </div>
      </div>
      <div className="flex flex-1 w-full items-center">
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
                strokeDashoffset: 'calc(40 * 3.142 * 1.85)',
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
                92
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 space-y-2 mt-2">
          <HorizontalScore score={92} label={'Best Practices'} />
          <HorizontalScore score={44} label={'Documentation'} />
          <HorizontalScore score={56} label={'License'} />
          <HorizontalScore score={23} label={'Security'} />
          <HorizontalScore score={78} label={'Legal'} />
        </div>
      </div>
    </div>
  )
}
