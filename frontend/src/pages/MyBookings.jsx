import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { CalendarDays, Clock3, Phone, UserRound, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const { axios, navigate, user } = useContext(AppContext)
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoadingBookings(false)
        return
      }

      try {
        setLoadingBookings(true)
        const { data } = await axios.get('/api/booking/my-bookings')
        setBookings(data?.bookings || [])
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Could not fetch your bookings')
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchBookings()
  }, [axios, user])

  const getStatusClasses = (status) => {
    const value = String(status || '').toLowerCase()
    if (value === 'confirmed') return 'bg-green-100 text-green-700'
    if (value === 'pending') return 'bg-amber-100 text-amber-700'
    if (value === 'cancelled') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-md">
          <CalendarDays className="mx-auto mb-3 h-12 w-12 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-3 text-gray-600">Please login to view your table bookings.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  if (loadingBookings) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">My Bookings</h1>
          <div className="rounded-2xl bg-white p-8 text-center shadow-md text-gray-600">Loading your bookings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl bg-linear-to-r from-orange-600 to-red-600 p-7 text-white">
          <h1 className="text-3xl font-black">My Bookings</h1>
          <p className="mt-2 text-orange-100">Manage your table reservations and booking status.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">No bookings found</h2>
            <p className="mt-2 text-gray-600">You have not reserved any table yet.</p>
            <button
              onClick={() => navigate('/book-table')}
              className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Book a Table
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-semibold text-gray-900">#{booking._id?.slice(-8)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <UserRound className="h-4 w-4 text-orange-600" />
                    <span>{booking.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-orange-600" />
                    <span>{booking.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span>{booking.numberOfPeople} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarDays className="h-4 w-4 text-orange-600" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock3 className="h-4 w-4 text-orange-600" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>

                {booking.note && (
                  <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-gray-700">
                    <span className="font-semibold">Note: </span>
                    {booking.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
