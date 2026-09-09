import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OWNER_API from '../services/ownerApi';
import { loginSchema } from '../validations/user.validation';
import { toast } from 'react-toastify';

const OwnerLogin = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [loginErrors, setLoginErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;

    setLoginData(previous => ({
      ...previous,
      [name]: value
    }));

    setLoginErrors(previous => ({
      ...previous,
      [name]: ''
    }));
  };

  const handleLogin = async e => {
    e.preventDefault();

    const result = loginSchema.safeParse(loginData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach(issue => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });

      setLoginErrors(fieldErrors);
      return;
    }

    setLoginErrors({});

    try {
      const response = await OWNER_API.post('/owner/login', result.data);

      localStorage.setItem('ownerToken', response.data.token);

      toast.success(response.data.message);

      setLoginData({
        email: '',
        password: ''
      });

      navigate('/owner/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Owner login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Pursiva</h1>

          <p className="mt-2 text-sm text-gray-500">Owner Dashboard Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Owner Email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full rounded-3xl border border-gray-200 bg-gray-100 px-4 py-3 outline-none focus:border-sky-500"
            />

            {loginErrors.email && <p className="mt-1 text-sm text-red-500">{loginErrors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Owner Password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full rounded-3xl border border-gray-200 bg-gray-100 px-4 py-3 outline-none focus:border-sky-500"
            />

            {loginErrors.password && (
              <p className="mt-1 text-sm text-red-500">{loginErrors.password}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-3xl bg-sky-500 px-7 py-3 text-white font-semibold hover:bg-sky-600 transition"
            >
              Owner Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
