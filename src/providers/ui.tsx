import React, { createContext, useState, useContext } from 'react'

export enum Sort {
  'alphabetical_asc' = 'Alphabetical (A-Z)',
  'alphabetical_desc' = 'Alphabetical (Z-A)',
  'score_asc' = 'Score (High - Low)',
  'score_desc' = 'Score (Low - High)'
}

export enum Level {
  'Graduated' = 'Graduated',
  'Incubating' = 'Incubating',
  'Sandbox' = 'Sandbox'
}

export enum RatingFilter {
  TOP = '100-75',
  MIDDLE = '74-50',
  LOWER = '49-25',
  BOTTOM = '24-0'
}

export interface State {
  limit: number
  sort: Sort
  term: string
  rating: number
  pageIndex: number
  activeFilter: boolean
  ratingFilter: RatingFilter[]
}

interface UIContextValue extends State {
  setUiState: React.Dispatch<React.SetStateAction<State>>
}

const initialState = {
  limit: 10,
  sort: Sort.score_asc,
  term: '',
  rating: 0,
  pageIndex: 0,
  activeFilter: false,
  ratingFilter:  ['100-75', '74-50', '49-25', '24-0'] as RatingFilter[]
}

export const UIContext = createContext(initialState as UIContextValue)

export interface API {
  children: any
}

export const UI = ({ children }: API) => {
  const [state, setState] = useState<State>(initialState)

  const value: UIContextValue = {
    ...state,
    setUiState: setState
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const UIProvider = UI

export const useUI = () => useContext(UIContext)
