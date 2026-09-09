import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import OWNER_API from '../services/ownerApi';

const OwnerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          OWNER_API.get('/products'),
          OWNER_API.get('/orders/all')
        ]);

        setProducts(productsResponse.data.products);
        setOrders(ordersResponse.data.orders);
      } catch (error) {
        console.error(
          'Failed to fetch dashboard data:',
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDelete = async productId => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');

    if (!confirmed) {
      return;
    }

    try {
      await OWNER_API.delete(`/products/${productId}`);

      setProducts(previousProducts =>
        previousProducts.filter(product => product._id !== productId)
      );
    } catch (error) {
      console.error('Failed to delete product:', error.response?.data?.message || error.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await OWNER_API.put(`/orders/${orderId}/status`, {
        status: newStatus
      });

      setOrders(previousOrders =>
        previousOrders.map(order => (order._id === orderId ? response.data.order : order))
      );
    } catch (error) {
      console.error(
        'Failed to update order status:',
        error.response?.data?.message || error.message
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Owner Dashboard</h1>

            <p className="mt-1 text-sm text-zinc-500">Manage your products and orders</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/products/create')}
              className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              + Create Product
            </button>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('ownerToken');
                navigate('/owner/login');
              }}
              className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">Products</h2>

            <p className="mt-1 text-sm text-zinc-500">Manage your store products</p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-zinc-500">No products found.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(product => (
                <div key={product._id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div
                    className="flex h-52 items-center justify-center p-6"
                    style={{
                      backgroundColor: product.bgcolor || '#f3f4f6'
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-40 w-40 object-contain"
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="truncate font-semibold text-zinc-900">{product.name}</h2>

                    <p className="mt-1 text-sm text-zinc-500">Rs. {product.price}</p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${product._id}/edit`)}
                        className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

       
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">Customer Orders</h2>

            <p className="mt-1 text-sm text-zinc-500">Manage orders placed by customers</p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-zinc-500">No orders found.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map(order => (
                <div key={order._id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-400">Order ID</p>

                      <p className="mt-1 text-sm font-semibold text-zinc-800">{order._id}</p>
                    </div>

                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold capitalize text-zinc-700 outline-none focus:border-zinc-900"
                    >
                      <option value="pending">Pending</option>

                      <option value="confirmed">Confirmed</option>

                      <option value="shipped">Shipped</option>

                      <option value="delivered">Delivered</option>

                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-sm font-bold text-zinc-900">Customer</h3>

                    <p className="mt-1 text-sm text-zinc-600">{order.user?.fullname}</p>

                    <p className="text-sm text-zinc-500">{order.user?.email}</p>
                  </div>

                  <div className="mt-5 space-y-3">
                    {order.products.map(item => (
                      <div key={item._id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg bg-zinc-100 object-contain p-2"
                        />

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-zinc-900">{item.name}</p>

                          <p className="text-sm text-zinc-500">
                            RS {item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-zinc-500">
                      <p>{order.shippingAddress.address}</p>

                      <p>
                        {order.shippingAddress.city} · {order.shippingAddress.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-400">Total</p>

                      <p className="text-lg font-bold text-zinc-900">
                        RS {order.totalAmount.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default OwnerDashboard;
