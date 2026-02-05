import React from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const CommentsTableItem = ({ comment, fetchComments }) => {
  // ⬅️ Destructuring required comment fields
  const { _id, blog, createdAt, name, content, isApproved } = comment

  // ⬅️ Date formatting for UI display
  const BlogDate = new Date(createdAt)

  // ⬅️ Axios instance from global context
  const { axios } = useAppContext()

  // ⬅️ Approve comment handler (admin action)
  const approveComment = async () => {
    try {
      const { data } = await axios.post('/api/admin/approve-comment', {
        id: _id
      })

      if (data.success) {
        toast.success(data.message)
        fetchComments() // ⬅️ Refresh comments list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ⬅️ Delete comment handler (confirmation required)
  const deleteComment = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this comment?'
    )

    // ⬅️ Cancel pressed → exit function
    if (!confirmDelete) return

    try {
      const { data } = await axios.post('/api/admin/delete-comment', {
        id: _id
      })

      if (data.success) {
        toast.success(data.message)
        fetchComments() // ⬅️ Update table after delete
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        {/* ⬅️ Blog & comment details */}
        <b className="font-medium text-gray-600">Blog</b> : {blog?.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {content}
      </td>

      {/* ⬅️ Hide date on small screens */}
      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {/* ⬅️ Show approve icon only if comment is not approved */}
          {!isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt="Approve"
              className="w-5 cursor-pointer hover:scale-110 transition"
            />
          ) : (
            <span className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </span>
          )}

          {/* ⬅️ Delete action */}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="Delete"
            className="w-5 cursor-pointer hover:scale-110 transition"
          />
        </div>
      </td>
    </tr>
  )
}

export default CommentsTableItem
