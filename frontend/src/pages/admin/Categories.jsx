import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Trash2, Edit } from "lucide-react"
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const { categories, fetchCategories, axios } = useContext(AppContext)
  const navigate = useNavigate()

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const { data } = await axios.delete(`/api/category/delete/${id}`)
        if (data.success) {
          toast.success(data.message)
          fetchCategories()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting category")
      }
    }
  }

  const editCategory = async (category) => {
    const newName = window.prompt('Update category name', category.name)

    if (!newName || newName.trim() === '' || newName.trim() === category.name) {
      return
    }

    try {
      const { data } = await axios.put(`/api/category/update/${category._id}`, {
        name: newName.trim(),
      })

      if (data.success) {
        toast.success(data.message)
        fetchCategories()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating category')
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">All Categories</h1>
        <button
          onClick={() => navigate('/admin/add-category')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
        >
          Add New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{category.name}</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => editCategory(category)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Categories

