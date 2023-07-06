import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from '@/components/layout/layout'
import HomeRoute from './routes/home'
import IntroductionRoute from './routes/introduction'
import DocumentationRoute from './routes/documentation'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomeRoute />} />
        <Route path='/introduction' element={<IntroductionRoute />} />
        <Route path='/documentation' element={<DocumentationRoute />} />
      </Routes>
    </Layout>
  )
}
