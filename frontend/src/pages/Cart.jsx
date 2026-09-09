import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../context/CartContext';
import Navigation from '../components/Navigation';

const Cart = () => {
  const { cart, loading, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  const navigate = useNavigate();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navigation />

        <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900"></div>

          <p className="mt-3 text-sm font-medium text-zinc-500">Loading cart...</p>
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

          <p className="mt-2 text-sm text-zinc-500">Looks like you haven't added anything yet.</p>

          <button
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
          <h1 className="text-3xl font-bold text-zinc-900">Shopping Cart</h1>

          <p className="mt-1 text-sm text-zinc-500">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.map(item => {
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={item._id}
                  className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div
                    className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: item.bgcolor || '#F3F4F6'
                    }}
                  >
                    <img src={item.image} alt={item.name} className="h-20 w-20 object-contain" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-zinc-900">{item.name}</h2>

                        <p className="mt-1 text-sm text-zinc-500">RS {item.price}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-xs font-semibold text-red-500 transition hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-lg border border-zinc-200">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="flex h-8 w-8 items-center justify-center text-zinc-600 transition hover:bg-zinc-100"
                        >
                          −
                        </button>

                        <span className="flex h-8 min-w-9 items-center justify-center border-x border-zinc-200 px-2 text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="flex h-8 w-8 items-center justify-center text-zinc-600 transition hover:bg-zinc-100"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-zinc-900">RS {itemTotal.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Order Summary</h2>

            <div className="mt-6 space-y-4 text-sm">
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

              <div className="border-t border-zinc-100 pt-4">
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>

                  <span>RS {subtotal.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-lg bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </button>

            <button
              onClick={() => navigate('/products')}
              className="mt-3 w-full rounded-lg border border-zinc-200 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
