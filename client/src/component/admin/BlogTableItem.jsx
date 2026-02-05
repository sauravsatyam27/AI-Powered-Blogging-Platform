import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({ blog, fetchBlogs, index }) => {

  // ⬅️ Destructuring required blog fields
  const { title, createdAt } = blog;

  // ⬅️ Date ko readable format mein convert karne ke liye
  const BlogDate = new Date(createdAt);

  // ⬅️ Axios instance from global context
  const { axios } = useAppContext();

  // ⬅️ Blog delete handler (admin action)
  const deleteBlog = async () => {
    const confirm = window.confirm('Are you sure you want to delete this blog ?');

    // ⬅️ User ne cancel kar diya to function exit
    if (!confirm) return;

    try {
      const { data } = await axios.post('/api/blog/delete', { id: blog._id });

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs(); // ⬅️ Table refresh after delete
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ⬅️ Publish / Unpublish toggle handler
  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/api/blog/toggle-publish', { id: blog._id });

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs(); // ⬅️ Updated status fetch
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className='border-y border-gray-300'>
      <th className='px-2 py-4'>{index}</th>
      <td className='px-2 py-4'>{title}</td>

      {/* ⬅️ Hide date on small screens */}
      <td className='px-2 py-4 max-sm:hidden'>
        {BlogDate.toDateString()}
      </td>

      {/* ⬅️ Status indicator */}
      <td className='px-2 py-4 max-sm:hidden'>
        <p className={`${blog.isPublished ? "text-green-600" : "text-orange-700"}`}>
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </p>
      </td>

      {/* ⬅️ Action buttons */}
      <td className='px-2 py-4 flex text-xs gap-3'>
        <button
          onClick={togglePublish}
          className='border px-2 py-0.5 mt-1 rounded cursor-pointer'
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>

        <img
          onClick={deleteBlog}
          src={assets.cross_icon}
          alt=""
          className='w-8 hover:scale-110 transition-all cursor-pointer'
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
