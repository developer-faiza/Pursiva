import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { productSchema } from '../validations/product.validation';
import OWNER_API from '../services/ownerApi';
import { toast } from 'react-toastify';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    price: '',
    discount: '',
    bgcolor: '',
    panelcolor: '',
    textcolor: ''
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files?.[0] || null : value
    }));

    setErrors(previous => ({
      ...previous,
      [name]: ''
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const result = productSchema.safeParse(formData);

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
      const data = new FormData();

      data.append('image', formData.image);
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('discount', formData.discount);
      data.append('bgcolor', formData.bgcolor);
      data.append('panelcolor', formData.panelcolor);
      data.append('textcolor', formData.textcolor);

      const response = await OWNER_API.post('/products/create', data);

      toast.success(response.data.message);

      setFormData({
        image: null,
        name: '',
        price: '',
        discount: '',
        bgcolor: '',
        panelcolor: '',
        textcolor: ''
      });

      navigate('/owner/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-xl shadow-sky-100/60">
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-7 text-white sm:px-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
            Product Management
          </p>

          <h1 className="text-3xl font-bold">Create Product</h1>

          <p className="mt-2 text-sm text-sky-100">Add a new product to your store.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8">
          <div>
            <label className="mb-2 ml-1 block text-sm font-semibold text-slate-700">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              name="image"
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
              placeholder="Enter product name"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
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
                placeholder="20"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
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
                Choose colors for the product card design.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 transition hover:border-sky-200 hover:bg-sky-50">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-sky-600">
                  Background
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="bgcolor"
                    value={formData.bgcolor}
                    onChange={handleChange}
                    placeholder="white"
                    className="min-w-0 flex-1 rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                {errors.bgcolor && (
                  <p className="mt-2 text-xs font-medium text-red-500">{errors.bgcolor}</p>
                )}
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 transition hover:border-sky-200 hover:bg-sky-50">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-sky-600">
                  Panel
                </label>

                <input
                  type="text"
                  placeholder="brown"
                  name="panelcolor"
                  value={formData.panelcolor}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                {errors.panelcolor && (
                  <p className="mt-2 text-xs font-medium text-red-500">{errors.panelcolor}</p>
                )}
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 transition hover:border-sky-200 hover:bg-sky-50">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-sky-600">
                  Text
                </label>

                <input
                  type="text"
                  placeholder="black"
                  name="textcolor"
                  value={formData.textcolor}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                {errors.textcolor && (
                  <p className="mt-2 text-xs font-medium text-red-500">{errors.textcolor}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center border-t border-sky-50 pt-6">
            <button
              type="submit"
              className="rounded-2xl bg-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-sky-200/80 active:translate-y-0"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
