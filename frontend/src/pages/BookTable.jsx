import React, { useState, useContext } from 'react'
import { Calendar, Users, Clock, Phone, Mail, User, MapPin } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const BookTable = () => {
  const { navigate, axios, setLoading, Loading } = useContext(AppContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    time: '',
    specialRequest: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: formData.name,
        phone: formData.phone,
        numberOfPeople: Number(formData.guests),
        date: formData.date,
        time: formData.time,
        note: formData.specialRequest
      }

      const { data } = await axios.post('/api/booking/create', payload)
      
      if (data.booking) {
        toast.success('Table booked successfully!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: 2,
          date: '',
          time: '',
          specialRequest: ''
        })
        setTimeout(() => navigate('/my-bookings'), 2000)
      } else {
        toast.error(data.message || 'Failed to book table')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking table')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-600 to-red-600 text-white py-12 px-6 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-4">Reserve Your Table</h1>
          <p className="text-lg text-orange-100">Experience dining excellence at our restaurant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Number of Guests *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Special Request */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Special Request</label>
                <textarea
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  placeholder="Any special requests or occasion? (Optional)"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={Loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
              >
                {Loading ? 'Booking...' : 'Book Table Now'}
              </button>
            </form>
          </div>

          {/* Info Box */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Restaurant Info</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-gray-600 text-sm">123 Food Street, City Center</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-600 text-sm">+91 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Hours</p>
                    <p className="text-gray-600 text-sm">11:00 AM - 11:00 PM</p>
                    <p className="text-gray-600 text-sm">Closed on Mondays</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Box */}
            <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Booking Tips</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>✓ Book at least 2 hours in advance</li>
                <li>✓ Maximum 10 guests per booking</li>
                <li>✓ Arrive 10 minutes early</li>
                <li>✓ Call us for large groups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookTable
