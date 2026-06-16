import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  return user && user.role === 'admin' ? children : <Navigate to='/admin/login' />
}

export default AdminRoute