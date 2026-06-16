import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/slices/authSlice'
import { MdPhoneAndroid } from 'react-icons/md'
import {
  FiGrid, FiPackage,
  FiLogOut, FiExternalLink, FiPlusCircle,
  FiMenu, FiX
} from 'react-icons/fi'

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/admin/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid size={20} /> },
    { label: 'Products', path: '/admin/products', icon: <MdPhoneAndroid size={20} /> },
    { label: 'Add Product', path: '/admin/products/add', icon: <FiPlusCircle size={20} /> },
    { label: 'Orders', path: '/admin/orders', icon: <FiPackage size={20} /> },
  ]

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-3 rounded-2xl bg-gray-900 text-white shadow-lg transition ${sidebarOpen ? 'hidden' : 'block'}`}
      >
        <FiMenu size={22} />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 max-w-full bg-gray-900 min-h-screen flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-64`}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdPhoneAndroid className="text-orange-500 text-2xl" />
            <div>
              <span className="text-white font-bold">Mehran</span>
              <span className="text-orange-500 font-bold">Mobile</span>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition"
            aria-label="Close navigation"
          >
            <FiX size={20} />
          </button>
        </div>

      {/* Admin Info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-xs">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  location.pathname === item.path
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <FiExternalLink size={20} />
            Visit Store
          </Link>
          <button
            onClick={() => { setSidebarOpen(false); handleLogout() }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </nav>
    </div>
    </>
  )
}

export default AdminSidebar