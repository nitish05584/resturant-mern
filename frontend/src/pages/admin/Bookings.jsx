import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Bookings = () => {
  const { admin, axios, loading, setLoading } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const { data } = await axios.get("/api/booking/bookings");

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/booking/update-status/${bookingId}`,
        {
          status: newStatus,
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchBookings();
    }
  }, [admin]);

  const getStatusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="py-24 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 my-3">
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <button
          onClick={fetchBookings}
          className="rounded-lg bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700 transition"
        >
          Refresh
        </button>
      </div>

      <div className="border border-gray-400 max-w-5xl mx-auto p-3 rounded-lg">
        {loadingBookings ? (
          <div className="py-10 text-center text-gray-600">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="py-10 text-center text-gray-600">No bookings found</div>
        ) : (
          <>
        {/* Header */}
        <div className="hidden md:grid grid-cols-6 font-semibold text-gray-700 mb-4">
          <div>Name</div>
          <div>Phone</div>
          <div>Persons</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
        </div>
        {/* Items */}
        <ul className="space-y-4">
          {bookings.map((item) => (
            <li key={item._id} className="border rounded-lg p-3 md:p-2">
              <div className="flex flex-col md:grid md:grid-cols-6 md:items-center gap-2 md:gap-0">
                <p className="font-medium text-center md:text-left">
                  {item?.name}
                </p>
                <p className="font-medium text-center md:text-left">
                  {item?.phone}
                </p>
                <p className="text-gray-600 hidden md:block">
                  {item?.numberOfPeople}
                </p>
                <p className="text-gray-600 hidden md:block">
                  {new Date(item?.date).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-600 hidden md:block">{item?.time}</p>
                <div className="flex justify-center md:justify-start items-center gap-2 md:gap-5 mt-2 md:mt-0">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <select
                    name="status"
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    disabled={loading}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
        </>
        )}
      </div>
    </div>
  );
};
export default Bookings;