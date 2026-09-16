import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import API from '../services/api';

import { registerSchema, loginSchema } from '../validations/user.validation';
import { CartContext } from '../context/CartContext';

const Auth = () => {
  const navigate = useNavigate();
  const { refreshCart } = useContext(CartContext);

  const [registerData, setRegisterData] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const [registerErrors, setRegisterErrors] = useState({});

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [loginErrors, setLoginErrors] = useState({});

  const handleRegisterChange = e => {
    const { name, value } = e.target;

    setRegisterData(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const handleLoginChange = e => {
    const { name, value } = e.target;

    setLoginData(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const handleRegister = async e => {
    e.preventDefault();

    const result = registerSchema.safeParse(registerData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach(issue => {
        const fieldName = issue.path[0];

        fieldErrors[fieldName] = issue.message;
      });

      setRegisterErrors(fieldErrors);

      return;
    }

    setRegisterErrors({});

    try {
      const response = await API.post('/users/register', result.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success(response.data.message);

      setRegisterData({
        fullname: '',
        email: '',
        password: ''
      });
      navigate('/products');

      refreshCart().catch(error => {
        console.error('Cart refresh failed:', error);
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
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
      const response = await API.post('/users/login', result.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success(response.data.message);

      setLoginData({
        email: '',
        password: ''
      });

      navigate('/products');

      refreshCart().catch(error => {
        console.error('Cart refresh failed:', error);
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-sky-50 px-8 md:px-12 py-12">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to <span className="text-sky-500">Pursiva</span>
          </h1>

          <p className="mt-2 mb-7 text-sm text-gray-600">Create your account</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={registerData.fullname}
                onChange={handleRegisterChange}
                className="w-full rounded-3xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-500"
              />

              {registerErrors.fullname && (
                <p className="mt-1 text-sm text-red-500">{registerErrors.fullname}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                className="w-full rounded-3xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-500"
              />

              {registerErrors.email && (
                <p className="mt-1 text-sm text-red-500">{registerErrors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                className="w-full rounded-3xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-500"
              />

              {registerErrors.password && (
                <p className="mt-1 text-sm text-red-500">{registerErrors.password}</p>
              )}
            </div>

            <div className="flex justify-center mt-11">
              <button
                type="submit"
                className="rounded-3xl bg-sky-500 px-6 py-3 text-white font-semibold hover:bg-sky-600 transition"
              >
                Create My Account
              </button>
            </div>
          </form>
        </div>

        <div className="absolute hidden md:flex left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-sky-500 text-white items-center justify-center font-semibold shadow-md">
          OR
        </div>

        <div className="w-full md:w-1/2 px-8 md:px-12 py-12 flex items-center">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800">Login your account</h2>

            <p className="mt-2 mb-7 text-sm text-gray-500">Welcome back! Please login.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full rounded-3xl border border-gray-200 bg-gray-100 px-4 py-3 outline-none focus:border-sky-500"
                />

                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{loginErrors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full rounded-3xl border border-gray-200 bg-gray-100 px-4 py-3 outline-none focus:border-sky-500"
                />

                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{loginErrors.password}</p>
                )}
              </div>

              <div className="flex justify-center mt-5">
                <button
                  type="submit"
                  className="rounded-3xl bg-sky-500 px-7 py-3 text-white font-semibold hover:bg-sky-600 transition"
                >
                  Login
                </button>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6 text-center ">
                <p className="text-sm text-gray-500">Are you the store owner?</p>

                <button
                  type="button"
                  onClick={() => navigate('/owner/login')}
                  className="mt-2 text-sm font-semibold text-sky-500 hover:text-sky-600"
                >
                  Login Here
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
