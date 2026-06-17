import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/slices/cartSlice'
import { useState } from 'react'
import { FiShoppingCart, FiStar } from 'react-icons/fi'

const ProductCard = ({ product, style = {} }) => {
  const dispatch = useDispatch()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || product.images?.[0] || '',
      price: product.price,
      stock: product.stock,
      qty: 1,
    }))
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const imageUrl =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'

  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  return (
    <Link
      to={'/product/' + product._id}
      style={{ textDecoration: 'none', display: 'block', ...style }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'box-shadow 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Image — 68% of card */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '68%',
          background: '#f9fafb',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            onError={e => {
              e.target.src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'
            }}
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <span style={{
              position: 'absolute', top: '8px', left: '8px',
              background: '#ea580c', color: '#fff',
              fontSize: '11px', fontWeight: 600,
              padding: '2px 7px', borderRadius: '4px',
            }}>
              -{discount}%
            </span>
          )}

          {/* Featured Badge */}
          {product.featured && discount === 0 && (
            <span style={{
              position: 'absolute', top: '8px', left: '8px',
              background: '#111827', color: '#fff',
              fontSize: '11px', fontWeight: 600,
              padding: '2px 7px', borderRadius: '4px',
            }}>
              Featured
            </span>
          )}

          {/* Sold Out Overlay */}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: '11px', fontWeight: 600,
                color: '#6b7280', letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info — Compact */}
        <div style={{
          padding: '10px 12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
        }}>

          {/* Brand · Category */}
          <p style={{
            margin: 0,
            fontSize: '11px',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 500,
          }}>
            {product.brand} · {product.category}
          </p>

          {/* Name */}
          <h3 style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={11}
                style={{
                  color: i < Math.round(product.ratings || 0) ? '#f59e0b' : '#e5e7eb',
                  fill: i < Math.round(product.ratings || 0) ? '#f59e0b' : 'none',
                }}
              />
            ))}
            <span style={{ fontSize: '10px', color: '#9ca3af', marginLeft: '3px' }}>
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
              Rs. {product.price?.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through' }}>
                Rs. {product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <p style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 600,
            color: product.stock > 10
              ? '#16a34a'
              : product.stock > 0
              ? '#ca8a04'
              : '#dc2626',
          }}>
            {product.stock > 10
              ? '✓ In Stock'
              : product.stock > 0
              ? `Only ${product.stock} left`
              : 'Out of Stock'}
          </p>

          {/* Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              background: added
                ? '#16a34a'
                : product.stock === 0
                ? '#f3f4f6'
                : '#111827',
              color: product.stock === 0 ? '#9ca3af' : '#fff',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'background 0.2s',
            }}
          >
            <FiShoppingCart size={13} />
            {added ? '✓ Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard