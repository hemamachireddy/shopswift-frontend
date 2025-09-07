import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../store'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const signup = useStore(s => s.signup)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signup(name, email, password)
      navigate('/')
    } catch (err) {
      setError('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 card">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required/>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn w-full" disabled={loading}>{loading ? 'Creating...' : 'Sign up'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-3">Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link></p>
    </div>
  )
}
