import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../api/axios'
import AdminSidebar from './AdminSidebar'
import { FiUpload, FiX, FiArrowLeft, FiSave, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [newImages, setNewImages] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [formData, setFormData] = useState({
    name: '', description: '', price: '',
    originalPrice: '', category: '', brand: '',
    stock: '', featured: false, isActive: true,
  })
  const [existingImages, setExistingImages] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`)
        const p = data.product
        setFormData({
          name: p.name, description: p.description,
          price: p.price, originalPrice: p.originalPrice || '',
          category: p.category, brand: p.brand,
          stock: p.stock, featured: p.featured, isActive: p.isActive,
        })
        setExistingImages(p.images)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch product')
        navigate('/admin/products')
      } finally {
        setFetchLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files)
    setNewImages([...newImages, ...files])
    const previews = files.map((f) => URL.createObjectURL(f))
    setNewPreviews([...newPreviews, ...previews])
  }

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index))
    setNewPreviews(newPreviews.filter((_, i) => i !== index))
  }

  const deleteExistingImage = async (publicId) => {
    if (!window.confirm('Delete this image?')) return
    try {
      await API.delete(`/api/products/${id}/images/${encodeURIComponent(publicId)}`)
      setExistingImages(existingImages.filter((img) => img.public_id !== publicId))
      toast.success('Image deleted!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.brand || !formData.stock) {
      return toast.error('Please fill all required fields')
    }
    if (newImages.length === 0 && existingImages.length === 0) {
      return toast.error('Please have at least one image')
    }

    try {
      setLoading(true)
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => data.append(key, value))
      newImages.forEach((img) => data.append('images', img))
      await API.put(`/api/products/${id}`, data)
      toast.success('Product updated!')
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['phone', 'charger', 'cable', 'case', 'earphones', 'powerbank', 'other']

  if (fetchLoading) return (
    <div className="flex min-h-full bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-full bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <form id="edit-product-form" onSubmit={handleSubmit} encType="multipart/form-data" className="text-gray-900">

        {/* Header */}
        <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-500">{formData.name}</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={18} />}
              {loading ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white resize-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                        <input type="text" name="brand" value={formData.brand} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white">
                          {categories.map((cat) => (
                            <option key={cat} value={cat} className="capitalize">{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Pricing & Stock</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price</label>
                      <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Stock *</label>
                      <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white" />
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                          className="w-5 h-5 rounded accent-orange-600" />
                        <span className="text-sm font-semibold text-gray-700">Featured</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                          className="w-5 h-5 rounded accent-orange-600" />
                        <span className="text-sm font-semibold text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Images */}
              <div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky lg:top-24">
                  <h2 className="font-bold text-gray-900 mb-4">Product Images</h2>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Current Images</p>
                      <div className="grid grid-cols-2 gap-2">
                        {existingImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img src={img.url} alt="" className="w-full h-24 object-cover rounded-xl border" />
                            <button
                              type="button"
                              onClick={() => deleteExistingImage(img.public_id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New */}
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition mb-3">
                    <FiUpload className="text-gray-400 mb-1" size={20} />
                    <span className="text-sm text-gray-500">Add more images</span>
                    <input type="file" multiple accept="image/*" onChange={handleNewImages} className="hidden" />
                  </label>

                  {newPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {newPreviews.map((preview, i) => (
                        <div key={i} className="relative group">
                          <img src={preview} alt="" className="w-full h-24 object-cover rounded-xl border" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
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

export default EditProduct
