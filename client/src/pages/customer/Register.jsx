import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../../redux/slices/authSlice'
import { MdPhoneAndroid } from 'react-icons/md'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector((state) => state.auth)

  useEffect(() => { if (user) navigate('/') }, [user, navigate])
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill all required fields')
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    }))
  }

  return (
    <div className="min-h-full flex">

      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Background Circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
              <MdPhoneAndroid className="text-white text-5xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Join Mehran Mobile</h1>
          <p className="text-orange-100 text-lg mb-8">Create your account today</p>

          <div className="space-y-4 text-left">
            {[
              { icon: '🎁', text: 'Exclusive Deals for Members' },
              { icon: '📦', text: 'Track Your Orders Easily' },
              { icon: '💳', text: 'Secure & Fast Checkout' },
              { icon: '🔔', text: 'Get Notified on New Arrivals' },
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <MdPhoneAndroid className="text-orange-600 text-4xl" />
            <span className="text-3xl font-bold text-gray-800">Mehran<span className="text-orange-600">Mobile</span></span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">Fill in the details below to get started</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiUser size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiPhone size={18} />
                  </div>
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className={`text-xs font-medium flex items-center gap-1 ${
                  formData.password === formData.confirmPassword
                    ? 'text-green-600' : 'text-red-500'
                }`}>
                  {formData.password === formData.confirmPassword
                    ? '✅ Passwords match'
                    : '❌ Passwords do not match'}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white py-3.5 rounded-xl font-semibold text-sm transition duration-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <hr className="flex-1 border-gray-100" />
              <span className="text-xs text-gray-400 font-medium">Already have an account?</span>
              <hr className="flex-1 border-gray-100" />
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 py-3.5 rounded-xl font-semibold text-sm transition duration-200"
            >
              Login to Existing Account
              <FiArrowRight size={18} />
            </Link>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register