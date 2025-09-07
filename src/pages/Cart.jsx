import useStore from '../store'

export default function Cart() {
  const { cart, updateQtyServer, removeFromCartServer } = useStore()
  const total = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-3">Your Cart</h1>
      {!cart.length && <p className="text-gray-600">Cart is empty. Add some items!</p>}
      <div className="grid gap-3">
        {cart.map(ci => (
          <div key={ci.item.id} className="card flex items-center gap-4">
            <img src={ci.item.image} className="w-24 h-24 object-cover rounded-xl"/>
            <div className="flex-1">
              <div className="font-semibold">{ci.item.title}</div>
              <div className="text-sm text-gray-600">{ci.item.category}</div>
              <div className="mt-2 flex items-center gap-2">
                <button className="btn" onClick={()=>updateQtyServer(ci.item.id, Math.max(0, ci.quantity-1))}>-</button>
                <span className="px-3">{ci.quantity}</span>
                <button className="btn" onClick={()=>updateQtyServer(ci.item.id, ci.quantity+1)}>+</button>
                <button className="btn bg-red-600" onClick={()=>removeFromCartServer(ci.item.id)}>Remove</button>
              </div>
            </div>
            <div className="font-semibold">₹{ci.item.price * ci.quantity}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 card flex items-center justify-between">
        <span className="text-xl font-semibold">Total: ₹{total}</span>
        <button className="btn">Checkout</button>
      </div>
      <p className="text-xs text-gray-500 mt-3">Cart items persist locally even when logged out; once you login, they sync to your account.</p>
    </div>
  )
}
