import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import Sidebar from '../../component/admin/Sidebar'
import { useAppContext } from '../../context/AppContext'

function Layout() {
  const navigate = useNavigate()
  const { axios, setToken } = useAppContext()

  // ⬅️ Logout handler
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    delete axios.defaults.headers.common['Authorization']
    navigate('/admin')
  }

  // ⬅️ Handle token expiry globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.data?.message === 'Invalid or expired token') {
          localStorage.removeItem('token')
          setToken(null)
          delete axios.defaults.headers.common['Authorization']
          navigate('/admin')
        }
        return Promise.reject(err)
      }
    )

    // ⬅️ Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  return (
    <>
      {/* ===== Top Bar ===== */}
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <img
          src={assets.logo}
          alt=""
          className="w-32 sm:w-40 cursor-pointer"
          onClick={() => navigate('/')}
        />

        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* ===== Sidebar + Content ===== */}
      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout
