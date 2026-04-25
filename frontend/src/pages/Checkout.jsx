import React, { useContext, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext'
import {
  ArrowLeft,
  CreditCard,
  Landmark,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cart, clearCart, navigate, user, axios } = useContext(AppContext)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    notes: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [placingOrder, setPlacingOrder] = useState(false)

  const { subtotal, deliveryFee, tax, total } = useMemo(() => {
    const itemSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const itemDeliveryFee = itemSubtotal > 0 ? 50 : 0
    const itemTax = itemSubtotal * 0.05

    return {
      subtotal: itemSubtotal,
      deliveryFee: itemDeliveryFee,
      tax: itemTax,
      total: itemSubtotal + itemDeliveryFee + itemTax
    }
  }, [cart])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields')
      return false
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Phone number must be 10 digits')
      return false
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      toast.error('Pincode must be 6 digits')
      return false
    }

    return true
  }

  const placeOrder = async (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!user) {
      toast.error('Please login to place your order')
      navigate('/login')
      return
    }

    if (!validateForm()) return

    try {
      setPlacingOrder(true)

      const paymentMethodMap = {
        cod: 'Cash on Delivery',
        upi: 'UPI',
        card: 'Card Payment'
      }

      const fullAddress = [
        formData.address,
        formData.city,
        `Pincode: ${formData.pincode}`,
        formData.landmark ? `Landmark: ${formData.landmark}` : '',
        formData.notes ? `Note: ${formData.notes}` : ''
      ]
        .filter(Boolean)
        .join(', ')

      const orderItems = cart
        .map((item) => ({
          menuItem: item?._id || item?.id,
          quantity: Number(item?.quantity) || 1
        }))
        .filter((item) => item.menuItem)

      if (orderItems.length === 0) {
        toast.error('Your cart has invalid items. Please add items again.')
        return
      }

      const payload = {
        address: fullAddress,
        paymentMethod: paymentMethodMap[paymentMethod] || 'Cash on Delivery',
        items: orderItems
      }

      const { data } = await axios.post('/api/order/place', payload)

      if (!data?.success) {
        toast.error(data?.message || 'Could not place order, please try again')
        return
      }

      clearCart()
      toast.success('Order placed successfully!')
      navigate('/my-orders')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not place order, please try again')
      console.error(error)
    } finally {
      setPlacingOrder(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-100 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-orange-500" />
          <h1 className="text-3xl font-black text-gray-900">Your cart is empty</h1>
          <p className="mt-3 text-gray-600">Add delicious dishes before moving to checkout.</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-white px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl bg-linear-to-r from-orange-600 to-red-600 px-6 py-8 text-white shadow-lg">
          <h1 className="text-3xl font-black sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-orange-100">Complete your delivery details and place your order securely.</p>
        </div>

        <form onSubmit={placeOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800">
                <MapPin className="h-5 w-5 text-orange-600" />
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={onChangeHandler}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onChangeHandler}
                      placeholder="10 digit mobile number"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={onChangeHandler}
                    placeholder="Flat / House no, Street, Area"
                    rows="3"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={onChangeHandler}
                    placeholder="City"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={onChangeHandler}
                    placeholder="6 digit pincode"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={onChangeHandler}
                    placeholder="Nearby landmark (optional)"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Delivery Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={onChangeHandler}
                    placeholder="Any instruction for delivery partner"
                    rows="2"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800">
                <CreditCard className="h-5 w-5 text-orange-600" />
                Payment Method
              </h2>

              <div className="grid gap-3">
                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when your order arrives</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-orange-600"
                  />
                </label>

                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">UPI</p>
                      <p className="text-sm text-gray-500">Google Pay / PhonePe / Paytm</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-orange-600"
                  />
                </label>

                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Card Payment</p>
                      <p className="text-sm text-gray-500">Credit / Debit card</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-orange-600"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800">
                <PackageCheck className="h-5 w-5 text-orange-600" />
                Order Summary
              </h2>

              <div className="mb-5 max-h-56 space-y-3 overflow-auto pr-1">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-b border-gray-200 py-4 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-base font-semibold text-gray-800">Grand Total</p>
                <p className="text-2xl font-black text-orange-600">₹{total.toFixed(2)}</p>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="mt-5 w-full rounded-xl bg-orange-600 py-3 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="mt-3 w-full rounded-xl border border-orange-600 py-3 font-bold text-orange-600 transition hover:bg-orange-50"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
