import React, { createContext, useState, useContext, useEffect } from 'react'

type GenericState<T = Record<string, any>> = Loading<T> | Loaded<T> | Error

export interface Repo {
  index: RepositoryInfoStatus;
  excerpt: GenericState<Excerpt>;
  details: GenericState<Details>;
}
type State = GenericState<{ repos: Repo[] }>;
type GitHubId = string;
type DateIsoString = string;
interface RepositoryInfoStatus {
  id: GitHubId;
  name: string;
  rating: null | number;
  createdAt: DateIsoString;
  updatedAt: DateIsoString;
}
interface Excerpt {
  // TODO
}

interface Details {
  // TODO
}

interface Loading<T = Record<string, any>> {
  state: 'loading';
}
interface Loaded<T = Record<string, any>> {
  state: 'loaded';
  data: T;
}
interface Error {
  state: 'error',
  message: string;
}

const DataContext = createContext<State>({
  state: 'loading'
})
const Data = (props: { children: React.ReactNode }) => {
  let state: State, setState: React.Dispatch<React.SetStateAction<State>>;

  const initState = lazyLoader<{ repos: Repo[] }>(
    async () => {
      const data = await loadData<RepositoryInfoStatus[]>('data/index.json')
      return {
        repos: data.map((repo) => {
          const item = { 
            index: repo,
            excerpt: lazyLoader<Excerpt>(
              () => loadData(`data/${repo.id}.excerpt.json`),
              (excerpt) => updateRepoState<GenericState<Excerpt>>(item, 'excerpt', excerpt, setState)
            ),
            details: lazyLoader<Details>(
              () => loadData(`data/${repo.id}.details.json`),
              (details) => updateRepoState<GenericState<Details>>(item, 'details', details, setState)
            )
          }

          return item
        })
      }
    },
    (newState) => {
      setState(newState)
    }
  )

  const x = useState<State>(initState)
  state = x[0];
  setState = x[1];

  return <DataContext.Provider value={state}>{props.children}</DataContext.Provider>
}

export const DataProvider = Data
export const useLazyData = () => useContext(DataContext)

async function loadData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json();
}

/**
 * @param loader 
 * function to load the object properties from 'data/somefile.json'
 * 
 * @param onUpdate  
 * callback when data is loaded or on error. Returns new state for useState
 * 
 * @returns initState
 * 
 * es6 proxy for init react state
 * Object appears to be:
 *  {state: loading}
 * 
 * and it's of type GenericState where state could be 'loading', 'loaded' or 'error'
 */
function lazyLoader<T>(
  loader: () => Promise<T>,
  onUpdate: (data: GenericState<T>
  ) => void): GenericState<T> {
  return new Proxy({} as GenericState<T>, {
    get(target: any, prop) {
      if (target.state === undefined) {
        target.state = 'loading'

        loader()
          .then((data) => {
            onUpdate({
              state: 'loaded',
              data
            })
          })
          .catch(((err) => {
            console.error(err)

            onUpdate({
              state: 'error',
              message: 'Unable to load data'// TODO error codes? 
            })
          }))
      }

      return prop === 'state' ? 'loading' : undefined
    }
  });
}

function updateRepoState<T = any>(repo: Repo, key: string, newState: T, setState: React.Dispatch<React.SetStateAction<State>>) {
  setState((prevState) => {
    // On error and loading states there is no data to update
    if (prevState.state !== 'loaded') {
      return prevState;
    }
    
    return {
      ...prevState,
      data: {
        ...prevState.data,
        repos: prevState.data.repos.map((prevRepo) => {
          if (prevRepo.index.id === repo.index.id) {
            return {
              ...repo,
              [key]: newState
            }
          }
          return prevRepo
        })
      }
    }
  })
}