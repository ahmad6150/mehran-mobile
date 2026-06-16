import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import API from '../../api/axios'
import { useState } from 'react'
import {
  FiPackage, FiShoppingBag, FiClock,
  FiTruck, FiCheckCircle, FiXCircle,
  FiArrowRight, FiMapPin
} from 'react-icons/fi'

const statusConfig = {
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: <FiClock size={14} /> },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-700', icon: <FiTruck size={14} /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <FiCheckCircle size={14} /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <FiXCircle size={14} /> },
}

const paymentConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
}

const MyOrders = () => {
  const { user } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/api/orders/my')
        setOrders(data.orders)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-full bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Hello {user?.name}! You have {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-orange-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping!</p>
            <Link
              to="/shop"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition"
            >
              <FiShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">

                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className="text-sm font-bold text-orange-600">
                      Rs. {order.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Order Status */}
                    <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[order.orderStatus]?.color}`}>
                      {statusConfig[order.orderStatus]?.icon}
                      {statusConfig[order.orderStatus]?.label}
                    </span>
                    {/* Payment Status */}
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${paymentConfig[order.paymentStatus]?.color}`}>
                      {paymentConfig[order.paymentStatus]?.label}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/60x60'}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Rs. {item.price.toLocaleString()} × {item.qty}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800 text-sm flex-shrink-0">
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">

                  {/* Shipping Address */}
                  <div className="flex items-start gap-2">
                    <FiMapPin className="text-orange-500 mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-gray-500">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Payment: </span>
                    {order.paymentMethod === 'stripe' ? '💳 Card' : '💵 Cash on Delivery'}
                  </div>

                  {/* Progress Bar */}
                  {order.orderStatus !== 'cancelled' && (
                    <div className="w-full mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all"
                          style={{
                            width: order.orderStatus === 'processing' ? '33%'
                              : order.orderStatus === 'shipped' ? '66%'
                              : '100%'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shop More */}
        {orders.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
            >
              <FiShoppingBag size={18} />
              Continue Shopping
              <FiArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders