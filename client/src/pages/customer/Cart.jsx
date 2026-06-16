import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice'
import {
  FiShoppingCart, FiTrash2, FiArrowLeft,
  FiArrowRight, FiMinus, FiPlus, FiTag
} from 'react-icons/fi'
import { MdPhoneAndroid } from 'react-icons/md'
import toast from 'react-hot-toast'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shippingPrice = itemsPrice >= 5000 ? 0 : 200
  const totalPrice = itemsPrice + shippingPrice

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId))
    toast.success('Item removed from cart')
  }

  const handleQuantity = (productId, qty) => {
    if (qty < 1) return
    dispatch(updateQuantity({ productId, qty }))
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    toast.success('Cart cleared')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart className="text-orange-400" size={56} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything to your cart yet.
            Start shopping to fill it up!
          </p>
          <Link
            to="/shop"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 transition"
          >
            <MdPhoneAndroid size={20} />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition text-sm font-medium"
          >
            <FiArrowLeft size={18} /> Continue Shopping
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1">

            {/* Clear Cart */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition"
              >
                <FiTrash2 size={16} /> Clear All
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product} className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-6">
                  <div className="flex gap-4">

                    {/* Image */}
                    <Link to={`/product/${item.product}`} className="flex-shrink-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={item.name}
                        className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-xl border border-gray-100"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-semibold text-gray-800 hover:text-orange-600 transition text-sm lg:text-base line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => handleRemove(item.product)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition p-1"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      <p className="text-orange-600 font-bold text-lg mt-1">
                        Rs. {item.price.toLocaleString()}
                      </p>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQuantity(item.product, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 transition text-gray-600"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-800 text-sm border-x border-gray-200 min-w-[48px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleQuantity(item.product, item.qty + 1)}
                            disabled={item.qty >= item.stock}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 transition text-gray-600"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="font-bold text-gray-900">
                            Rs. {(item.price * item.qty).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiTag className="text-orange-600" size={18} />
                Promo Code
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items Summary */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                      {item.name} <span className="text-gray-400">x{item.qty}</span>
                    </span>
                    <span className="font-medium text-gray-800 flex-shrink-0">
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items Total</span>
                  <span className="font-medium text-gray-800">Rs. {itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shippingPrice === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}
                  </span>
                </div>
                {shippingPrice > 0 && (
                  <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    Add Rs. {(5000 - itemsPrice).toLocaleString()} more for free delivery!
                  </p>
                )}
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-orange-600 text-xl">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition text-base"
              >
                Proceed to Checkout
                <FiArrowRight size={20} />
              </button>

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="w-full mt-3 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-600 py-3.5 rounded-xl font-semibold text-sm transition"
              >
                <FiArrowLeft size={18} />
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>🔒</span>
                <span>Secure Checkout — 100% Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart