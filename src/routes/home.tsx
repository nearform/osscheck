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
  const { term, limit, sort, pageIndex, ratingFilter, setUiState } = useUI()

  switch (lazyData.state) {
    case 'error':
      const { message } = lazyData
      return <div>Error: {message}</div>
    case 'loading':
      return <div>Loading</div>
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
          <div className="flex">
            <div className="">
              <Filters />
            </div>
            <div className="mt-6 lg:ml-6">
              <div className="w-full px-8 py-3 bg-white rounded-2xl justify-between items-center gap-2 inline-flex">
                <div className="justify-start items-baseline gap-2 flex">
                  <div className="text-violet-900 text-2xl font-semibold leading-9">
                    Projects
                  </div>
                  <div className="text-gray-400 text-xs font-normal leading-none">
                    {uiState.totalFilteredRepos} Results
                  </div>
                </div>
                <div className="justify-start items-center gap-6 flex">
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
                {uiState.repos.map(repo => (
                  <Project repo={repo} key={repo.index.id} />
                ))}
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
