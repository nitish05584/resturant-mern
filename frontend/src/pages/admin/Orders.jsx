import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Orders = () => {
  const { admin, axios, loading, setLoading, setAdmin, navigate } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const handleUnauthorized = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    toast.error("Admin session expired. Please login again.");
    navigate("/admin");
  };

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
      const statusCode = error?.response?.status;
      if (statusCode === 401 || statusCode === 403) {
        handleUnauthorized();
      } else {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
      }
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
      const statusCode = error?.response?.status;
      if (statusCode === 401 || statusCode === 403) {
        handleUnauthorized();
      } else {
        console.log(error);
        toast.error(error.response?.data?.message || 'Failed to update order status');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchOrders();
    }
  }, [admin]);

  const totalOrdersCount = orders.length;

  return (
    <div className="py-10 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
            <p className="text-gray-600 mt-1">Manage all customer orders from one place</p>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Pending</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">
              {loadingOrders
                ? '--'
                : orders.filter((order) => order.status === 'Pending').length}
            </p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Delivered</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {loadingOrders
                ? '--'
                : orders.filter((order) => order.status === 'Delivered').length}
            </p>
          </div>
        </div>

        {loadingOrders ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-lg font-semibold text-gray-800">No orders found yet</p>
            <p className="text-gray-600 mt-2">When customers place orders, they will appear here.</p>
          </div>
        ) : (
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
                      disabled={loading}
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
                      {menu?.menuItem?.image ? (
                        <img
                          src={menu.menuItem.image}
                          alt={menu?.menuItem?.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-200" />
                      )}
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
      </div>
    </div>
  );
};
export default Orders;