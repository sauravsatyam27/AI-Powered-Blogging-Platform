import React, { useEffect, useState } from 'react'
import CommentsTableItem from '../../component/admin/CommentsTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

function Comments() {
  // ⬅️ All comments state
  const [comments, setComments] = useState([])

  // ⬅️ Filter state (Approved / Not Approved)
  const [filter, setFilter] = useState('Not Approved')

  // ⬅️ Axios from global context
  const { axios } = useAppContext()

  // ⬅️ Fetch all comments for admin
  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/admin/comments')

      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ⬅️ Load comments on page mount
  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1 className="text-lg font-semibold">Comments</h1>

        {/* ⬅️ Filter buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-1 text-xs ${
              filter === 'Approved' ? 'text-primary' : 'text-gray-700'
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setFilter('Not Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-1 text-xs ${
              filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>

      {/* ⬅️ Comments table */}
      <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase">
            <tr>
              <th className="px-6 py-3">Blog Title & Comment</th>
              <th className="px-6 py-3 max-sm:hidden">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* ⬅️ Filter comments based on approval status */}
            {comments
              .filter((comment) =>
                filter === 'Approved'
                  ? comment.isApproved === true
                  : comment.isApproved === false
              )
              .map((comment) => (
                <CommentsTableItem
                  key={comment._id}
                  comment={comment}
                  fetchComments={fetchComments}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Comments
