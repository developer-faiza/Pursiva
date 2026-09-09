import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { CartContext } from '../context/CartContext';
import API from '../services/api';

const MyAccount = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    contact: user?.contact || ''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await API.put('/users/profile', {
        fullname: formData.fullname,
        email: formData.email,
        contact: formData.contact
      });

      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUser(updatedUser);

      setFormData({
        fullname: updatedUser.fullname || '',
        email: updatedUser.email || '',
        contact: updatedUser.contact || ''
      });

      setIsEditing(false);

      toast.success(response.data.message);
    } catch (error) {
      console.error('Profile update failed:', error.response?.data?.message || error.message);

      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    clearCart();

    toast.success('Logged out successfully');

    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please Login</h2>

          <p className="mt-2 text-gray-500">You need to login to view your account.</p>

          <button
            onClick={() => navigate('/login')}
            className="mt-6 rounded-3xl bg-sky-500 px-6 py-3 text-white font-semibold hover:bg-sky-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>

          <p className="mt-1 text-gray-500">Manage your account and personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>

                <p className="text-sm text-gray-500 mt-1">Your account details</p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-3xl border border-sky-500 px-5 py-2 text-sm font-semibold text-sky-500 hover:bg-sky-500 hover:text-white transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>

                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>

                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="rounded-3xl bg-sky-500 px-6 py-3 text-white font-semibold hover:bg-sky-600 transition"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-3xl bg-gray-200 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500">Full Name</p>

                  <p className="mt-1 text-gray-800 font-medium">
                    {user.fullname || 'Not available'}
                  </p>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500">Email</p>

                  <p className="mt-1 text-gray-800 font-medium">{user.email || 'Not available'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contact</p>

                  <p className="mt-1 text-gray-800 font-medium">{user.contact || 'Not added'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Account</h2>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full text-left rounded-xl border border-gray-200 px-4 py-4 hover:border-sky-500 hover:bg-sky-50 transition"
              >
                <p className="font-semibold text-gray-800">My Orders</p>

                <p className="text-sm text-gray-500 mt-1">View your order history</p>
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full text-left rounded-xl border border-gray-200 px-4 py-4 hover:border-sky-500 hover:bg-sky-50 transition"
              >
                <p className="font-semibold text-gray-800">Continue Shopping</p>

                <p className="text-sm text-gray-500 mt-1">Browse our products</p>
              </button>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-red-50 px-4 py-4 text-left hover:bg-red-100 transition"
              >
                <p className="font-semibold text-red-600">Logout</p>

                <p className="text-sm text-red-400 mt-1">Sign out from your account</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
