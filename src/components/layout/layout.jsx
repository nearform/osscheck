import { Header } from './header.jsx'
import { HeroPattern } from "../patterns/hero";
import Footer from './footer.jsx'

export default function Layout({ children }) {
  return (
    <div className='lg:ml-72 xl:ml-80'>
      <Header />
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-16">
          <HeroPattern />
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
