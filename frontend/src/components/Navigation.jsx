import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearCart();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="text-xl font-bold tracking-tight text-black"
        >
          Persiva
        </button>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="text-black transition-colors"
          >
            Shop
          </button>

          {token && (
            <button
              type="button"
              className="text-zinc-500 transition-colors hover:text-black"
              onClick={() => navigate('/myaccount')}
            >
              My Account
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="relative flex h-9 items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-95"
          >
            <span>Cart</span>

            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
              {totalItems}
            </span>
          </button>

          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-black"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-600"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
