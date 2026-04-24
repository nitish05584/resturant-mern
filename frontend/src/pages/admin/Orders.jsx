import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Orders = () => {
  const { admin, axios, Loading, setLoading, navigate } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="14" fill="%23f3f4f6"/><path d="M26 62h44" stroke="%23d1d5db" stroke-width="6" stroke-linecap="round"/><path d="M32 30l12 18 10-14 10 14" stroke="%23f97316" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="38" cy="26" r="5" fill="%23fb923c"/></svg>';

  const localOrders = useMemo(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('localOrders') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await axios.get("/api/order/orders");

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/order/update-status/${orderId}`, {
        status: newStatus,
      });

      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchOrders();
    }
  }, [admin]);

  const hasBackendOrders = orders.length > 0;
  const hasLocalOrders = localOrders.length > 0;
  const backendOrdersCount = orders.length;
  const localOrdersCount = localOrders.length;
  const totalOrdersCount = backendOrdersCount + localOrdersCount;

  return (
    <div className="py-10 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
            <p className="text-gray-600 mt-1">Backend orders plus current browser checkout orders</p>
          </div>
          <button
            onClick={() => fetchOrders()}
            className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 transition"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Total Orders</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{loadingOrders ? '--' : totalOrdersCount}</p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Backend Orders</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">{loadingOrders ? '--' : backendOrdersCount}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Browser Orders</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{loadingOrders ? '--' : localOrdersCount}</p>
          </div>
        </div>

        {loadingOrders ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            Loading orders...
          </div>
        ) : !hasBackendOrders && !hasLocalOrders ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-lg font-semibold text-gray-800">No orders found yet</p>
            <p className="text-gray-600 mt-2">When customers place checkout orders, they will appear here.</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-5 rounded-lg bg-orange-600 px-5 py-2.5 text-white font-semibold hover:bg-orange-700 transition"
            >
              View Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {hasBackendOrders && (
              <div className="space-y-4">
                {orders.map((item) => (
                  <div key={item._id} className="bg-white shadow rounded-xl p-4 md:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2 items-start md:items-center">
                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">User</p>
                        <p className="font-semibold text-gray-900">
                          {item?.user?.name || 'Guest'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item?.user?.email || 'No email'}
                        </p>
                      </div>

                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Address</p>
                        <p className="font-medium text-gray-700 wrap-break-word">
                          {item?.address}
                        </p>
                      </div>

                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Total</p>
                        <p className="text-gray-900 font-semibold">₹{item?.totalAmount}</p>
                        <p className="text-xs text-gray-500">{item.paymentMethod || 'Cash on Delivery'}</p>
                      </div>

                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Status</p>
                        <select
                          name="status"
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          disabled={Loading}
                          className="border rounded-md px-3 py-2 bg-white w-full"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Order Time</p>
                        <p className="text-sm text-gray-700">
                          {new Date(item.createdAt || item.orderDate).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {item.items?.map((menu, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3"
                        >
                          <img
                            src={menu?.menuItem?.image || fallbackImage}
                            alt={menu?.menuItem?.name}
                            className="w-16 h-16 rounded object-cover"
                            onError={(event) => {
                              event.currentTarget.src = fallbackImage;
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{menu?.menuItem?.name}</p>
                            <p className="text-sm text-gray-600">QTY: {menu?.quantity}</p>
                            <p className="text-sm text-gray-600">₹{menu?.menuItem?.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasLocalOrders && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Browser Checkout Orders</h2>
                <div className="space-y-4">
                  {localOrders.map((order) => (
                    <div key={order.id} className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{String(order.id).slice(-6)}</p>
                          <p className="text-sm text-gray-600">Placed: {new Date(order.placedAt).toLocaleString()}</p>
                        </div>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {order.status || 'Order Confirmed'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                        <p><span className="font-semibold">Customer:</span> {order.deliveryDetails?.fullName}</p>
                        <p><span className="font-semibold">Phone:</span> {order.deliveryDetails?.phone}</p>
                        <p><span className="font-semibold">Address:</span> {order.deliveryDetails?.address}, {order.deliveryDetails?.city}</p>
                      </div>

                      <div className="mt-3 text-sm text-gray-700">
                        <span className="font-semibold">Payment:</span> {order.paymentMethod}
                      </div>

                      <div className="mt-4 space-y-2">
                        {order.items?.map((menuItem) => (
                          <div key={menuItem._id} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{menuItem.name}</p>
                              <p className="text-sm text-gray-600">Qty: {menuItem.quantity}</p>
                            </div>
                            <p className="font-bold text-orange-600">₹{(menuItem.price * menuItem.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <p className="text-lg font-bold text-gray-900">Total: ₹{Number(order.amount || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Orders;