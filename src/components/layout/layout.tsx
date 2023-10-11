import React from 'react'
import { Header } from './header'

export default function Layout({ children }) {
  return (
    <div className="w-full relative">
      <Header />
      <div className="relative flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1 flex w-full lg:max-w-5xl xl:max-w-7xl 2xl:max-w-8xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
