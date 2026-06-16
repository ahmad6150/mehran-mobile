import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiShoppingBag, FiHome, FiPackage } from 'react-icons/fi'
import { MdPhoneAndroid } from 'react-icons/md'

const confettiDots = ['bg-orange-400', 'bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-pink-400'].map((color) => ({
  color,
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
}))

const OrderSuccess = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">

        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 lg:p-12 text-center">

          {/* Animated Check Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-green-500" size={40} />
              </div>
            </div>
            {/* Confetti dots */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32">
              {confettiDots.map((dot, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${dot.color} opacity-70`}
                  style={{
                    top: dot.top,
                    left: dot.left,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Order Placed! 🎉
          </h1>
          <p className="text-gray-500 mb-2">
            Thank you for shopping with <span className="text-orange-600 font-semibold">Mehran Mobile</span>!
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Your order has been confirmed and will be delivered soon.
            You can track your order in My Orders section.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: '📦', title: 'Processing', desc: 'Order confirmed' },
              { icon: '🚚', title: 'Shipping', desc: '2-3 business days' },
              { icon: '✅', title: 'Delivered', desc: 'To your doorstep' },
            ].map((step, i) => (
              <div key={i} className={`p-3 rounded-2xl ${i === 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                <div className="text-2xl mb-1">{step.icon}</div>
                <p className={`text-xs font-semibold ${i === 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              to="/orders"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
            >
              <FiPackage size={20} />
              Track My Order
            </Link>
            <Link
              to="/shop"
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-600 py-3.5 rounded-xl font-semibold text-sm transition"
            >
              <FiShoppingBag size={18} />
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-orange-600 py-2 text-sm transition"
            >
              <FiHome size={16} />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <MdPhoneAndroid className="text-orange-500" />
            <span>Mehran Mobile — Your Trusted Mobile Shop</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess