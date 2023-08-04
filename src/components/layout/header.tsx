import React from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../../providers/ui'

export const Header = function Header() {
  const { term, setUiState } = useUI()
  return (
    <div className="w-full h-20 py-4 bg-indigo-950 flex">
      <div className="justify-between items-center gap-96 flex w-full lg:max-w-5xl xl:max-w-7xl mx-auto">
        <div className="justify-start items-center gap-6 flex flex-1">
          <div className="w-60 flex-col justify-start items-start gap-2 inline-flex">
            <Link
              className="h-14 flex-col justify-start items-end gap-1 flex"
              to="/"
            >
              <div className="w-48 h-8 pr-px justify-center items-center gap-3 inline-flex">
                <div className="justify-center items-center inline-flex">
                  <div className="relative justify-start items-center flex">
                    <img className="mr-1" src="./icons/logo-mark.svg" />
                    <div className="">
                      <img
                        className="w-[160px] h-[34px]"
                        src="./icons/oss-check.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="justify-end items-center gap-2 inline-flex">
                <div className="text-center text-white text-xs font-semibold leading-none">
                  by
                </div>
                <div className="w-20 h-3 relative">
                  <img src="./icons/nf-logo.svg" />
                </div>
              </div>
            </Link>
          </div>
          <div className="w-24 justify-start items-center gap-4 flex">
            <div className="px-6 py-1 rounded-lg justify-center items-center gap-2 flex">
              <Link
                className="text-center text-white text-lg font-semibold leading-relaxed"
                to="/documentation"
              >
                Docs
              </Link>
            </div>
          </div>
        </div>
        <div className="w-72 py-3">
          <div className="relative">
            <img
              src="./icons/search-outline.svg"
              className="w-4 absolute top-3 left-3"
            />
            <input
              type="search"
              name="term"
              className="pl-8 pr-2 bg-gray-50 rounded-lg border border-gray-200 flex-col justify-center items-start gap-2 inline-flex w-full"
              placeholder="Search"
              value={term}
              onChange={e => setUiState(s => ({ ...s, term: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
