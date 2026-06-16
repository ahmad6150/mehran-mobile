import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import AdminSidebar from './AdminSidebar'
import { FiUpload, FiX, FiArrowLeft, FiSave } from 'react-icons/fi'
import toast from 'react-hot-toast'

const AddProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '',
    featured: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      return toast.error('Max 5 images allowed')
    }
    setImages([...images, ...files])
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, description, price, category, brand, stock } = formData
    if (!name || !description || !price || !category || !brand || !stock) {
      return toast.error('Please fill all required fields')
    }
    if (images.length === 0) {
      return toast.error('Please upload at least one image')
    }

    try {
      setLoading(true)
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })
      images.forEach((img) => data.append('images', img))

      await API.post('/api/products', data)
      toast.success('Product added successfully!')
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['phone', 'charger', 'cable', 'case', 'earphones', 'powerbank', 'other']

  return (
    <div className="flex min-h-full bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <form id="add-product-form" onSubmit={handleSubmit} encType="multipart/form-data" className="text-gray-900">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/products')}
                className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add Product</h1>
                <p className="text-sm text-gray-500">Fill in the details below</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSave size={18} />
              )}
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left — Main Info */}
              <div className="lg:col-span-2 space-y-6">

                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Samsung Galaxy A54"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        placeholder="Write product description..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white resize-none"
                      />
                    </div>

                    {/* Brand & Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Brand *
                        </label>
                        <input
                          type="text"
                          name="brand"
                          placeholder="e.g. Samsung"
                          value={formData.brand}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat} className="capitalize">{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Pricing & Stock</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sale Price (Rs.) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        placeholder="85000"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Original Price (Rs.)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        placeholder="90000"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        placeholder="10"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer mt-6">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="w-5 h-5 rounded accent-orange-600"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Featured Product</p>
                          <p className="text-xs text-gray-500">Show on homepage</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Images */}
              <div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-24">
                  <h2 className="font-bold text-gray-900 mb-4">Product Images</h2>
                  <p className="text-xs text-gray-500 mb-4">Upload up to 5 images (JPG, PNG, WebP)</p>

                  {/* Upload Area */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition mb-4">
                    <FiUpload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500 font-medium">Click to upload</span>
                    <span className="text-xs text-gray-400">or drag and drop</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImages}
                      className="hidden"
                    />
                  </label>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {previews.map((preview, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-24 object-cover rounded-xl border border-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiX size={12} />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-lg">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {previews.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No images selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
