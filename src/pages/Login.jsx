import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../store'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useStore(s => s.login)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 card">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">No account? <Link to="/signup" className="text-blue-600 underline">Sign up</Link></p>
    </div>
  )
}
