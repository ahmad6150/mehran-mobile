import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/slices/authSlice'
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiUser, FiPackage, FiLogOut } from 'react-icons/fi'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${searchQuery}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <h1
              className="text-xl font-bold text-gray-900 tracking-tight transition group-hover:text-orange-600 cursor-pointer"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Mehran<span className="text-orange-600">Mobile</span>
            </h1>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            <Link to="/" className="text-base font-semibold text-gray-700 hover:text-gray-900 transition tracking-wide">
              Home
            </Link>
            <Link to="/shop" className="text-base font-semibold text-gray-700 hover:text-gray-900 transition tracking-wide">
              Shop
            </Link>
            <Link to="/shop?category=phone" className="text-base font-semibold text-gray-700 hover:text-gray-900 transition tracking-wide">
              Phones
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <FiSearch size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 transition">
              <FiShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition">
                  <FiUser size={20} />
                  <span className="hidden lg:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-lg py-2 hidden group-hover:block">
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition"
                    >
                      <FiPackage size={14} /> Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition"
                  >
                    <FiPackage size={14} /> My Orders
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:block text-sm font-semibold text-gray-900 hover:text-orange-600 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              className="lg:hidden text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for phones, chargers, cables..."
                autoFocus
                className="flex-1 border-b-2 border-gray-200 focus:border-orange-600 outline-none py-2 text-sm text-gray-900 placeholder-gray-400 bg-transparent transition"
              />
              <button
                type="submit"
                className="text-xs font-semibold uppercase tracking-widest text-gray-900 hover:text-orange-600 transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-4">
            {[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: 'Phones', path: '/shop?category=phone' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="block text-base font-semibold text-gray-700 hover:text-gray-900 py-1 transition"
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
              >
                Login / Register
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar