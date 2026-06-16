import { useCallback, useEffect, useState } from 'react'
import API from '../../api/axios'
import AdminSidebar from './AdminSidebar'
import {
  FiSearch, FiPackage, FiClock, FiTruck,
  FiCheckCircle, FiXCircle, FiEye, FiFilter,
  FiDollarSign, FiShoppingBag, FiRefreshCw
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const statusConfig = {
  processing: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: <FiClock size={14} />,
    dot: 'bg-yellow-500'
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <FiTruck size={14} />,
    dot: 'bg-blue-500'
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <FiCheckCircle size={14} />,
    dot: 'bg-green-500'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <FiXCircle size={14} />,
    dot: 'bg-red-500'
  },
}

const paymentConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/api/orders', {
        params: {
          page,
          limit: 10,
          status: statusFilter,
          paymentStatus: paymentFilter,
        }
      })
      setOrders(data.orders)
      setPages(data.pages)
      setTotal(data.total)
      setTotalRevenue(data.totalRevenue)
    } catch {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, paymentFilter])

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders()
    }
    loadOrders()
  }, [fetchOrders])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdateLoading(orderId)
      await API.put(`/api/orders/${orderId}/status`, { status: newStatus })
      toast.success(`Order status updated to ${newStatus}!`)
      fetchOrders()
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus })
      }
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdateLoading(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (!search) return true
    return (
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const stats = [
    { label: 'Total Orders', value: total, icon: <FiShoppingBag size={22} />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: <FiDollarSign size={22} />, color: 'text-green-600 bg-green-50' },
    { label: 'Processing', value: orders.filter(o => o.orderStatus === 'processing').length, icon: <FiClock size={22} />, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length, icon: <FiCheckCircle size={22} />, color: 'text-green-600 bg-green-50' },
  ]

  return (
    <div className="flex min-h-full bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500">{total} total orders</p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition hover:border-orange-500"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by order ID, customer name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FiFilter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => { setPaymentFilter(e.target.value); setPage(1) }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">

            {/* Orders Table */}
            <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${selectedOrder ? 'flex-1' : 'w-full'}`}>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <FiPackage className="text-gray-300 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                            <th
                              key={h}
                              className={
                                `text-left text-xs font-semibold text-gray-500 px-4 py-4 uppercase tracking-wide whitespace-nowrap ${
                                  h === 'Payment' || h === 'Date' ? 'hidden md:table-cell' : ''
                                }`
                              }
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map((order) => (
                          <tr
                            key={order._id}
                            className={`hover:bg-gray-50 transition cursor-pointer ${selectedOrder?._id === order._id ? 'bg-orange-50' : ''}`}
                            onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                          >
                            {/* Order ID */}
                            <td className="px-4 py-4">
                              <span className="font-mono text-sm font-bold text-gray-800">
                                #{order._id.slice(-8).toUpperCase()}
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{order.user?.name}</p>
                                <p className="text-xs text-gray-500">{order.user?.email}</p>
                              </div>
                            </td>

                            {/* Items */}
                            <td className="px-4 py-4">
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item, i) => (
                                  <img
                                    key={i}
                                    src={item.image || 'https://via.placeholder.com/30'}
                                    alt=""
                                    className="w-8 h-8 rounded-lg border-2 border-white object-cover"
                                  />
                                ))}
                                {order.items.length > 3 && (
                                  <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Total */}
                            <td className="px-4 py-4">
                              <span className="font-bold text-orange-600 text-sm">
                                Rs. {order.totalPrice.toLocaleString()}
                              </span>
                            </td>

                            {/* Payment */}
                            <td className="hidden md:table-cell px-4 py-4">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentConfig[order.paymentStatus]?.color}`}>
                                {paymentConfig[order.paymentStatus]?.label}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                              <span className={`flex items-center gap-1.5 w-fit text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConfig[order.orderStatus]?.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[order.orderStatus]?.dot}`}></span>
                                {statusConfig[order.orderStatus]?.label}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="hidden md:table-cell px-4 py-4">
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="px-4 py-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedOrder(selectedOrder?._id === order._id ? null : order)
                                }}
                                className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition"
                              >
                                <FiEye size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
                      {[...Array(pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${
                            page === i + 1
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Order Detail Panel */}
            {selectedOrder && (
              <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                  {/* Panel Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm">Order Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiXCircle size={18} />
                    </button>
                  </div>

                  <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">

                    {/* Order ID & Date */}
                    <div>
                      <p className="font-mono text-lg font-bold text-gray-900">
                        #{selectedOrder._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Customer */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Customer</p>
                      <p className="font-semibold text-gray-800 text-sm">{selectedOrder.user?.name}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.user?.phone}</p>
                    </div>

                    {/* Shipping */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Shipping Address</p>
                      <p className="font-semibold text-gray-800 text-sm">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-xs text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                      <p className="text-xs text-gray-600">{selectedOrder.shippingAddress.street}</p>
                      <p className="text-xs text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Items</p>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img
                              src={item.image || 'https://via.placeholder.com/40'}
                              alt=""
                              className="w-10 h-10 object-cover rounded-xl border flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-500">Rs. {item.price.toLocaleString()} × {item.qty}</p>
                            </div>
                            <p className="text-xs font-bold text-gray-800">
                              Rs. {(item.price * item.qty).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items</span>
                          <span className="font-medium">Rs. {selectedOrder.itemsPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">
                            {selectedOrder.shippingPrice === 0 ? 'FREE' : `Rs. ${selectedOrder.shippingPrice}`}
                          </span>
                        </div>
                        <hr className="border-orange-200" />
                        <div className="flex justify-between font-bold text-sm">
                          <span className="text-gray-800">Total</span>
                          <span className="text-orange-600">Rs. {selectedOrder.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Payment Method</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {selectedOrder.paymentMethod === 'stripe' ? '💳 Card' : '💵 COD'}
                      </span>
                    </div>

                    {/* Update Status */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                        Update Status
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                            disabled={
                              selectedOrder.orderStatus === status ||
                              updateLoading === selectedOrder._id
                            }
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition capitalize flex items-center justify-center gap-1.5 ${
                              selectedOrder.orderStatus === status
                                ? `${statusConfig[status].color} border opacity-75 cursor-not-allowed`
                                : 'border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-600'
                            }`}
                          >
                            {updateLoading === selectedOrder._id ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              statusConfig[status].icon
                            )}
                            {statusConfig[status].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders