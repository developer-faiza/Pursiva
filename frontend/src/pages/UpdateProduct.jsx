import { useEffect, useState } from 'react';

import API from '../services/api';
import OWNER_API from '../services/ownerApi';

import { productSchema, updateProductSchema } from '../validations/product.validation';

import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: '',
    name: '',
    price: '',
    discount: '',
    bgcolor: '',
    panelcolor: '',
    textcolor: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);

        const product = response.data.product;

        setFormData({
          image: product.image || '',
          name: product.name || '',
          price: product.price ?? '',
          discount: product.discount ?? 0,
          bgcolor: product.bgcolor || '',
          panelcolor: product.panelcolor || '',
          textcolor: product.textcolor || ''
        });
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = e => {
    const { name, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));

    setErrors(previous => ({
      ...previous,
      [name]: ''
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const result = updateProductSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach(issue => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('discount', formData.discount);
      data.append('bgcolor', formData.bgcolor);
      data.append('panelcolor', formData.panelcolor);
      data.append('textcolor', formData.textcolor);

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      await OWNER_API.put(`/products/${id}`, data);

      toast.success('Product updated successfully');
      navigate('/owner/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />

            <p className="text-sm font-medium text-sky-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-4 text-center shadow-sm">
            <p className="text-sm font-medium text-red-500">{error}</p>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-xl shadow-sky-100/60">
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-7 text-white sm:px-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
            Product Management
          </p>

          <h1 className="text-3xl font-bold">Update Product</h1>

          <p className="mt-2 text-sm text-sky-100">Make changes to your product information.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8">
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 ml-1 block text-sm font-semibold text-slate-700">
              Product Image
            </label>
            {formData.image && typeof formData.image === 'string' && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">Current Image</p>

                <img
                  src={formData.image}
                  alt={formData.name}
                  className="h-32 w-32 rounded-xl object-contain border border-sky-100 p-2"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

            {errors.image && (
              <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{errors.image}</p>
            )}
          </div>

          <div>
            <label className="mb-2 ml-1 block text-sm font-semibold text-slate-700">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

            {errors.name && (
              <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 ml-1 block text-sm font-semibold text-slate-700">Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2000"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

              {errors.price && (
                <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="mb-2 ml-1 block text-sm font-semibold text-slate-700">
                Discount %
              </label>

              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="20"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

              {errors.discount && (
                <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{errors.discount}</p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <label className="ml-1 block text-sm font-semibold text-slate-700">
                Product Colors
              </label>

              <p className="ml-1 mt-1 text-xs text-slate-400">
                Customize the colors used on your product card.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 transition hover:border-sky-200 hover:bg-sky-50">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Background
                  </label>

                  <div
                    className="h-5 w-5 rounded-full border border-white shadow-sm"
                    style={{
                      backgroundColor: formData.bgcolor || '#ffffff'
                    }}
                  />
                </div>

                <input
                  type="text"
                  name="bgcolor"
                  value={formData.bgcolor}
                  onChange={handleChange}
                  placeholder="white"
                  className="w-full rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                {errors.bgcolor && (
                  <p className="mt-2 text-xs font-medium text-red-500">{errors.bgcolor}</p>
                )}
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 transition hover:border-sky-200 hover:bg-sky-50">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Panel
                  </label>

                  <div
                    className="h-5 w-5 rounded-full border border-white shadow-sm"
                    style={{
                      backgroundColor: formData.panelcolor || '#ffffff'
                    }}
                  />
                </div>

                <input
                  type="text"
                  name="panelcolor"
                  value={formData.panelcolor}
                  onChange={handleChange}
                  placeholder="brown"
                  className="w-full rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                {errors.panelcolor && (
                  <p className="mt-2 text-xs font-medium text-red-500">{errors.panelcolor}</p>
                )}
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 transition hover:border-sky-200 hover:bg-sky-50">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Text
                  </label>

                  <div
                    className="h-5 w-5 rounded-full border border-white shadow-sm"
                    style={{
                      backgroundColor: formData.textcolor || '#000000'
                    }}
                  />
                </div>

                <input
                  type="text"
                  name="textcolor"
                  value={formData.textcolor}
                  onChange={handleChange}
                  placeholder="black"
                  className="w-full rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                {errors.textcolor && (
                  <p className="mt-2 text-xs font-medium text-red-500">{errors.textcolor}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-sky-100 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-sky-100 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-0.5 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
