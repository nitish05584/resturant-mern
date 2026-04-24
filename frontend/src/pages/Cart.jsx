import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, removeFromCart, updateCartItem, navigate } = useContext(AppContext)

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const deliveryFee = subtotal > 0 ? 50 : 0
  const tax = subtotal * 0.05
  const total = subtotal + deliveryFee + tax

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <p className="text-orange-600 font-bold text-lg">₹{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() => updateCartItem(item._id, item.quantity - 1)}
                            className="text-gray-600 hover:text-gray-800 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-semibold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItem(item._id, item.quantity + 1)}
                            className="text-gray-600 hover:text-gray-800 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="font-bold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/menu')}
                className="w-full mt-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
