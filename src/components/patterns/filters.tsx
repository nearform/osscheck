import React from 'react'

const maturity = [
  'graduated',
  'incubating',
  'sandbox',
]

const rating = [
  '100-75',
  '74-50',
  '49-25',
  '24-0',
]

export default function Filters() {
  return (
    <div className="w-60 mt-6 px-6 pt-3 pb-6 bg-white rounded-2xl flex-col justify-start items-start gap-4 inline-flex sticky top-6 left-0">
      <div className="text-violet-900 text-2xl font-semibold leading-9">Filters</div>
      <div className="flex-col justify-start items-start gap-6 flex">
        {/* 
        <div className="flex-col justify-start items-start gap-3 flex">
          <div className="text-violet-900 text-sm font-semibold leading-tight">Maturity Level</div>
          {maturity.map((m, i) => {
            return (
              <div className="flex items-center" key={`maturity-${m}`}>
                <input id={m} type="checkbox" value="" className="w-4 h-4 p-2.5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor={m} className="ml-2 text-sm font-medium leading-none capitalize">{m}</label>
              </div>
            )
          })}
        </div> 
        */}

        <div className="flex-col justify-start items-start gap-3 flex">
          <div className="text-violet-900 text-sm font-semibold leading-tight">Rating</div>
          {rating.map((m, i) => {
            return (
              <div className="flex items-center" key={`rating-${m}`}>
                <input id={m} type="checkbox" value="" className="w-4 h-4 p-2.5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor={m} className="ml-2 text-sm font-medium leading-none capitalize">{m}</label>
              </div>
            )
          })}
        </div>

        {/* 
        <div className="flex-col justify-start items-start gap-3 flex">
          <div className="text-violet-900 text-sm font-semibold leading-tight">Checks</div>
          <button className="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center gap-2 inline-flex focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800" type="button">
            <div className="text-gray-700 text-sm font-medium leading-tight">Add Filter</div>
          </button>
        </div> 
        */}

        <div className="flex-col justify-start items-start gap-3 flex">
          <div className="text-violet-900 text-sm font-semibold leading-tight">Added</div>
          <div date-rangepicker className="flex-col justify-start items-start gap-4 flex">
            <div className="flex-col justify-start items-start gap-1 flex">
              <div className="text-gray-500 text-sm font-semibold leading-tight">From</div>
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input name="start" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-1 flex">
              <div className="text-gray-500 text-sm font-semibold leading-tight">To</div>
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input name="end" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
