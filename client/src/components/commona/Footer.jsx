import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-[1.3fr,0.85fr] items-start">
        <div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Mehran<span className="text-orange-500">Mobile</span>
          </h2>
          <p className="text-sm leading-relaxed text-gray-400 max-w-xl">
            Premium mobile devices, accessories, and service in Pakistan. Fast delivery, trusted brands, and easy support.
          </p>
          <div className="mt-6 flex items-center gap-4 text-gray-400">
            <a href="#" aria-label="Facebook" className="hover:text-orange-500 transition"><FiFacebook size={18} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-orange-500 transition"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-orange-500 transition"><FiTwitter size={18} /></a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                { label: 'Home', path: '/' },
                { label: 'Shop', path: '/shop' },
                { label: 'Cart', path: '/cart' },
                { label: 'Orders', path: '/orders' },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-white transition">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>+92 300 1234567</li>
              <li>info@mehranmobile.com</li>
              <li>Shop No. 5, Mobile Market</li>
              <li>Lahore, Pakistan</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2025 Mehran Mobile. All rights reserved.</p>
          <p>Made with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer