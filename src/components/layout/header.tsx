import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../../providers/ui'

export const Header = function Header() {
  const { term, activeFilter, setUiState } = useUI()
  const [search, setSearch] = useState(
    window.matchMedia('(min-width: 767px)').matches
  )

  return (
    <div className="w-full flex md:bg-indigo-950 sticky top-0 z-50">
      <div className="relative flex-col md:flex-row md:justify-between md:items-center md:gap-96 flex w-full lg:max-w-5xl xl:max-w-7xl mx-auto">
        <div className="bg-indigo-950 py-4 justify-start items-center gap-6 flex flex-1 border-none">
          <div className="w-60 flex-col justify-start items-start gap-2 inline-flex">
            <Link
              className="h-14 flex-col justify-start items-end gap-1 flex pl-4"
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
        </div>
        <div className="absolute right-4 top-7 flex items-center space-x-4 md:hidden">
          <button
            type="button"
            onClick={() =>
              setUiState(s => ({ ...s, activeFilter: !activeFilter }))
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="text-white w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
          </button>
          <button type="button" onClick={() => setSearch(!search)}>
            <svg
              className="text-white w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
        <div className='flex flex-row'>
          <div
            className={`md:w-72 bg-gray-100 md:bg-transparent md:px-0 md:py-3 ${
              search ? 'flex  pt-4 px-4' : 'h-0 overflow-hidden p-0'
            }`}
          >
            <div className="relative w-full">
              <svg
                className="text-gray-500 w-5 h-5 absolute top-3.5 left-3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                name="term"
                className="w-full pl-10 pr-2 py-3 bg-gray-50 rounded-lg border border-gray-200 flex-col justify-center items-start gap-2 flex"
                placeholder="Search"
                value={term}
                onChange={e =>
                  setUiState(s => ({ ...s, term: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="hidden md:block md:ml-4 md:w-12 md:mr-12">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 42 42"
            >
              <path
                fill="#fff"
                stroke="#fff"
                d="M21.01 4c4.03 0 7.931 1.472 11.004 4.153 3.073 2.682 5.118 6.4 5.766 10.49a17.828 17.828 0 0 1-2.234 11.828c-2.083 3.534-5.318 6.192-9.127 7.505-.304.054-.42-.026-.464-.066a.426.426 0 0 1-.11-.31c0-.193.003-.533.006-.99l.005-.79c.005-.853.01-1.931.01-3.126a4.887 4.887 0 0 0-.756-2.96c1.711-.272 3.46-.814 4.847-2.005 1.648-1.414 2.707-3.67 2.708-7.22a7.536 7.536 0 0 0-1.738-4.932 7.1 7.1 0 0 0-.28-4.83l-.089-.207-.213-.07-.157.474.156-.475h-.001l-.003-.001-.004-.002-.011-.003a2.062 2.062 0 0 0-.393-.057 3.872 3.872 0 0 0-.997.099c-.828.18-2.024.642-3.634 1.735a16.702 16.702 0 0 0-8.574 0c-1.613-1.093-2.814-1.556-3.645-1.735a3.897 3.897 0 0 0-1-.1 2.07 2.07 0 0 0-.364.05.754.754 0 0 0-.03.008l-.01.003-.005.002h-.003l.154.476-.155-.475-.215.07-.09.208a7.099 7.099 0 0 0-.27 4.83 7.545 7.545 0 0 0-1.74 4.932c0 3.543 1.057 5.802 2.7 7.22 1.383 1.195 3.124 1.744 4.83 2.022a4.375 4.375 0 0 0-.638 1.705 3.152 3.152 0 0 1-2.242.184 3.191 3.191 0 0 1-1.124-.594 3.298 3.298 0 0 1-.818-.997l-.005-.01a4.235 4.235 0 0 0-1.284-1.408 4.121 4.121 0 0 0-1.762-.689l-.031-.004h-.031l-.008.5.007-.5h-.003l-.007-.001h-.02a2.844 2.844 0 0 0-.274.016c-.147.016-.4.055-.61.177a.78.78 0 0 0-.334.363.741.741 0 0 0 .005.58c.123.3.425.578.827.86l.006.004.007.005a4.244 4.244 0 0 1 1.736 2.35l.003.01.476-.152-.476.153v.001l.001.002.002.004.004.013.014.038a3.48 3.48 0 0 0 .264.532 4.11 4.11 0 0 0 1.007 1.119c.919.706 2.369 1.222 4.579.86l.013 1.69c.005.485.008.857.008 1.044 0 .14-.047.25-.11.308-.043.04-.16.12-.461.07-3.815-1.309-7.056-3.965-9.143-7.5A17.828 17.828 0 0 1 4.22 18.647c.647-4.095 2.695-7.816 5.773-10.5C13.07 5.466 16.976 3.997 21.01 4Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
