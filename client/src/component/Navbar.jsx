import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

function Navbar() {
  const navigate = useNavigate()
  const { token } = useAppContext()

  // ⬅️ Admin / Dashboard button handler
  const handleAdminClick = () => {
    navigate('/admin')
  }

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      {/* ⬅️ Logo → Home */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
      />

      {/* ⬅️ Login / Dashboard button */}
      <button
        onClick={handleAdminClick}
        className="flex items-center gap-2 rounded-full text-sm bg-primary text-white px-10 py-2.5"
      >
        {token ? 'Dashboard' : 'Login'}
        <img src={assets.arrow} className="w-3" alt="arrow" />
      </button>
    </div>
  )
}

export default Navbar
