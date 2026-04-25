import { useContext, useEffect, useMemo, useState } from 'react'
import {
  Package,
  Grid3X3,
  ShoppingCart,
  BookAIcon,
  IndianRupee,
  AlertTriangle,
  Clock3,
  CalendarCheck2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

const getStatusStyles = (status) => {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'delivered' || normalized === 'confirmed') {
    return 'bg-green-100 text-green-700 border-green-200'
  }
  if (normalized === 'preparing' || normalized === 'pending') {
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }
  if (normalized === 'cancelled') {
    return 'bg-red-100 text-red-700 border-red-200'
  }
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

const isToday = (dateValue) => {
  if (!dateValue) return false
  const date = new Date(dateValue)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const Dashboard = () => {
  const { menus, categories, axios, admin } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchDashboardData = async () => {
    if (!admin) return

    try {
      setLoading(true)
      setError('')

      const [ordersRes, bookingsRes] = await Promise.allSettled([
        axios.get('/api/order/orders'),
        axios.get('/api/booking/bookings'),
      ])

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.success) {
        setOrders(ordersRes.value.data.orders || [])
      } else {
        setOrders([])
      }

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data?.success) {
        setBookings(bookingsRes.value.data.bookings || [])
      } else {
        setBookings([])
      }

      if (ordersRes.status === 'rejected' || bookingsRes.status === 'rejected') {
        setError('Some dashboard data could not be loaded. Please refresh.')
      }

      setLastUpdated(new Date())
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [admin])

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0)
    const pendingOrders = orders.filter((item) => {
      const status = (item.status || '').toLowerCase()
      return status === 'pending' || status === 'preparing'
    }).length

    const confirmedBookings = bookings.filter((item) => (item.status || '').toLowerCase() === 'confirmed').length
    const pendingBookings = bookings.filter((item) => (item.status || '').toLowerCase() === 'pending').length
    const todayOrders = orders.filter((item) => isToday(item.createdAt)).length
    const todayBookings = bookings.filter((item) => isToday(item.date)).length

    return {
      totalMenus: menus.length,
      totalCategories: categories.length,
      totalOrders: orders.length,
      totalBookings: bookings.length,
      totalRevenue,
      pendingOrders,
      confirmedBookings,
      pendingBookings,
      todayOrders,
      todayBookings,
    }
  }, [menus, categories, orders, bookings])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [orders])

  const upcomingBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
  }, [bookings])

  const statCards = [
    {
      label: 'Total Menus',
      value: stats.totalMenus,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/menus',
      hint: 'Items available to customers',
    },
    {
      label: 'Total Categories',
      value: stats.totalCategories,
      icon: Grid3X3,
      color: 'from-green-500 to-emerald-600',
      link: '/admin/categories',
      hint: 'Organized food sections',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-orange-500 to-amber-600',
      link: '/admin/orders',
      hint: `${stats.todayOrders} placed today`,
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: BookAIcon,
      color: 'from-fuchsia-500 to-pink-600',
      link: '/admin/bookings',
      hint: `${stats.todayBookings} bookings for today`,
    },
    {
      label: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: IndianRupee,
      color: 'from-cyan-500 to-sky-600',
      link: '/admin/orders',
      hint: 'Total from all orders',
    },
    {
      label: 'Pending Actions',
      value: stats.pendingOrders + stats.pendingBookings,
      icon: AlertTriangle,
      color: 'from-rose-500 to-red-600',
      link: '/admin/orders',
      hint: `${stats.pendingOrders} orders + ${stats.pendingBookings} bookings`,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-cyan-400/20 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Restaurant Control Center</h1>
            <p className="text-sm md:text-base text-blue-100 mt-2">
              Monitor menu, bookings, and orders in one place.
            </p>
            {lastUpdated && (
              <p className="text-xs text-blue-200 mt-2">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              to={card.link}
              key={card.label}
              className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1 wrap-break-word">{loading ? '--' : card.value}</p>
                  <p className="text-xs text-slate-500 mt-2">{card.hint}</p>
                </div>

                <div className={`rounded-lg bg-linear-to-br ${card.color} p-3 text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700 group-hover:gap-2 transition-all">
                Open
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          )
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders available yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {order?.user?.name || 'Guest'}
                    </p>
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${getStatusStyles(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {Number(order.totalAmount || 0).toFixed(0)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Bookings</h2>
            <Link to="/admin/bookings" className="text-sm font-medium text-blue-700 hover:text-blue-800">
              View all
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <p className="text-sm text-slate-500">No bookings available yet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{booking.name || 'Customer'}</p>
                    <span className={`text-xs border rounded-full px-2 py-0.5 ${getStatusStyles(booking.status)}`}>
                      {booking.status || 'Pending'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <CalendarCheck2 className="h-3.5 w-3.5" />
                      {booking.date ? new Date(booking.date).toLocaleDateString() : '-'}
                    </span>
                    <span>{booking.time || '-'}</span>
                    <span>{booking.numberOfPeople || 0} guests</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/add-menu" className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 hover:bg-blue-100 transition">
            Add New Menu Item
          </Link>
          <Link to="/admin/add-category" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition">
            Create Category
          </Link>
          <Link to="/admin/orders" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 hover:bg-amber-100 transition">
            Manage Orders
          </Link>
          <Link to="/admin/bookings" className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 px-4 py-3 text-sm font-medium text-fuchsia-800 hover:bg-fuchsia-100 transition">
            Manage Bookings
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
