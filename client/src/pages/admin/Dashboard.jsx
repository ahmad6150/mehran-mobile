import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import {
  FiPackage, FiShoppingBag,
  FiDollarSign, FiTrendingUp, FiArrowRight,
  FiClock, FiTruck, FiCheckCircle, FiXCircle,
  FiPlus, FiSmartphone, FiExternalLink
} from 'react-icons/fi'
import { MdPhoneAndroid } from 'react-icons/md'
import AdminSidebar from './AdminSidebar'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          API.get('/api/orders/stats/dashboard'),
          API.get('/api/orders?limit=5'),
        ])
        setStats(statsRes.data.stats)
        setRecentOrders(ordersRes.data.orders)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statusConfig = {
    processing: { color: 'bg-yellow-100 text-yellow-700', icon: <FiClock size={12} /> },
    shipped: { color: 'bg-blue-100 text-blue-700', icon: <FiTruck size={12} /> },
    delivered: { color: 'bg-green-100 text-green-700', icon: <FiCheckCircle size={12} /> },
    cancelled: { color: 'bg-red-100 text-red-700', icon: <FiXCircle size={12} /> },
  }

  if (loading) return (
    <div className="flex min-h-full bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-full bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, Admin!</p>
            </div>
            <div className="flex items-center gap-2">
              <MdPhoneAndroid className="text-orange-600 text-2xl" />
              <span className="font-bold text-gray-800">Mehran<span className="text-orange-600">Mobile</span></span>
            </div>
          </div>
        </div>

        <div className="p-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: 'Total Revenue',
                value: `Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`,
                icon: <FiDollarSign size={24} />,
                color: 'bg-green-50 text-green-600',
                bg: 'from-green-500 to-emerald-600',
              },
              {
                title: 'Total Orders',
                value: stats?.totalOrders || 0,
                icon: <FiShoppingBag size={24} />,
                color: 'bg-blue-50 text-blue-600',
                bg: 'from-blue-500 to-blue-600',
              },
              {
                title: 'Pending Orders',
                value: stats?.pendingOrders || 0,
                icon: <FiClock size={24} />,
                color: 'bg-yellow-50 text-yellow-600',
                bg: 'from-yellow-500 to-orange-500',
              },
              {
                title: 'Delivered',
                value: stats?.deliveredOrders || 0,
                icon: <FiCheckCircle size={24} />,
                color: 'bg-orange-50 text-orange-600',
                bg: 'from-orange-500 to-red-500',
              },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <FiTrendingUp className="text-gray-300" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Add Product', link: '/admin/products/add', icon: <FiPlus size={24} />, color: 'bg-slate-700' },
              { label: 'View Products', link: '/admin/products', icon: <FiSmartphone size={24} />, color: 'bg-sky-600' },
              { label: 'View Orders', link: '/admin/orders', icon: <FiPackage size={24} />, color: 'bg-indigo-600' },
              { label: 'Visit Store', link: '/', icon: <FiExternalLink size={24} />, color: 'bg-violet-600' },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.link}
                className={`${action.color} text-white rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition`}
              >
                {action.icon}
                <span className="font-semibold text-sm">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-orange-600 text-sm font-semibold flex items-center gap-1 hover:text-orange-700 transition"
              >
                View All <FiArrowRight size={14} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <FiPackage className="text-gray-300 text-5xl mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 md:hidden p-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gray-500 truncate">{order.user?.name} · {order.user?.email}</p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[order.orderStatus]?.color}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="rounded-2xl bg-gray-50 p-3">
                          <p className="text-xs uppercase tracking-wide text-gray-500">Items</p>
                          <p className="font-semibold text-gray-900">{order.items.length}</p>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-3">
                          <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
                          <p className="font-semibold text-orange-600">Rs. {order.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="rounded-2xl bg-gray-50 px-3 py-2">{order.items.length} item(s)</span>
                        <span className="rounded-2xl bg-gray-50 px-3 py-2">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-semibold text-gray-800">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{order.user?.name}</p>
                              <p className="text-xs text-gray-500">{order.user?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{order.items.length} item(s)</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-orange-600">
                              Rs. {order.totalPrice.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1 w-fit text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig[order.orderStatus]?.color}`}>
                              {statusConfig[order.orderStatus]?.icon}
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard