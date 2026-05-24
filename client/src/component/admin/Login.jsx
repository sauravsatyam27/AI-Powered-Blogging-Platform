import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

  // ⬅️ axios, auth token setter & navigation from global context
  const { axios, setAdminSession, navigate } = useAppContext();

  // ⬅️ Controlled form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ⬅️ Login form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // page reload prevent

    try {
      // ⬅️ Admin login API call
      const { data } = await axios.post('/api/admin/login', {
        email,
        password
      });

      if (data.success) {
        // ⬅️ Token ko global state + localStorage dono mein save kar rahe hain
        setAdminSession(data.token);

        toast.success('Login successful');

        // ⬅️ Successful login ke baad admin dashboard redirect
        navigate('/admin');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">

          {/* ⬅️ Login heading */}
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> Login
            </h1>
            <p className="font-light">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            {/* ⬅️ Email input */}
            <div className="flex flex-col">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            {/* ⬅️ Password input */}
            <div className="flex flex-col">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            {/* ⬅️ Submit button */}
            <button
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
