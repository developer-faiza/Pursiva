import { useEffect, useState } from 'react';

import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Navigation from '../components/Navigation';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [priceFilter, setPriceFilter] = useState('all');
  const [discountFilter, setDiscountFilter] = useState(false);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (priceFilter === 'low') {
      result.sort((a, b) => a.price - b.price);
    }
    if (priceFilter === 'high') {
      result.sort((a, b) => b.price - a.price);
    }
    if (discountFilter) {
      result = result.filter(product => product.discount > 0);
    }

    setFilteredProducts(result);
  }, [products, priceFilter, discountFilter]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          <p className="text-sm font-medium text-zinc-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans antialiased text-zinc-900">
      <Navigation />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">Shop</h2>

            <p className="mt-1 text-sm text-zinc-500">Explore our products</p>
          </div>
        </div>

        <div className="flex flex-col gap-10 md:flex-row items-start">
          <aside className="w-full shrink-0 md:w-48 sticky top-[80px]">
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Sort By
              </h3>
              <div className="flex flex-wrap gap-2 md:flex-col md:gap-3">
                <button
                  onClick={() => setPriceFilter('all')}
                  className={`text-left text-sm font-medium transition-colors ${priceFilter === 'all' ? 'text-black font-semibold' : 'text-zinc-500 hover:text-black'}`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setPriceFilter('low')}
                  className={`text-left text-sm font-medium transition-colors ${priceFilter === 'low' ? 'text-black font-semibold' : 'text-zinc-500 hover:text-black'}`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setPriceFilter('high')}
                  className={`text-left text-sm font-medium transition-colors ${priceFilter === 'high' ? 'text-black font-semibold' : 'text-zinc-500 hover:text-black'}`}
                >
                  Price: High to Low
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Filter By
              </h3>
              <button
                onClick={() => setDiscountFilter(!discountFilter)}
                className={`flex items-center justify-between w-full text-left text-sm font-medium transition-colors ${discountFilter ? 'text-black font-semibold' : 'text-zinc-500 hover:text-black'}`}
              >
                <span>Discounted Products</span>
                {discountFilter && <span className="h-1.5 w-1.5 rounded-full bg-black"></span>}
              </button>
            </div>
          </aside>

          <main className="flex-1 w-full">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-3">
              <p className="text-xs font-medium text-zinc-500">
                Showing {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-16 text-center shadow-sm">
                <svg
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mx-auto h-8 w-8 text-zinc-400 mb-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25A2.25 2.25 0 0 1 22.5 21h-21a2.25 2.25 0 0 1-2.25-2.25V15.75a2.25 2.25 0 0 1 2.25-2.25Z"
                  />
                </svg>
                <p className="text-sm font-medium text-zinc-500">
                  No matching products found matching filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-start">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
