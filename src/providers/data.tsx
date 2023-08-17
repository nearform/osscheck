import React, { createContext, useState, useContext, useEffect } from 'react'

export type Scorecard = {
  date: string
  score: string
  scorecard: {
    commit: string
    version: string
  }
  repo: {
    name: string
    commit: string
  }
  metadata: any[]
  checks: {
    name: string
    reason: string
    score: number
    details: any[]
    documentation: {
      short: string
      url: string
    }
  }[]
}

interface State {
  loading: boolean
  repos?: { name: string }[]
}

interface DataContextValue extends State {
  loadRepoData: (repo: string) => Promise<Scorecard>
}

const initialState = {
  loading: true
}

export const DataContext = createContext(initialState as DataContextValue)

export interface API {
  children: any
}

async function loadData() {
  const availableReposResponse = await fetch('./repos.json')
  const availableRepos = await availableReposResponse.json()
  return {
    availableRepos
  }
}

export const Data = ({ children }: API) => {
  const [state, setState] = useState<State>(initialState)

  useEffect(() => {
    loadData().then(data => {
      setState({
        loading: false,
        repos: data.availableRepos
      })
    })
  }, [])

  async function loadRepoData(repo: string) {
    const req = await fetch(`${import.meta.env.VITE_SCORECARD_API_BASE}github.com/nearform/${repo}`)
    const data = await req.json()
    return data
  }

  const value: DataContextValue = {
    ...state,
    loadRepoData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const DataProvider = Data

export const useData = () => useContext(DataContext)
