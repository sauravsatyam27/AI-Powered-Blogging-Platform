import React from 'react'
import { useNavigate } from 'react-router-dom';

function BlogCard({ blog }) {

  // ⬅️ Required blog fields
  const { title, description, category, image, _id } = blog;

  // ⬅️ Navigation hook for redirecting to blog detail page
  const navigate = useNavigate();

  return (
    <div
      // ⬅️ Card click → navigate to specific blog page
      onClick={() => navigate(`/blog/${_id}`)}
      className='w-full rounded-lg overflow-hidden shadow hover:scale-105 hover:shadow-primary/25 duration-300 cursor-pointer'
    >
      {/* ⬅️ Blog cover image */}
      <img src={image} alt="" className='aspect-video' />

      {/* ⬅️ Blog category badge */}
      <span className='ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs '>
        {category}
      </span>

      <div className='p-5'>
        {/* ⬅️ Blog title */}
        <h5 className='mb-2 font-medium text-green-900'>{title}</h5>

        {/* ⬅️ Short preview of blog content (HTML allowed) */}
        <p
          className='mb-3 text-xs text-gray-600'
          dangerouslySetInnerHTML={{ "__html": description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  )
}

export default BlogCard;
