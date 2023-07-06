import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Navigation } from './navigation.jsx'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore
} from '@/components/layout/mobileNavigation.jsx'
import { ModeToggle } from '@/components/layout/modeToggle.jsx'

function TopLevelNavItem({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (
    <div className="lg:ml-72 xl:ml-80">
      <motion.header
        layoutScroll
        className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
      >
        <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
          <div className="hidden lg:flex">
            <Link to="/" aria-label="Home">
              <h1 className="self-center ml-3 text-2xl font-semibold whitespace-nowrap dark:text-white">OSSHealth</h1>
            </Link>
          </div>
          <motion.div
            ref={ref}
            className={clsx(
              className,
              'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
              !isInsideMobileNavigation &&
              'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
              isInsideMobileNavigation
                ? 'bg-white dark:bg-zinc-900'
                : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]'
            )}
            style={{
              '--bg-opacity-light': bgOpacityLight,
              '--bg-opacity-dark': bgOpacityDark,
            }}
          >
            <div
              className={clsx(
                'absolute inset-x-0 top-full h-px transition',
                (isInsideMobileNavigation || !mobileNavIsOpen) &&
                'bg-zinc-900/7.5 dark:bg-white/7.5'
              )}
            />
            <div className="flex items-center gap-5 lg:hidden">
              <MobileNavigation />
              <Link to="/" aria-label="Home">
                <h1 className="self-center ml-3 font-semibold whitespace-nowrap dark:text-white">OSSHealth</h1>
              </Link>
            </div>
            <div className="flex items-center gap-5">
              <nav className="hidden md:block">
                <ul role="list" className="flex items-center gap-8">
                  <TopLevelNavItem to="/introduction">Introduction</TopLevelNavItem>
                  <TopLevelNavItem to="/documentation">Documentation</TopLevelNavItem>
                </ul>
              </nav>
              <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
              <div className="flex gap-4">
                <ModeToggle />
              </div>
            </div>
          </motion.div>

          <Navigation className="hidden lg:mt-10 lg:block" />
        </div>
      </motion.header>
    </div>
  )
})
