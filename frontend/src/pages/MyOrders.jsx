import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Clock3, Package, ShoppingBag, Truck } from 'lucide-react'
import toast from 'react-hot-toast'

const MyOrders = () => {
  const { axios, user, navigate } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const localOrders = useMemo(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('localOrders') || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error(error)
      return []
    }
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoadingOrders(false)
        return
      }

      try {
        setLoadingOrders(true)
        const { data } = await axios.get('/api/order/my-orders')
        if (data?.success) {
          setOrders(data.orders || [])
        } else {
          toast.error(data?.message || 'Could not fetch your orders')
        }
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Could not fetch your orders')
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [axios, user])

  const getStatusClasses = (status) => {
    const value = String(status || '').toLowerCase()
    if (value === 'delivered' || value === 'order confirmed') return 'bg-green-100 text-green-700'
    if (value === 'preparing' || value === 'pending') return 'bg-amber-100 text-amber-700'
    if (value === 'cancelled') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-md">
          <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-3 text-gray-600">Please login to see your order history.</p>
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

  if (loadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="rounded-2xl bg-white p-8 text-center shadow-md text-gray-600">Loading your orders...</div>
        </div>
      </div>
    )
  }

  const hasBackendOrders = orders.length > 0
  const hasLocalOrders = localOrders.length > 0

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl bg-linear-to-r from-orange-600 to-red-600 p-7 text-white">
          <h1 className="text-3xl font-black">My Orders</h1>
          <p className="mt-2 text-orange-100">Track your latest food orders and delivery status.</p>
        </div>

        {!hasBackendOrders && !hasLocalOrders && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <Package className="mx-auto mb-4 h-12 w-12 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">No orders yet</h2>
            <p className="mt-2 text-gray-600">You have not placed any order yet. Start by exploring the menu.</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Browse Menu
            </button>
          </div>
        )}

        {hasBackendOrders && (
          <div className="mb-8 space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">#{order._id?.slice(-8)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock3 className="h-4 w-4" />
                    <p className="text-sm">{new Date(order.createdAt || order.orderDate).toLocaleString()}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={`${order._id}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-800">{item.menuItem?.name || 'Menu Item'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-orange-600">₹{((item.menuItem?.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">Delivery Address: <span className="font-semibold text-gray-800">{order.address}</span></p>
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Truck className="h-5 w-5 text-orange-600" />
                    ₹{order.totalAmount?.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasLocalOrders && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Checkout Orders</h2>
            {localOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-gray-800">Order #{order.id?.slice(-6)}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{new Date(order.placedAt).toLocaleString()}</p>
                <p className="mt-2 text-sm text-gray-700">Items: {order.items?.length || 0}</p>
                <p className="text-sm text-gray-700">Payment: {(order.paymentMethod || '').toUpperCase()}</p>
                <p className="mt-2 text-lg font-bold text-orange-700">Total: ₹{Number(order.amount || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
