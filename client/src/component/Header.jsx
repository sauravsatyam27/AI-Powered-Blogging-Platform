import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useRef } from 'react';

function Header() {

  // ⬅️ Global search input state from context
  const { setInput, input } = useAppContext();

  // ⬅️ Ref to directly access input value (uncontrolled input)
  const inputRef = useRef();

  // ⬅️ Search form submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault(); // page reload prevent
    setInput(inputRef.current.value); // search query set
  };

  // ⬅️ Clear search input & reset state
  const onClear = () => {
    setInput('');
    inputRef.current.value = '';
  };

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative '>
      <div className='text-center mt-20 mb-8'>

        {/* ⬅️ AI feature highlight badge */}
        <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm texr-primary'>
          <p>New: AI Feature integrated</p>
          <img src={assets.star_icon} alt="" className='w-2.5' />
        </div>

        {/* ⬅️ Main heading */}
        <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-grey-700'>
          Your Own <span className='text-primary'>blogging</span> <br />platform
        </h1>

        {/* ⬅️ Subtitle / description */}
        <p className='my-6 s,:my-8 max-2-2xl m-auto max-sm:text-xs text-grey-500'>
          This is your space to think out loud to share what matters, and to write without filters. Whether <br />
          it's one word or a thousand, your story starts right here.
        </p>

        {/* ⬅️ Search form */}
        <form
          onSubmit={onSubmitHandler}
          className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-grey-300 bg-white rounded overflow-hidden'
        >
          <input
            ref={inputRef}
            type="text"
            placeholder='Search for blog'
            required
            className='w-full pl-4 outline-none'
          />

          <button
            type='submit'
            className='bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer'
          >
            Search
          </button>
        </form>

      </div>

      {/* ⬅️ Clear button visible only when search is active */}
      <div className='text-center'>
        {input && (
          <button
            onClick={onClear}
            className='border font-light text-xs py-1 px-2 rrounded-sm shadow-custom-sm cursor-pointer'
          >
            Clear Search
          </button>
        )}
      </div>

      {/* ⬅️ Background decorative image */}
      <img
        src={assets.gradientBackground}
        alt=""
        className='absolute -top-50 -z-1 opacity-50'
      />

    </div>
  )
}

export default Header;
