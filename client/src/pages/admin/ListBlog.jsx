import React, { useCallback, useEffect, useState } from 'react'
import BlogTableItem from '../../component/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListBlog = () => {

  const [blogs, setBlogs] = useState([])
  const { axios } = useAppContext()

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/blogs')

      if (data.success) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <h1 className="text-lg font-semibold">All Blogs</h1>

      <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th className="px-2 py-2 xl:px-6">#</th>
              <th className="px-2 py-2">Blog Title</th>
              <th className="px-2 py-2 max-sm:hidden">Date</th>
              <th className="px-2 py-2 max-sm:hidden">Status</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog, index) => (
              <BlogTableItem
                key={blog._id}
                blog={blog}
                fetchBlogs={fetchBlogs}
                index={index + 1}
              />
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default ListBlog
