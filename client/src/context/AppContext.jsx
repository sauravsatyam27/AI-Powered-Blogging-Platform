import React, { createContext, useContext, useEffect, useState } from 'react'
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
  const [blogs, setBlogs] = useState([])
  const [input, setInput] = useState('')

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
    // ⬅️ Initial blog load on app start
    fetchBlogs()

    // ⬅️ Token localStorage se uthaya ja raha hai
    const storedToken = localStorage.getItem('token')

    if (storedToken) {
      // ⬅️ Token available → user already logged in
      setToken(storedToken)

      // ⬅️ Default Authorization header set
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${storedToken}`
    } else {
      // ⬅️ No token → clean auth state
      setToken(null)
      delete axios.defaults.headers.common['Authorization']
    }
  }, [])

  // ⬅️ Values exposed to entire application
  const value = {
    axios,
    navigate,
    token,
    setToken,
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
