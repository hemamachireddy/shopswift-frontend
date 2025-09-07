import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import useStore from './store'

// Navbar Component
function Navbar() {
  const { user, logout } = useStore()
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-semibold">
          Shop<span className="text-blue-600">Swift</span>
        </Link>
        <div className="flex gap-3 items-center">
          <Link to="/cart" className="btn">Cart</Link>
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                className="btn"
                onClick={() => {
                  logout()
                  navigate('/login') // redirect to login after logout
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/signup" className="btn">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Protected Route wrapper
function PrivateRoute({ children }) {
  const { user } = useStore()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Catalog />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          {/* Redirect all unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="text-center text-xs text-gray-500 py-8">
        © {new Date().getFullYear()} ShopSwift
      </footer>
    </div>
  )
}
