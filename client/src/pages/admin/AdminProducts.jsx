import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import AdminSidebar from './AdminSidebar'
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiPackage, FiArrowRight, FiStar
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(null)

  const fetchProducts = useCallback(async (pageNumber = page, categoryParam = category, searchTerm = searchQuery) => {
    try {
      setLoading(true)
      const { data } = await API.get('/api/products/admin/all', {
        params: { page: pageNumber, limit: 10, keyword: searchTerm, category: categoryParam }
      })
      setProducts(data.products)
      setPages(data.pages)
      setTotal(data.total)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [page, category, searchQuery])

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts()
    }
    loadProducts()
  }, [fetchProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearchQuery(search)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      setDeleteLoading(id)
      await API.delete(`/api/products/${id}`)
      toast.success('Product deleted!')
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product')
    } finally {
      setDeleteLoading(null)
    }
  }

  const categories = [
    { label: 'All', value: '' },
    { label: 'Phones', value: 'phone' },
    { label: 'Chargers', value: 'charger' },
    { label: 'Cables', value: 'cable' },
    { label: 'Cases', value: 'case' },
    { label: 'Earphones', value: 'earphones' },
    { label: 'Power Banks', value: 'powerbank' },
    { label: 'Other', value: 'other' },
  ]

  return (
    <div className="flex min-h-full bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">{total} total products</p>
            </div>
            <Link
              to="/admin/products/add"
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition"
            >
              <FiPlus size={18} />
              Add Product
            </Link>
          </div>
        </div>

        <div className="p-6">

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 min-w-0">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
              >
                Search
              </button>
            </form>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <FiPackage className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No products found</p>
                <Link
                  to="/admin/products/add"
                  className="text-orange-600 font-semibold hover:underline flex items-center gap-1 justify-center"
                >
                  Add your first product <FiArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Featured', 'Actions'].map((h) => (
                          <th
                            key={h}
                            className={
                              `text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wide ${
                                h === 'Rating' || h === 'Featured' ? 'hidden lg:table-cell' : ''
                              }`
                            }
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50 transition">

                          {/* Product */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]?.url || 'https://via.placeholder.com/50x50'}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-gray-800 text-sm line-clamp-1 max-w-[180px]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                Rs. {product.price.toLocaleString()}
                              </p>
                              {product.originalPrice > product.price && (
                                <p className="text-xs text-gray-400 line-through">
                                  Rs. {product.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Stock */}
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              product.stock > 10
                                ? 'bg-green-100 text-green-700'
                                : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                            </span>
                          </td>

                          {/* Rating */}
                          <td className="hidden lg:table-cell px-6 py-4">
                            <div className="flex items-center gap-1">
                              <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                              <span className="text-sm font-medium text-gray-700">
                                {product.ratings.toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-400">({product.numReviews})</span>
                            </div>
                          </td>

                          {/* Featured */}
                          <td className="hidden lg:table-cell px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              product.featured
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {product.featured ? 'Featured' : 'Normal'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition"
                              >
                                <FiEdit2 size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id, product.name)}
                                disabled={deleteLoading === product._id}
                                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition disabled:opacity-50"
                              >
                                {deleteLoading === product._id ? (
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <FiTrash2 size={16} />
                                )}
                              </button>
                            </div>
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
        </div>
      </div>
    </div>
  )
}

export default AdminProducts