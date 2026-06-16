import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../../redux/slices/cartSlice'
import API from '../../api/axios'
import {
  FiArrowLeft, FiArrowRight, FiCheck,
  FiMapPin, FiCreditCard, FiPackage,
  FiUser, FiPhone, FiHome
} from 'react-icons/fi'
import { MdPhoneAndroid } from 'react-icons/md'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

// Step Indicator
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Shipping', icon: <FiMapPin size={16} /> },
    { num: 2, label: 'Payment', icon: <FiCreditCard size={16} /> },
    { num: 3, label: 'Review', icon: <FiPackage size={16} /> },
  ]
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              currentStep > step.num
                ? 'bg-green-500 text-white'
                : currentStep === step.num
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {currentStep > step.num ? <FiCheck size={18} /> : step.icon}
            </div>
            <span className={`text-xs mt-1 font-medium ${
              currentStep >= step.num ? 'text-gray-800' : 'text-gray-400'
            }`}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-20 h-1 mx-2 mb-5 rounded transition-all ${
              currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// Stripe Card Form
const StripeForm = ({ totalPrice, shippingAddress, items, itemsPrice, shippingPrice }) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    try {
      // Create payment intent
      const { data } = await API.post('/api/payment/create-intent', {
        amount: totalPrice,
        currency: 'usd',
      })

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (result.error) {
        toast.error(result.error.message)
        setLoading(false)
        return
      }

      // Create order
      await API.post('/api/orders', {
        items,
        shippingAddress,
        paymentMethod: 'stripe',
        itemsPrice,
        shippingPrice,
        totalPrice,
        stripePaymentIntentId: result.paymentIntent.id,
      })

      dispatch(clearCart())
      toast.success('Order placed successfully!')
      navigate('/order-success')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePay}>
      <div className="border border-gray-200 rounded-xl p-4 mb-6">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#374151',
                '::placeholder': { color: '#9CA3AF' },
              },
              invalid: { color: '#EF4444' },
            },
          }}
        />
      </div>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-blue-700 mb-2">Test Card Details:</p>
        <p className="text-xs text-blue-600">Card: 4242 4242 4242 4242</p>
        <p className="text-xs text-blue-600">Expiry: Any future date | CVC: Any 3 digits</p>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <FiCreditCard size={20} />
            Pay Rs. {totalPrice.toLocaleString()}
          </>
        )}
      </button>
    </form>
  )
}

const Checkout = () => {
  const { items } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  })

  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shippingPrice = itemsPrice >= 5000 ? 0 : 200
  const totalPrice = itemsPrice + shippingPrice

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    const { fullName, phone, street, city, state, zipCode } = shippingAddress
    if (!fullName || !phone || !street || !city || !state || !zipCode) {
      return toast.error('Please fill all shipping fields')
    }
    setStep(2)
  }

  const handleCOD = async () => {
    try {
      await API.post('/api/orders', {
        items,
        shippingAddress,
        paymentMethod: 'cod',
        itemsPrice,
        shippingPrice,
        totalPrice,
      })
      navigate('/order-success')
      toast.success('Order placed successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-full bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdPhoneAndroid className="text-orange-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">
              Mehran<span className="text-orange-600">Mobile</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition text-sm"
          >
            <FiArrowLeft size={16} /> Back to Cart
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} />

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — Steps */}
          <div className="flex-1">

            {/* Step 1 — Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiMapPin className="text-orange-600" />
                  Shipping Address
                </h2>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Muhammad Ali"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="tel"
                          placeholder="03001234567"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="House No, Street, Area"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        placeholder="Lahore"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Province *</label>
                      <select
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                      >
                        <option value="">Select Province</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="AJK">AJK</option>
                        <option value="GB">Gilgit Baltistan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Zip Code */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code *</label>
                      <input
                        type="text"
                        placeholder="54000"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value="Pakistan"
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-100 text-gray-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition mt-2"
                  >
                    Continue to Payment
                    <FiArrowRight size={20} />
                  </button>
                </form>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiCreditCard className="text-orange-600" />
                  Payment Method
                </h2>

                {/* Payment Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 border-2 rounded-xl text-left transition ${
                      paymentMethod === 'stripe'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FiCreditCard className={paymentMethod === 'stripe' ? 'text-orange-600' : 'text-gray-400'} size={20} />
                      <span className={`font-semibold text-sm ${paymentMethod === 'stripe' ? 'text-orange-600' : 'text-gray-700'}`}>
                        Credit/Debit Card
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Pay securely with Stripe</p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border-2 rounded-xl text-left transition ${
                      paymentMethod === 'cod'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FiPackage className={paymentMethod === 'cod' ? 'text-orange-600' : 'text-gray-400'} size={20} />
                      <span className={`font-semibold text-sm ${paymentMethod === 'cod' ? 'text-orange-600' : 'text-gray-700'}`}>
                        Cash on Delivery
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Pay when you receive</p>
                  </button>
                </div>

                {/* Stripe Payment */}
                {paymentMethod === 'stripe' && (
                  stripePromise ? (
                    <Elements stripe={stripePromise}>
                      <StripeForm
                        totalPrice={totalPrice}
                        shippingAddress={shippingAddress}
                        items={items}
                        itemsPrice={itemsPrice}
                        shippingPrice={shippingPrice}
                      />
                    </Elements>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
                      Stripe is not configured. Please add <code className="font-mono">VITE_STRIPE_PUBLISHABLE_KEY</code> to <code className="font-mono">client/.env</code>.
                    </div>
                  )
                )}

                {/* COD */}
                {paymentMethod === 'cod' && (
                  <div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6">
                      <p className="text-sm text-yellow-700 font-medium">
                        Cash on Delivery available for orders up to Rs. 50,000.
                        Please have exact change ready.
                      </p>
                    </div>
                    <button
                      onClick={handleCOD}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                    >
                      <FiPackage size={20} />
                      Place Order (COD)
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-600 py-3 rounded-xl font-semibold text-sm transition"
                >
                  <FiArrowLeft size={16} /> Back to Shipping
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="text-orange-600" />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product} className="flex gap-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/50x50'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Rs. {item.price.toLocaleString()} x {item.qty}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-gray-800 flex-shrink-0">
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Shipping Address Preview */}
              {step === 2 && shippingAddress.fullName && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <FiMapPin size={12} className="text-orange-600" /> Delivery To:
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-800">{shippingAddress.fullName}</p>
                    <p className="text-xs text-gray-600">{shippingAddress.phone}</p>
                    <p className="text-xs text-gray-600">{shippingAddress.street}</p>
                    <p className="text-xs text-gray-600">{shippingAddress.city}, {shippingAddress.state}</p>
                  </div>
                </div>
              )}

              <hr className="border-gray-100 my-4" />

              {/* Price */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shippingPrice === 0 ? 'text-green-600' : ''}`}>
                    {shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}
                  </span>
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-orange-600 text-xl">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Security */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>🔒</span>
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout