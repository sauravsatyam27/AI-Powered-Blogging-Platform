import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// ⬅️ Global axios base configuration
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.timeout = 60000

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // ⬅️ Navigation hook available globally
  const navigate = useNavigate()

  // ⬅️ Global states
  const [token, setToken] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [blogs, setBlogs] = useState([])
  const [input, setInput] = useState('')

  const clearAdminSession = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    delete axios.defaults.headers.common['Authorization']
  }, [])

  const setAdminSession = useCallback((adminToken) => {
    localStorage.setItem('token', adminToken)
    setToken(adminToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`
  }, [])

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    try {
      // ⬅️ Public blogs fetch (homepage/blog list)
      const { data } = await axios.get('/api/blog/all')

      if (data.success) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /* ================= INIT ================= */
  useEffect(() => {
    const initializeApp = async () => {
      fetchBlogs()

      // ⬅️ Token localStorage se uthaya ja raha hai
      const storedToken = localStorage.getItem('token')

      if (!storedToken) {
        clearAdminSession()
        setAuthLoading(false)
        return
      }

      try {
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${storedToken}`

        const { data } = await axios.get('/api/admin/verify')

        if (data.success) {
          setToken(storedToken)
        } else {
          clearAdminSession()
        }
      } catch {
        clearAdminSession()
      } finally {
        setAuthLoading(false)
      }
    }

    initializeApp()
  }, [clearAdminSession])

  // ⬅️ Values exposed to entire application
  const value = {
    axios,
    navigate,
    token,
    setToken,
    authLoading,
    clearAdminSession,
    setAdminSession,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// ⬅️ Custom hook for easy context access
export const useAppContext = () => useContext(AppContext)
