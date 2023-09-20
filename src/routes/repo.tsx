import React from 'react'
import { Disclosure } from '@headlessui/react'
import { Link, useParams } from 'react-router-dom'
import { Details, GenericState, useLazyData } from '../providers/data'
import Project from '../components/patterns/project'
import HorizontalScore from '../components/primitives/horizontal-score'

export default function RepoRoute() {
  const { repo } = useParams()
  const lazyData = useLazyData()

  switch (lazyData.state) {
    case 'error':
      const { message } = lazyData
      return <div>Error: {message}</div>
    case 'loading':
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
    case 'loaded':
      const target = lazyData.data.repos.find(x => x.index.name === repo)

      if (!target) {
        return (
          <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Not Found
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Repository not found.
              </p>
            </div>
          </div>
        )
      }

      return (
        <div className="w-full max-w-[888px] mx-auto">
          <section className="flex flex-col w-full mt-6 space-y-6 pb-12 px-4 md:px-0">
            <div className="w-full h-14 px-6 bg-white rounded-2xl justify-start items-center gap-1 inline-flex">
              <Link
                className="relative justify-start items-center gap-1 inline-flex"
                to="/"
              >
                <div className="w-6 h-6 relative">
                  <img src="./icons/arrow-left-outline.svg" />
                </div>
                <div className="text-gray-700 text-base font-bold leading-normal">
                  Back
                </div>
              </Link>
            </div>
            <Project
              repo={target}
              target="details"
              key={target.index.id}
              nested={false}
            />
            <Checks details={target.details} />
          </section>
        </div>
      )
  }
}

function Checks({ details }: { details: GenericState<Details> }) {
  switch (details.state) {
    case 'error':
      return <div>Error: {details.message}</div>
    case 'loading':
      return <div>Loading...</div>
    case 'loaded':
      return (
        <div className="flex w-full flex-col space-y-4 bg-white p-2 md:p-6 rounded-2xl">
          {details.data.checks.map(check => {
            return (
              <Disclosure as="section">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="block text-left w-full">
                      <div
                        key={check.name}
                        className="p-2 md:p-6 bg-gray-100 rounded-lg flex-col justify-start items-start gap-6 inline-flex w-full"
                      >
                        <div className="self-stretch justify-start items-center gap-8 inline-flex">
                          <div className="grow shrink basis-0 h-4 justify-start items-center gap-4 flex">
                            <div className="text-gray-500 text-xs md:text-sm font-semibold uppercase leading-none md:min-w-[200px]">
                              {check.name}
                            </div>
                            <div className="flex-1">
                              <HorizontalScore
                                checkKey={check.name}
                                checks={details.data.checks}
                              />
                            </div>
                          </div>
                          <div className="w-4 h-4 md:w-6 md:h-6 relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className={`w-4 h-4 md:w-6 md:h-6 text-gray-600 ${
                                open ? 'rotate-180 transform' : ''
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-2 md:px-4 pb-3 md:pb-6 text-xs md:text-sm text-gray-500 bg-gray-100 rounded-b-2xl">
                      <div className="bg-white rounded-2xl p-2 md:p-6 space-y-2">
                        {check.documentation.short ? (
                          <p className="text-gray-600 font-semibold">
                            {check.documentation.short}
                          </p>
                        ) : null}
                        {check.reason ? (
                          <p className="capitalize">{check.reason}</p>
                        ) : null}
                        {check.details && check.details.length ? (
                          <>
                            <ul>
                              {check.details.map(detail => (
                                <li className="capitalize">{detail}</li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          })}
        </div>
      )
  }
}
