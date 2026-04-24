import React, { useState } from 'react'
import {
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  SendHorizonal,
  UserRound
} from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [sending, setSending] = useState(false)

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setSending(true)

      await new Promise((resolve) => setTimeout(resolve, 700))

      toast.success('Message sent successfully! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error(error)
      toast.error('Unable to send message right now. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl bg-linear-to-r from-orange-600 via-orange-500 to-red-600 px-6 py-10 text-white shadow-lg">
          <h1 className="text-4xl font-black">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-orange-100">
            Have a question about booking, catering, or your recent order? Reach out and our team will help you quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Get In Touch</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-sm text-gray-600">123 Food Street, City Center, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-sm text-gray-600">+91 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-sm text-gray-600">support@restaurant.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Clock3 className="h-5 w-5 text-orange-600" />
                Opening Hours
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="font-semibold">10:00 AM - 12:00 AM</span>
                </div>
                <p className="pt-2 text-xs text-gray-500">Kitchen closes 30 minutes before closing time.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <h3 className="mb-2 font-bold text-gray-800">Need urgent help?</h3>
              <p className="text-sm text-gray-700">For immediate support, call us directly and our team will assist you.</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                <MessageSquare className="h-6 w-6 text-orange-600" />
                Send Us A Message
              </h2>

              <form onSubmit={onSubmitHandler} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name *</label>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChangeHandler}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChangeHandler}
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={onChangeHandler}
                        placeholder="Optional"
                        className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={onChangeHandler}
                      placeholder="Booking / Order / Feedback"
                      className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={onChangeHandler}
                    rows="6"
                    placeholder="Write your message here"
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
                >
                  <SendHorizonal className="h-4 w-4" />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
