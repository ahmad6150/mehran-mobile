import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../redux/slices/authSlice'
import { MdPhoneAndroid } from 'react-icons/md'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin/dashboard')
    else if (user) navigate('/')
  }, [user, navigate])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return toast.error('Please fill all fields')
    dispatch(loginUser(formData))
  }

  return (
    <div className="min-h-full bg-gray-900 flex items-center justify-center px-4">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500 opacity-5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
            <FiShield className="text-white" size={28} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <MdPhoneAndroid className="text-orange-500 text-3xl" />
            <span className="text-2xl font-bold text-white">Mehran<span className="text-orange-500">Mobile</span></span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Admin Panel — Authorized Access Only</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <h2 className="text-xl font-bold text-white mb-6">Admin Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  placeholder="admin@mehranmobile.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <FiShield size={18} />
                  Login to Admin Panel
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Store */}
        <p className="text-center text-sm text-gray-500 mt-6">
          <a href="/" className="text-orange-500 hover:underline">← Back to Store</a>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin