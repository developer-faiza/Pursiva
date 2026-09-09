import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../context/CartContext';
import Navigation from '../components/Navigation';
import API from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, loading, clearCart } = useContext(CartContext);

  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    fullname: '',
    phone: '',
    address: '',
    city: ''
  });

  const [errors, setErrors] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleChange = e => {
    const { name, value } = e.target;

    setShippingData(previous => ({
      ...previous,
      [name]: value
    }));

    setErrors(previous => ({
      ...previous,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    if (!shippingData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!shippingData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!shippingData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await API.post('/orders', shippingData);

      clearCart();

      toast.success(response.data.message);

      setShippingData({
        fullname: '',
        phone: '',
        address: '',
        city: ''
      });

      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navigation />

        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
          <p className="text-sm font-medium text-zinc-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navigation />

        <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
            🛒
          </div>

          <h1 className="text-2xl font-bold text-zinc-900">Your cart is empty</h1>

          <p className="mt-2 text-sm text-zinc-500">Add some products before checkout.</p>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-6 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Checkout</h1>

          <p className="mt-1 text-sm text-zinc-500">Complete your order</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Delivery Information */}

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Delivery Information</h2>

            <div className="mt-6 space-y-5">
              {/* Full Name */}

              <div>
                <label htmlFor="fullname" className="mb-2 block text-sm font-medium text-zinc-700">
                  Full Name
                </label>

                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  placeholder="Enter your full name"
                  value={shippingData.fullname}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                />

                {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
              </div>

              {/* Phone */}

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-zinc-700">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={shippingData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                />

                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-zinc-700">
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows="4"
                  placeholder="Enter your complete delivery address"
                  value={shippingData.address}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                />

                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>

              {/* City */}

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium text-zinc-700">
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={shippingData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
                />

                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Order Summary */}

          <div className="h-fit rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cart.map(item => {
                const itemTotal = item.price * item.quantity;

                return (
                  <div key={item._id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900">{item.name}</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {item.quantity} × RS {item.price}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-zinc-900">
                      RS {itemTotal.toFixed(0)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>RS {subtotal.toFixed(0)}</span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>

                <span className="font-semibold text-green-600">FREE</span>
              </div>

              <div className="flex justify-between border-t border-zinc-100 pt-4 text-base font-bold text-zinc-900">
                <span>Total</span>

                <span>RS {subtotal.toFixed(0)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="mt-6 w-full rounded-lg bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              disabled={placingOrder}
              className="mt-3 w-full rounded-lg border border-zinc-200 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
