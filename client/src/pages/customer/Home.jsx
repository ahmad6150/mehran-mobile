import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../redux/slices/productSlice'
import { FiArrowRight } from 'react-icons/fi'

const Home = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }))
  }, [dispatch])

  return (
    <div className="bg-white">
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-6">
            Pakistan's Premium Mobile Store
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
            Best Mobile
            <br />
            <span className="text-orange-600">Accessories</span>
            <br />
            In Pakistan
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
            Phones, chargers, cables, cases — premium quality at unbeatable prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest transition"
            >
              Shop Now
            </Link>
            <Link
              to="/shop?category=phone"
              className="flex items-center gap-2 text-gray-900 text-sm font-semibold hover:text-orange-600 transition"
            >
              View Phones <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-[300px] lg:h-[340px]">
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_80px_rgba(15,23,42,0.08)] border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1510557880182-3d4d3b3b6c2f?auto=format&fit=crop&w=900&q=80"
              alt="Premium smartphone"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(15,23,42,0.08)] border border-gray-100 h-[148px] lg:h-[164px]">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
                alt="Charger and cable"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(15,23,42,0.08)] border border-gray-100 h-[148px] lg:h-[164px]">
              <img
                src="https://images.unsplash.com/photo-1512499617640-c2f9996b4a8b?auto=format&fit=crop&w=900&q=80"
                alt="Phone accessory set"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400 mb-4">
              Browse
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              Categories
            </h2>
          </div>
          <div className="flex justify-center mb-10">
            <Link
              to="/shop"
              className="text-sm font-semibold text-gray-900 hover:text-orange-600 flex items-center gap-2 transition"
            >
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="flex items-center justify-between gap-8 overflow-x-auto pb-16">
            {[
              { name: 'Smartphones', slug: 'phone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
              { name: 'Chargers', slug: 'charger', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80' },
              { name: 'Cables', slug: 'cable', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
              { name: 'Cases', slug: 'case', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&q=80' },
              { name: 'Earphones', slug: 'earphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
            ].map((cat, i) => (
              <Link
                key={i}
                to={cat.slug ? `/shop?category=${cat.slug}` : '/shop'}
                className="flex flex-col items-center gap-4 flex-shrink-0 group"
              >
                <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-orange-500 transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="text-lg lg:text-xl font-semibold uppercase tracking-[0.15em] text-gray-600 group-hover:text-orange-600 transition text-center whitespace-nowrap">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div className="pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-3">Latest Products</p>
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                Fresh arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-gray-900 hover:text-orange-600 flex items-center gap-2 transition"
            >
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="rounded-3xl border border-gray-100 bg-gray-50 p-4 animate-pulse"></div>
              ))
            ) : (
              products.slice(0, 4).map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group rounded-3xl border border-gray-100 overflow-hidden bg-white transition hover:-translate-y-1"
                >
                  <div className="h-52 overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">{product.brand || 'Mobile'}</p>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between text-sm text-black">
                      <span>Rs. {Number(product.price || 0).toLocaleString()}</span>
                      <span>{product.stock > 0 ? 'In stock' : 'Sold out'}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
