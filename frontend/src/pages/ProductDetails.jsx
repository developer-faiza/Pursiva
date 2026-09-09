import { useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import API from '../services/api';

import { CartContext } from '../context/CartContext';

import Navigation from '../components/Navigation';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>

          <p className="text-sm font-medium text-zinc-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50">
        <p className="rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error || 'Product not found'}
        </p>

        <button
          type="button"
          onClick={() => navigate('/products')}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow transition-colors hover:bg-zinc-800"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await API.delete(`/products/${id}`);

      toast.success('Product deleted successfully');

      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans antialiased text-zinc-900">
      <Navigation />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid items-start gap-8 md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            {/* Product Image */}
            <div
              className="relative flex h-80 w-full items-center justify-center p-8"
              style={{
                backgroundColor: product.bgcolor || '#F3F4F6'
              }}
            >
              {product.discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {product.discount}% OFF
                </span>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="max-h-60 w-[70%] object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Product Information */}
            <div
              className="px-5 py-4"
              style={{
                backgroundColor: product.panelcolor || '#F9FAFB',
                color: product.textcolor || '#111827'
              }}
            >
              <div className="flex items-end justify-between gap-4">
                {/* Product Name */}
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-50">
                    Product
                  </p>

                  <h1 className="truncate text-lg font-bold tracking-tight">{product.name}</h1>
                </div>

                {/* Product Price */}
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-50">
                    Price
                  </p>

                  <p className="text-lg font-extrabold">RS {discountedPrice.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Edit & Delete Buttons */}
            <div className="flex gap-3 border-t border-zinc-100 bg-white p-4">
              <button
                type="button"
                onClick={() => navigate(`/products/${product._id}/edit`)}
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Edit Product
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl border border-red-100 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {/* Price Breakdown */}
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-zinc-400">
              Price Breakdown
            </h2>

            <div className="space-y-3.5 text-sm">
              {/* MRP */}
              <div className="flex items-center justify-between text-zinc-600">
                <span>Total MRP</span>

                <span className="font-medium text-zinc-900">RS {product.price}</span>
              </div>

              {/* Discount */}
              {product.discount > 0 && (
                <div className="flex items-center justify-between text-red-600">
                  <span>Discount on MRP</span>

                  <span className="font-semibold">
                    -RS {((product.price * product.discount) / 100).toFixed(0)}
                  </span>
                </div>
              )}

              {/* Platform Fee */}
              <div className="flex items-center justify-between text-zinc-600">
                <span>Platform Fee</span>

                <span className="font-medium text-zinc-900">RS 20</span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-zinc-600">
                <span>Shipping Fee</span>

                <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                  FREE
                </span>
              </div>

              {/* Total */}
              <div className="my-4 flex items-end justify-between border-t border-zinc-100 pt-4 text-base font-bold">
                <span className="text-zinc-900">Total Amount</span>

                <span className="text-lg font-extrabold text-zinc-950">
                  RS {(discountedPrice + 20).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Quantity
              </span>

              <div className="flex items-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                  className="px-3 py-1.5 font-bold text-zinc-600 transition-colors hover:bg-zinc-200 active:bg-zinc-300"
                >
                  −
                </button>

                <span className="min-w-[24px] px-3 text-center text-xs font-bold text-zinc-800">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1.5 font-bold text-zinc-600 transition-colors hover:bg-zinc-200 active:bg-zinc-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Cart Buttons */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full rounded-lg bg-zinc-900 py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition-all hover:bg-zinc-800 active:scale-[0.99]"
              >
                Place Order / Add to Cart
              </button>

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="w-full rounded-lg border border-zinc-200 bg-white py-3 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
