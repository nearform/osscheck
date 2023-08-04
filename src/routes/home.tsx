import React, { useEffect, useRef } from 'react'
import { useData } from '../providers/data'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'

import Project from '../components/patterns/project'
import Filters from '../components/patterns/filters'
import { CustomFlowbiteTheme, Dropdown } from 'flowbite-react'
import { Sort, useUI } from '../providers/ui'

const customTheme: CustomFlowbiteTheme['dropdown'] = {
  inlineWrapper:
    'flex items-center text-gray-700 text-sm font-semibold leading-tight'
}

export default function HomeRoute() {
  const { repos } = useData()
  const { term, limit, sort, setUiState } = useUI()
  const fuse = useRef(
    new Fuse(repos || [], {
      keys: ['name']
    })
  )

  useEffect(() => {
    if (repos) {
      fuse.current = new Fuse(repos, {
        keys: ['name']
      })
    }
  }, [repos])

  let data = repos?.sort((a, b) => {
    if (sort === Sort.alphabetical_asc) {
      return a.name.localeCompare(b.name)
    }
    if (sort === Sort.alphabetical_desc) {
      return b.name.localeCompare(a.name)
    }
    return 0
  })

  if (term && term.length > 0) {
    data = fuse.current.search(term).map(r => r.item)
  }
  data = data?.slice(0, limit)

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
              {repos?.length} Results
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
          {data ? (
            <>
              {data.map((repo, i) => {
                const nameParts = repo.name.split('/')
                const name = nameParts[nameParts.length - 1]
                const route = `/repo/${name}`
                return (
                  <Link to={route} key={`${i}-${route}`} className="group">
                    <Project name={name} project={repo} />
                  </Link>
                )
              })}
            </>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
