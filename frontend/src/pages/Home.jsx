import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ChefHat, Utensils, Clock, Award } from 'lucide-react'
import { AppContext } from '../context/AppContext'

const Home = () => {
  const navigate = useNavigate()
  const { menus } = useContext(AppContext)
  
  const featuredProducts = menus.slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-600 via-orange-500 to-red-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Restaurant</h1>
              <p className="text-xl mb-8 text-orange-100">Experience authentic culinary delights with our premium collection of dishes prepared by master chefs.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
                >
                  Explore Menu
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="border-2 border-white hover:bg-white hover:text-orange-600 font-bold py-3 px-8 rounded-lg transition"
                >
                  Contact Us
                </button>
              </div>
            </div>
            <div className="flex-1 hidden md:block">
              <ChefHat className="w-96 h-96 text-white opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600">Sourced from trusted local farmers</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Expert Chefs</h3>
            <p className="text-gray-600">Years of culinary excellence</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Quick Service</h3>
            <p className="text-gray-600">Fast delivery within 30 minutes</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Award Winner</h3>
            <p className="text-gray-600">Recognized for quality & taste</p>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Dishes</h2>
            <p className="text-xl text-gray-600">Handpicked specialties from our kitchen</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/menu')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-10 rounded-lg transition transform hover:scale-105"
            >
              View All Menu
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-orange-600 to-red-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 text-orange-100">Book a table or place an order online and enjoy delicious food delivered to your doorstep</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/menu')}
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition"
            >
              Order Now
            </button>
            <button
              onClick={() => navigate('/book-table')}
              className="border-2 border-white hover:bg-white hover:text-orange-600 font-bold py-3 px-8 rounded-lg transition"
            >
              Book a Table
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
