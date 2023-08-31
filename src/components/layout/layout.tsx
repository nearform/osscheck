import React from 'react'
import { Header } from './header'

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div className="relative flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1 flex w-full lg:max-w-5xl xl:max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
