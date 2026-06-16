import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/slices/cartSlice'
import { useState } from 'react'

const ProductCard = ({ product, style = {} }) => {
  const dispatch = useDispatch()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      stock: product.stock,
      qty: 1,
    }))
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link to={'/product/' + product._id} style={{ textDecoration: 'none', ...style }}>
      <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-card)' }}>
        <div style={{ height: '200px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          <img
            src={product.images?.[0] || 'https://placehold.co/400x300/111118/555566?text=No+Image'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ padding: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{product.name}</h3>
          <p style={{ margin: '10px 0 8px', color: 'var(--accent)', fontWeight: 700 }}>Rs. {product.price?.toLocaleString()}</p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
              opacity: product.stock === 0 ? 0.5 : 1,
            }}
          >{added ? 'Added' : 'Add to Cart'}</button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
