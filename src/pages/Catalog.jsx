import { useEffect, useState } from 'react'
import useStore from '../store'

function FilterBar() {
  const { filters, setFilters, fetchItems } = useStore()
  const [loc, setLoc] = useState(filters)
  function apply() { setFilters(loc); fetchItems() }
  function reset() { const f = {q:'', category:'', minPrice:'', maxPrice:''}; setLoc(f); setFilters(f); fetchItems() }
  return (
    <div className="card mb-4 grid md:grid-cols-5 gap-3">
      <input className="input md:col-span-2" placeholder="Search..." value={loc.q} onChange={e=>setLoc({...loc, q:e.target.value})}/>
      <input className="input" placeholder="Category (e.g. Electronics)" value={loc.category} onChange={e=>setLoc({...loc, category:e.target.value})}/>
      <input className="input" placeholder="Min price" type="number" value={loc.minPrice} onChange={e=>setLoc({...loc, minPrice:e.target.value})}/>
      <input className="input" placeholder="Max price" type="number" value={loc.maxPrice} onChange={e=>setLoc({...loc, maxPrice:e.target.value})}/>
      <div className="flex gap-2 md:col-span-5">
        <button className="btn" onClick={apply}>Apply filters</button>
        <button className="btn bg-gray-800" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

function ItemCard({ item }) {
  const addToCartServer = useStore(s => s.addToCartServer)
  return (
    <div className="card flex flex-col">
      <img src={item.image} alt={item.title} className="rounded-xl w-full h-40 object-cover mb-3"/>
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="font-semibold">₹{item.price}</span>
        <button className="btn" onClick={()=>addToCartServer(item.id, 1)}>Add</button>
      </div>
    </div>
  )
}

export default function Catalog() {
  const { items, fetchItems } = useStore()
  useEffect(() => { fetchItems() }, [])
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-3">Explore products</h1>
      <FilterBar />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(it => <ItemCard key={it.id} item={it} />)}
      </div>
    </div>
  )
}
