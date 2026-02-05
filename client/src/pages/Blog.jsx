import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../component/Navbar'
import moment from 'moment'
import Footer from '../component/Footer'
import Loader from '../component/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

function Blog() {
  // ⬅️ Blog ID from URL ( /blog/:id )
  const { id } = useParams()

  // ⬅️ Axios instance from global context
  const { axios } = useAppContext()

  // ⬅️ Blog data & comments state
  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])

  // ⬅️ Comment form state
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  /* ================= FETCH BLOG ================= */
  const fetchBlogData = async () => {
    try {
      // ⬅️ Fetch single blog using ID
      const { data } = await axios.get(`/api/blog/${id}`)

      if (data.success) {
        setData(data.blog)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /* ================= FETCH COMMENTS ================= */
  const fetchComments = async () => {
    try {
      // ⬅️ Fetch only approved comments for this blog
      const { data } = await axios.post('/api/blog/comment', {
        blogId: id
      })

      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /* ================= ADD COMMENT ================= */
  const addComment = async (e) => {
    e.preventDefault() // page reload prevent

    try {
      // ⬅️ Submit new comment (approval required by admin)
      const { data } = await axios.post('/api/blog/add-comment', {
        blog: id,
        name,
        content
      })

      if (data.success) {
        toast.success(data.message)

        // ⬅️ Clear form + refresh comments
        setName('')
        setContent('')
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ⬅️ Initial load: blog data + comments
  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [])

  // ⬅️ Loader until blog data arrives
  if (!data) return <Loader />

  return (
    <div className="relative">
      {/* ⬅️ Decorative background */}
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />

      <Navbar />

      {/* ===== Blog Header ===== */}
      <div className="text-center mt-20 text-gray-600">
        {/* ⬅️ Publish date */}
        <p className="text-primary py-4 font-medium">
          Published on {moment(data.createdAt).format('MMMM Do YYYY')}
        </p>

        {/* ⬅️ Blog title */}
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>

        {/* ⬅️ Sub-title */}
        <h2 className="my-5 max-w-lg truncate mx-auto">
          {data.subTitle}
        </h2>

        {/* ⬅️ Category badge */}
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          {data.category}
        </p>
      </div>

      {/* ===== Blog Content ===== */}
      <div className="mx-5 max-w-7xl md:mx-auto my-10 mt-6">
        {/* ⬅️ Blog cover image */}
        <img src={data.image} alt="" className="rounded-3xl mb-5" />

        {/* ⬅️ Rich text content (HTML from editor) */}
        <div
          className="rich-text max-w-6xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />

        {/* ===== Comments List ===== */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">
            Comments ({comments.length})
          </p>

          <div className="flex flex-col gap-4">
            {comments.map((item) => (
              <div
                key={item._id}
                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
              >
                {/* ⬅️ Comment author */}
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="" className="w-6" />
                  <p className="font-medium">{item.name}</p>
                </div>

                {/* ⬅️ Comment content */}
                <p className="text-sm max-w-md ml-8">
                  {item.content}
                </p>

                {/* ⬅️ Relative time (e.g. 2 hours ago) */}
                <div className="absolute right-4 bottom-3 text-xs">
                  {moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Add Comment ===== */}
        <div className="max-w-3xl mx-auto mt-16">
          <p className="font-semibold mb-4">Add your comment</p>

          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            {/* ⬅️ User name */}
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
            />

            {/* ⬅️ Comment text */}
            <textarea
              placeholder="Comment"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded outline-none h-40 resize-none focus:border-primary"
            />

            <button
              type="submit"
              className="bg-primary text-white rounded px-8 py-2 hover:scale-105 transition-all duration-200"
            >
              Submit
            </button>
          </form>
        </div>

        {/* ===== Share Section ===== */}
        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex gap-2">
            <img src={assets.facebook_icon} width={40} />
            <img src={assets.twitter_icon} width={40} />
            <img src={assets.googleplus_icon} width={40} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default Blog
