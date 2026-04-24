import React, { useContext, useState } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(AppContext)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
      <div className="relative overflow-hidden bg-gray-200 h-48">
        <img 
          src={imageError ? 'https://via.placeholder.com/500x500?text=' + encodeURIComponent(product.name) : product.image}
          alt={product.name} 
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full hover:bg-red-100 transition">
          <Heart className="w-5 h-5 text-red-500" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
