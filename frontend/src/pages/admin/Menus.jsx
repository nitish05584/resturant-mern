import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Menus = () => {
  const { menus, fetchMenus, axios } = useContext(AppContext);
  const navigate = useNavigate();

  const deleteMenu = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        const { data } = await axios.delete(`/api/menu/delete/${id}`);
        if (data.success) {
          toast.success(data.message);
          fetchMenus();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting menu");
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">All Menu Items</h1>
        <button
          onClick={() => navigate('/admin/add-menu')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
        >
          Add New Menu
        </button>
      </div>

      {menus.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">No menu items found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Image</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Name</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Category</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Price</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Description</th>
                <th className="px-6 py-4 text-left text-gray-700 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((item) => (
                <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.category?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">₹{item.price}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => navigate(`/admin/update-menu/${item._id}`)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteMenu(item._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Menus;