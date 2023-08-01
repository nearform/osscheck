import React, { useRef } from 'react'
import { Link, useResolvedPath } from 'react-router-dom'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

import { useIsInsideMobileNavigation } from '@/components/layout/mobileNavigation'
import { Tag } from '@/components/primitives/tag'
import { remToPx } from '@/lib/remToPx'
import { useData } from '../../providers/data'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ to, children }) {
  return (
    <li className="md:hidden">
      <Link
        to={to}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({ to, tag, active, isAnchorLink = false, children }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex(link => link.to === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, data, className }) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathName, sections] = useInitialValue(
    [useResolvedPath()],
    isInsideMobileNavigation
  )

  let isActiveGroup = group.links
    ? group.links.findIndex(link => link.to === pathName) !== -1
    : false

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathName} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathName} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links
            ? group.links.map(link => (
                <motion.li key={link.to} layout="position" className="relative">
                  <NavLink to={link.to} active={link.to === pathName}>
                    {link.title}
                  </NavLink>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {link.to === pathName && sections.length > 0 && (
                      <motion.ul
                        role="list"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 0.1 }
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.15 }
                        }}
                      >
                        {sections.map(section => (
                          <li key={section.id}>
                            <NavLink
                              to={`${link.to}#${section.id}`}
                              tag={section.tag}
                              isAnchorLink
                            >
                              {section.title}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))
            : data
            ? data.map(repo => {
                const nameParts = repo.name.split('/')
                const name = nameParts[nameParts.length - 1]
                const route = `/repo/${name}`
                return (
                  <motion.li
                    key={name}
                    layout="position"
                    className="relative"
                  >
                    <NavLink to={route} active={route === pathName}>
                      {name}
                    </NavLink>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {route === pathName && sections.length > 0 && (
                        <motion.ul
                          role="list"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            transition: { delay: 0.1 }
                          }}
                          exit={{
                            opacity: 0,
                            transition: { duration: 0.15 }
                          }}
                        >
                          {sections.map(section => (
                            <li key={section.id}>
                              <NavLink
                                to={`${route}#${section.id}`}
                                tag={section.tag}
                                isAnchorLink
                              >
                                {section.title}
                              </NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )
              })
            : null}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
  {
    title: 'Guides',
    links: [
      { title: 'Introduction', to: '/introduction' },
      { title: 'Documentation', to: '/documentation' }
    ]
  },
  {
    title: 'Repositories',
    data: true
  }
]

export function Navigation(props) {
  const { repos } = useData()
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem to="/">Home</TopLevelNavItem>
        <TopLevelNavItem to="/introduction">Introduction</TopLevelNavItem>
        <TopLevelNavItem to="/documentation">Documentation</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            data={group.data ? repos : null}
            className={groupIndex === 0 && 'md:mt-0'}
          />
        ))}
      </ul>
    </nav>
  )
}
