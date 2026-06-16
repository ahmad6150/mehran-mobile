import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { getProducts } from '../../redux/slices/productSlice'
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import { MdPhoneAndroid } from 'react-icons/md'

const Shop = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, loading, total, pages } = useSelector((state) => state.products)

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(getProducts(filters))
  }, [dispatch, filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })
    setSearchParams({})
  }

  const categories = [
    { label: 'All', value: '' },
    { label: '📱 Phones', value: 'phone' },
    { label: '🔌 Chargers', value: 'charger' },
    { label: '🔗 Cables', value: 'cable' },
    { label: '🛡️ Cases', value: 'case' },
    { label: '🎧 Earphones', value: 'earphones' },
    { label: '🔋 Power Banks', value: 'powerbank' },
    { label: '📦 Other', value: 'other' },
  ]

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Top Rated', value: 'rating' },
  ]

  return (
    <div className="bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {filters.category
              ? categories.find(c => c.value === filters.category)?.label + ' Products'
              : filters.keyword
              ? `Search: "${filters.keyword}"`
              : 'All Products'}
          </h1>
          <p className="text-gray-600 text-base mt-1">{total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">

              {/* Search */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Search</h3>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleFilterChange('category', cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                        filters.category === cat.value
                          ? 'bg-orange-600 text-white font-semibold'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                <FiX size={16} /> Clear Filters
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-2xl border border-gray-100 px-4 py-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-gray-600 text-sm font-medium"
              >
                <FiFilter size={16} /> Filters
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <MdPhoneAndroid className="text-gray-300 text-8xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500 text-sm mb-4">Try changing your filters</p>
                <button
                  onClick={clearFilters}
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ShopProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                          filters.page === i + 1
                            ? 'bg-orange-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-600'
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
        </div>
      </div>
    </div>
  )
}

// Product Card
const ShopProductCard = ({ product }) => {
  const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') return '—'
    return Number(value).toLocaleString()
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white text-slate-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/product/${product._id}`} className="overflow-hidden bg-white">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <Link to={`/product/${product._id}`}>
            <h3 className="min-h-[3rem] max-h-[4rem] overflow-hidden text-lg font-semibold leading-tight text-slate-900 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Rs. {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop