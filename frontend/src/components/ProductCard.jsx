import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const discountedPrice = product.price - (product.price * product.discount) / 100;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group w-full cursor-pointer overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="relative flex h-52 w-full items-center justify-center p-6 transition duration-300"
        style={{
          backgroundColor: product.bgcolor || '#F3F4F6'
        }}
      >
        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            {product.discount}% OFF
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="h-36 w-36 object-contain transition duration-500 hover:scale-105"
        />
      </div>

      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: product.panelcolor || '#E5E7EB',
          color: product.textcolor || '#111827'
        }}
      >
        <div className="flex flex-col min-w-0 flex-1 pr-2">
          <h2 className="truncate text-sm font-semibold tracking-tight">{product.name}</h2>

          <div className="mt-0.5 flex items-baseline gap-1.5">
            {product.discount > 0 ? (
              <>
                <span className="text-sm font-bold">RS {discountedPrice.toFixed(0)}</span>
                <span className="text-[11px] opacity-60 line-through">RS {product.price}</span>
              </>
            ) : (
              <span className="text-sm font-bold">RS {product.price}</span>
            )}
          </div>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label="Add to cart"
        >
          <svg
            xmlns="http://w3.org"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
