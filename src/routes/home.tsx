import React, { useEffect, useRef } from 'react'
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
  const { term, limit, sort, setUiState } = useUI()

  switch (lazyData.state) {
    case 'error':
      const { message } = lazyData
      return (<div>Error: {message}</div>)
    case 'loading':
      return (<div>Loading</div>)
    case 'loaded':
      const { data: { repos } } = lazyData
      const uiState = prepareUiState({ repos, term, limit, sort })

      return (
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
                  {uiState.totalNumRepos} Results
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
                        setUiState(s => ({ ...s, sort: Sort.alphabetical_asc }))
                      }
                      className="text-gray-700 text-sm font-normal leading-tight"
                    >
                      Alphabetical (A-Z)
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        setUiState(s => ({ ...s, sort: Sort.alphabetical_desc }))
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
              {uiState.repos.map(repo => <Project repo={repo} key={repo.index.id} />)}
            </ul>
          </div>
        </div>
      )
  }
}

function prepareUiState({ repos, term, limit, sort }: { repos: Repo[] } & Pick<UiState, 'term' | 'limit' | 'sort'>) {
  const pageIndex = 0 // TODO

  return {
    totalNumRepos: repos.length,
    repos: [
      filterByScore(0, 10),
      searchRepos(term),
      sortRepos(sort),
      paginateRepos(limit, pageIndex)
    ].reduce((value, cb) => cb(value), repos)
  }
}

function filterByScore(min: number, max: number): (repos: Repo[]) => Repo[] {
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
    return repos.filter(repo => (repo.index.rating || 0) >= min && (repo.index.rating || 0) < max)
  }
}

function searchRepos(term: string): (repos: Repo[]) => Repo[] {
  return (repos: Repo[]): Repo[] => {
    if (!term) {
      return repos;
    }

    const options = {
      includeScore: false,
      keys: ['index.name']
    }
    const fuse = new Fuse(repos, options)
    return fuse.search(term).map((item) => item.item);
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

function paginateRepos(limit: number, pageIndex: number = 0): (repos: Repo[]) => Repo[] {
  const startIndex = pageIndex * limit;

  return (repos: Repo[]): Repo[] => {
    return repos.slice(startIndex, limit)
  }
}