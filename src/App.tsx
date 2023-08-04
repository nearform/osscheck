import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import HomeRoute from './routes/home'
import IntroductionRoute from './routes/introduction'
import DocumentationRoute from './routes/documentation'
import RepoRoute from './routes/repo'
import { DataProvider } from './providers/data'
import { UIProvider } from './providers/ui'

export default function App() {
  return (
    <DataProvider>
      <UIProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/introduction" element={<IntroductionRoute />} />
            <Route path="/documentation" element={<DocumentationRoute />} />
            <Route path="/repo/:repo" element={<RepoRoute />} />
          </Routes>
        </Layout>
      </UIProvider>
    </DataProvider>
  )
}
