import React from 'react'
import { useLazyData } from '../providers/data'
import Fuse from 'fuse.js'

import Project from '../components/patterns/project'
import Filters from '../components/patterns/filters'
import { CustomFlowbiteTheme, Dropdown } from 'flowbite-react'
import { Sort, useUI } from '../providers/ui'

import type { Repo } from '../providers/data'
import type { State as UiState } from '../providers/ui'

const customTheme: CustomFlowbiteTheme['dropdown'] = {
  inlineWrapper:
    'flex items-center text-gray-700 text-sm font-semibold leading-tight'
}

export default function HomeRoute() {
  const lazyData = useLazyData()
  const {
    term,
    limit,
    sort,
    pageIndex,
    ratingFilter,
    activeFilter,
    setUiState
  } = useUI()

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
      const uiState = prepareUiState({
        repos: lazyData.data.repos,
        term,
        limit,
        sort,
        pageIndex,
        ratingFilter
      })

      return (
        <>
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:flex">
              <Filters />
            </div>
            <div className="pt-4 px-4 md:pt-0 md:px-0 md:mt-6 md:ml-6">
              <div className="w-full px-4 md:px-8 py-3 bg-white rounded-2xl md:justify-between md:items-center gap-2 inline-flex flex-col md:flex-row">
                <div className="md:justify-start items-center md:items-baseline gap-2 flex justify-between">
                  <div className="text-violet-900 text-2xl font-semibold leading-9">
                    Projects
                  </div>
                  <div className="text-gray-400 text-xs font-normal leading-none">
                    {uiState.totalFilteredRepos} Results
                  </div>
                </div>
                <div className="justify-start items-center gap-6 flex pt-2 md:pt-0">
                  <div className="justify-start items-center gap-2 flex">
                    <Dropdown
                      inline
                      label={`Show ${sort}`}
                      size="sm"
                      theme={customTheme}
                    >
                      <Dropdown.Item
                        onClick={() =>
                          setUiState(s => ({
                            ...s,
                            sort: Sort.alphabetical_asc
                          }))
                        }
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        Alphabetical (A-Z)
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setUiState(s => ({
                            ...s,
                            sort: Sort.alphabetical_desc
                          }))
                        }
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        Alphabetical (Z-A)
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setUiState(s => ({ ...s, sort: Sort.score_asc }))
                        }
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        Score (High - Low)
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setUiState(s => ({ ...s, sort: Sort.score_desc }))
                        }
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        Score (Low - High)
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                  <div className="justify-start items-center gap-2 flex">
                    <Dropdown
                      inline
                      label={`Show ${limit}`}
                      size="sm"
                      theme={customTheme}
                    >
                      <Dropdown.Item
                        onClick={() => setUiState(s => ({ ...s, limit: 10 }))}
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        10
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setUiState(s => ({ ...s, limit: 20 }))}
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        20
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setUiState(s => ({ ...s, limit: 40 }))}
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        40
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setUiState(s => ({ ...s, limit: 60 }))}
                        className="text-gray-700 text-sm font-normal leading-tight"
                      >
                        60
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <ul
                role="list"
                className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 xl:gap-x-8 mb-6"
              >
                {uiState.repos.map(repo => {
                  return (
                    <Project
                      target="details"
                      repo={repo}
                      key={repo.index.id}
                      nested
                    />
                  )
                })}
              </ul>

              <nav
                className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-t-lg"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {pageIndex === 0 ? '1' : pageIndex * limit}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {pageIndex * limit + limit > uiState.totalFilteredRepos
                        ? uiState.totalFilteredRepos
                        : pageIndex * limit + limit}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">
                      {uiState.totalFilteredRepos}
                    </span>{' '}
                    results
                  </p>
                </div>
                <div className="flex flex-1 justify-between sm:justify-end">
                  <button
                    type="button"
                    disabled={pageIndex === 0}
                    onClick={() => {
                      pageIndex > 0 &&
                        setUiState(s => ({ ...s, pageIndex: s.pageIndex - 1 }))
                    }}
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={
                      pageIndex * limit + limit > uiState.totalFilteredRepos
                    }
                    onClick={() => {
                      pageIndex * limit + limit < uiState.totalFilteredRepos
                        ? setUiState(s => ({
                            ...s,
                            pageIndex: s.pageIndex + 1
                          }))
                        : null
                    }}
                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </nav>
            </div>
          </div>
          <div
            className="relative z-10"
            aria-labelledby="slide-over-title"
            role="dialog"
            aria-modal="true"
          >
            {activeFilter ? (
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() =>
                  setUiState(s => ({ ...s, activeFilter: !activeFilter }))
                }
              ></div>
            ) : null}

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className={`fixed inset-y-0 right-0 flex max-w-full pl-36 transform transition ease-in-out duration-500 ${
                    activeFilter
                      ? 'pointer-events-none translate-x-0'
                      : 'pointer-events-auto translate-x-full'
                  }`}
                >
                  <div className={`pointer-events-auto w-screen max-w-md`}>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <h2
                            className="text-base font-semibold leading-6 text-gray-900"
                            id="slide-over-title"
                          >
                            Filters
                          </h2>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <span className="absolute -inset-2.5"></span>
                              <span className="sr-only">Close panel</span>
                              <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <Filters />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
  }
}

function prepareUiState({
  repos,
  term,
  limit,
  sort,
  pageIndex = 0,
  ratingFilter
}: { repos: Repo[] } & Pick<
  UiState,
  'term' | 'limit' | 'sort' | 'pageIndex' | 'ratingFilter'
>) {
  const filteredRepos = [
    filterByScore(ratingFilter),
    searchRepos(term),
    sortRepos(sort)
  ].reduce((value, cb) => cb(value), repos)

  return {
    totalFilteredRepos: filteredRepos.length,
    repos: paginateRepos(limit, pageIndex)(filteredRepos)
  }
}

function filterByScore(
  values: UiState['ratingFilter']
): (repos: Repo[]) => Repo[] {
  if (values.length === 0) {
    return (repos: Repo[]): Repo[] => repos
  }

  const v = values.map(v => v.split('-').map(Number)).flat()
  const max = Math.max(...v) / 10
  const min = Math.min(...v) / 10

  if (max > 10) {
    throw Error('Ratings vary between 0 and 10. argument max is invalid')
  }
  if (max < 0) {
    throw Error('Ratings vary between 0 and 10. argument min is invalid')
  }
  if (min >= max) {
    throw Error('Ratings vary between 0 and 10. min must be lower than max')
  }

  return (repos: Repo[]): Repo[] => {
    return repos.filter(repo => {
      return (repo.index.rating || 0) >= min && (repo.index.rating || 0) < max
    })
  }
}

function searchRepos(term: string): (repos: Repo[]) => Repo[] {
  return (repos: Repo[]): Repo[] => {
    if (!term) {
      return repos
    }

    const options = {
      includeScore: false,
      keys: ['index.name']
    }
    const fuse = new Fuse(repos, options)
    return fuse.search(term).map(item => item.item)
  }
}

function sortRepos(sort: UiState['sort']): (repos: Repo[]) => Repo[] {
  return (repos: Repo[]): Repo[] => {
    repos.sort((a, b) => {
      if (sort === Sort.alphabetical_asc) {
        return a.index.name.localeCompare(b.index.name)
      }
      if (sort === Sort.alphabetical_desc) {
        return b.index.name.localeCompare(a.index.name)
      }
      if (sort === Sort.score_asc) {
        return (b.index.rating || 0) - (a.index.rating || 0)
      }
      if (sort === Sort.score_desc) {
        return (a.index.rating || 0) - (b.index.rating || 0)
      }
      return 0
    })
    return repos
  }
}

function paginateRepos(
  limit: number,
  pageIndex: number = 0
): (repos: Repo[]) => Repo[] {
  const startIndex = pageIndex * limit
  return (repos: Repo[]): Repo[] => {
    return repos.slice(startIndex, startIndex + limit)
  }
}
