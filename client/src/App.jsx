import { Routes, Route, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/commona/ProtectedRoute'
import AdminRoute from './components/commona/AdminRoute'
import Navbar from './components/commona/Navbar'
import Footer from './components/commona/Footer'
import ScrollToTop from './components/commona/ScrollToTop'

import Home from './pages/customer/Home'
import Shop from './pages/customer/Shop'
import ProductDetail from './pages/customer/ProductDetail'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderSuccess from './pages/customer/OrderSuccess'
import MyOrders from './pages/customer/MyOrders'
import Login from './pages/customer/Login'
import Register from './pages/customer/Register'

import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import AdminOrders from './pages/admin/AdminOrders'

const hideNavbarRoutes = ['/login', '/register', '/admin/login']

function App() {
  const location = useLocation()
  const hideNavbar = hideNavbarRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      <main className="flex-1 min-h-0 bg-transparent">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path='/order-success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path='/orders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path='/admin/products' element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path='/admin/products/add' element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path='/admin/products/edit/:id' element={<AdminRoute><EditProduct /></AdminRoute>} />
          <Route path='/admin/orders' element={<AdminRoute><AdminOrders /></AdminRoute>} />
        </Routes>
      </main>
      {!hideNavbar && <Footer />}
    </div>
  )
}

export default App