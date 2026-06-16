import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById } from '../../redux/slices/productSlice'
import { addToCart } from '../../redux/slices/cartSlice'
import API from '../../api/axios'
import {
  FiShoppingCart, FiStar, FiArrowLeft, FiTruck,
  FiShield, FiRefreshCw, FiMinus, FiPlus, FiUser
} from 'react-icons/fi'
import { MdPhoneAndroid } from 'react-icons/md'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { product, loading } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)

  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)  // ← Yeh add karo
    dispatch(getProductById(id))
  }, [dispatch, id])

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      qty,
      stock: product.stock,
    }))
    toast.success('Added to cart!')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to review')
    if (!review.comment) return toast.error('Please write a comment')
    try {
      setReviewLoading(true)
      await API.post(`/api/products/${id}/reviews`, review)
      toast.success('Review submitted!')
      dispatch(getProductById(id))
      setReview({ rating: 5, comment: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  const discount = product?.originalPrice > product?.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (loading) return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading product...</p>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <MdPhoneAndroid className="text-gray-300 text-8xl mx-auto mb-4" />
        <p className="text-gray-500">Product not found</p>
        <Link to="/shop" className="text-orange-600 font-semibold mt-2 inline-block">
          Back to Shop
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-full bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-orange-600">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-orange-600 capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition"
        >
          <FiArrowLeft size={18} /> Back
        </button>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Images */}
            <div className="lg:w-2/5">
              <div className="relative rounded-2xl overflow-hidden bg-gray-50 mb-4">
                <img
                  src={product.images[selectedImage]?.url || 'https://via.placeholder.com/500x500?text=No+Image'}
                  alt={product.name}
                  className="w-full h-80 lg:h-96 object-contain p-4"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                    -{discount}% OFF
                  </span>
                )}
                {product.featured && (
                  <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-xl">
                    Featured
                  </span>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === i ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:w-3/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {product.category}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.brand}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={18}
                      className={i < Math.round(product.ratings)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.ratings.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-orange-50 rounded-2xl">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    Rs. {Number(product.price || 0).toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 line-through text-sm">
                        Rs. {Number(product.originalPrice || 0).toLocaleString()}
                      </span>
                      <span className="text-green-600 font-semibold text-sm">
                        Save Rs. {Number((product.originalPrice || 0) - (product.price || 0)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition text-gray-600"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="px-6 py-2 font-semibold text-gray-800 border-x border-gray-200">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition text-gray-600"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">Max: {product.stock}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 disabled:border-gray-200 disabled:text-gray-400 py-3.5 rounded-xl font-semibold transition"
                >
                  <FiShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 rounded-xl font-semibold transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <FiTruck size={20} />, text: 'Free Delivery', sub: 'Above Rs. 5,000' },
                  { icon: <FiShield size={20} />, text: '100% Genuine', sub: 'Authentic Product' },
                  { icon: <FiRefreshCw size={20} />, text: 'Easy Return', sub: '7 Days Policy' },
                ].map((f, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-orange-600 mb-1">{f.icon}</div>
                    <span className="text-xs font-semibold text-gray-700">{f.text}</span>
                    <span className="text-xs text-gray-500">{f.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="flex border-b border-gray-100">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab} {tab === 'reviews' && `(${product.numReviews})`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Category', value: product.category },
                    { label: 'Stock', value: product.stock },
                    { label: 'Rating', value: `${product.ratings.toFixed(1)} / 5` },
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-sm text-gray-500 font-medium">{spec.label}</span>
                      <span className="text-sm font-semibold text-gray-800 capitalize">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {/* Review Summary */}
                <div className="flex items-center gap-6 mb-8 p-4 bg-orange-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-orange-600">{product.ratings.toFixed(1)}</div>
                    <div className="flex items-center justify-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={14}
                          className={i < Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">{product.numReviews} reviews</div>
                  </div>
                </div>

                {/* Reviews List */}
                {product.reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-4 mb-8">
                    {product.reviews.map((rev, i) => (
                      <div key={i} className="border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <FiUser className="text-orange-600" size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{rev.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, j) => (
                                <FiStar key={j} size={12}
                                  className={j < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write Review */}
                {user ? (
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
                    <form onSubmit={handleReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReview({ ...review, rating: star })}
                              className="text-2xl transition hover:scale-110"
                            >
                              <FiStar
                                className={star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                        <textarea
                          rows={4}
                          placeholder="Share your experience with this product..."
                          value={review.comment}
                          onChange={(e) => setReview({ ...review, comment: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition"
                      >
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-6 text-center">
                    <p className="text-gray-500 text-sm mb-3">Login to write a review</p>
                    <Link
                      to="/login"
                      className="bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
                    >
                      Login Now
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail