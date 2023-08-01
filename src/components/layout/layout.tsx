import React from "react"
import { Header } from './header.js'
import Footer from './footer.js'

export default function Layout({ children }) {
  return (
    <div className='lg:ml-56 xl:ml-56'>
      <Header />
      <div className="relative pt-14 flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
