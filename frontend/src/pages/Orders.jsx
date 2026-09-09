import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../services/api';
import Navigation from '../components/Navigation';

const Orders = () => {
  const getStatusClasses = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';

      case 'confirmed':
        return 'bg-blue-50 text-blue-700';

      case 'shipped':
        return 'bg-purple-50 text-purple-700';

      case 'delivered':
        return 'bg-green-50 text-green-700';

      case 'cancelled':
        return 'bg-red-50 text-red-700';

      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders');

        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navigation />

        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
          <p className="text-sm font-medium text-zinc-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">My Orders</h1>

          <p className="mt-1 text-sm text-zinc-500">View your previous orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-4xl">📦</div>

            <h2 className="text-xl font-bold text-zinc-900">No orders yet</h2>

            <p className="mt-2 text-sm text-zinc-500">Your placed orders will appear here.</p>

            <button
              type="button"
              onClick={() => navigate('/products')}
              className="mt-6 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order._id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Order ID
                    </p>

                    <p className="mt-1 text-sm font-semibold text-zinc-800">{order._id}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-zinc-400">Status</p>

                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {order.products.map(item => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-zinc-100 p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-zinc-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          RS {item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-zinc-900">
                        RS {(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-zinc-500">
                    <p>Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>

                    <p className="mt-1">Delivery: {order.shippingAddress.city}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-zinc-400">Total Amount</p>

                    <p className="mt-1 text-lg font-bold text-zinc-900">
                      RS {order.totalAmount.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
