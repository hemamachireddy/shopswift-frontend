import { create } from 'zustand'
import { api, loadLocalCart, saveLocalCart } from './api'

const useStore = create((set, get) => ({
  user: null,
  items: [],
  total: 0,
  filters: { q: '', category: '', minPrice: '', maxPrice: '' },
  cart: loadLocalCart(),

  setUser: (user) => set({ user }),
  logout: () => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:4000") + "/auth/logout", { method: "POST", credentials: "include" }).finally(()=>{})
    set({ user: null })
  },

  setFilters: (filters) => set({ filters }),
  fetchItems: async () => {
    const { q, category, minPrice, maxPrice } = get().filters
    const params = new URLSearchParams()
    if (q) params.append('q', q)
    if (category) params.append('category', category)
    if (minPrice) params.append('minPrice', minPrice)
    if (maxPrice) params.append('maxPrice', maxPrice)
    const data = await api(`/items?${params.toString()}`)
    set({ items: data.items, total: data.total })
  },

  setCart: (cart) => { saveLocalCart(cart); set({ cart }) },
  addToCartLocal: (item, quantity = 1) => {
    const cart = [...get().cart]
    const idx = cart.findIndex(ci => ci.item.id === item.id)
    if (idx >= 0) cart[idx].quantity += quantity
    else cart.push({ item, quantity })
    saveLocalCart(cart); set({ cart })
  },
  removeFromCartLocal: (itemId) => {
    const cart = get().cart.filter(ci => ci.item.id !== itemId)
    saveLocalCart(cart); set({ cart })
  },
  updateQtyLocal: (itemId, qty) => {
    const cart = get().cart.map(ci => ci.item.id === itemId ? { ...ci, quantity: qty } : ci)
    saveLocalCart(cart); set({ cart })
  },

  ensureServerCart: async () => {
    const { user } = get()
    if (!user) return
    const local = get().cart.map(ci => ({ itemId: ci.item.id, quantity: ci.quantity }))
    await api("/cart/merge", { method: "POST", body: { items: local } })
    const server = await api("/cart")
    set({ cart: server.items })
    saveLocalCart(server.items)
  },

  login: async (email, password) => {
    const res = await api("/auth/login", { method: "POST", body: { email, password } })
    set({ user: res.user })
    await get().ensureServerCart()
  },
  signup: async (name, email, password) => {
    const res = await api("/auth/signup", { method: "POST", body: { name, email, password } })
    set({ user: res.user })
    await get().ensureServerCart()
  },

  addToCartServer: async (itemId, quantity = 1) => {
    try {
      const res = await api("/cart", { method: "POST", body: { itemId, quantity } })
      set({ cart: res.items }); saveLocalCart(res.items)
    } catch {
      const item = get().items.find(i => i.id === itemId)
      get().addToCartLocal(item, quantity)
    }
  },
  updateQtyServer: async (itemId, quantity) => {
    try {
      const res = await api(`/cart/${itemId}`, { method: "PUT", body: { quantity } })
      set({ cart: res.items }); saveLocalCart(res.items)
    } catch {
      get().updateQtyLocal(itemId, quantity)
    }
  },
  removeFromCartServer: async (itemId) => {
    try {
      const res = await api(`/cart/${itemId}`, { method: "DELETE" })
      set({ cart: res.items }); saveLocalCart(res.items)
    } catch {
      get().removeFromCartLocal(itemId)
    }
  },
}))

export default useStore
