import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../redux/slices/authSlice'
import { MdPhoneAndroid } from 'react-icons/md'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.auth)

  useEffect(() => { if (user) navigate('/') }, [user, navigate])
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return toast.error('Please fill all fields')
    dispatch(loginUser(formData))
  }

  return (
    <div className="min-h-full flex">

      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Background Circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
              <MdPhoneAndroid className="text-white text-5xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Mehran Mobile</h1>
          <p className="text-orange-100 text-lg mb-8">Pakistan's Premium Mobile Store</p>

          <div className="space-y-4 text-left">
            {[
              { icon: '📱', text: 'Latest Smartphones & Accessories' },
              { icon: '🚚', text: 'Fast Delivery Across Pakistan' },
              { icon: '✅', text: '100% Genuine Products' },
              { icon: '💰', text: 'Best Prices Guaranteed' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white bg-opacity-15 rounded-xl px-4 py-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <MdPhoneAndroid className="text-orange-600 text-4xl" />
            <span className="text-3xl font-bold text-gray-800">Mehran<span className="text-orange-600">Mobile</span></span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs text-orange-600 hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white py-3.5 rounded-xl font-semibold text-sm transition duration-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Account
                    <FiArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <hr className="flex-1 border-gray-100" />
              <span className="text-xs text-gray-400 font-medium">Don't have an account?</span>
              <hr className="flex-1 border-gray-100" />
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 py-3.5 rounded-xl font-semibold text-sm transition duration-200"
            >
              Create New Account
              <FiArrowRight size={18} />
            </Link>
          </div>

          {/* Admin Link */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Are you an admin?{' '}
            <Link to="/admin/login" className="text-orange-500 hover:underline font-medium">
              Admin Panel Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login