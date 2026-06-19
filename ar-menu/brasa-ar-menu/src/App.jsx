import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Home from './pages/Home'
import DishPage from './pages/DishPage'

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </LanguageProvider>
  )
}
