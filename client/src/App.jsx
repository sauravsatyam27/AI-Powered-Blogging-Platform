import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import ListBlog from './pages/admin/ListBlog'
import AddBlog from './pages/admin/AddBlog'
import Comments from './pages/admin/Comments'
import Login from './component/admin/Login'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import Loader from './component/Loader'

function App() {
  const { token, authLoading } = useAppContext()

  if (authLoading) {
    return <Loader />
  }

  return (
    <div className="">
      <Toaster />

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />

        {/* ===== ADMIN ROUTES ===== */}
        {token ? (
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="addBlog" element={<AddBlog />} />
            <Route path="listBlog" element={<ListBlog />} />
            <Route path="comments" element={<Comments />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Login />} />
        )}
      </Routes>
    </div>
  )
}

export default App
