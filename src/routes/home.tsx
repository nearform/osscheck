import React from 'react'
import { useData } from '../providers/data'
import { Link } from 'react-router-dom'

export default function HomeRoute() {
  const { repos } = useData()

  return (
    <div className="p-6">
      <ul
        role="list"
        className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {repos && repos.length > 0 ? (
          <>
            {repos.map((repo, i) => {
              const nameParts = repo.name.split('/')
              const name = nameParts[nameParts.length - 1]
              const route = `/repo/${name}`
              return (
                <Link to={route} key={`${i}-${route}`}>
                  <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:px-6">
                      <p>{repo.name}</p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      {/* Content goes here */}
                    </div>
                  </div>
                </Link>
              )
            })}
          </>
        ) : null}
      </ul>
    </div>
  )
}
