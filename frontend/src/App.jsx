import { Routes, Route } from 'react-router-dom';

import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CreateProduct from './pages/CreateProduct';
import UpdateProduct from './pages/UpdateProduct';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoutes';
import Cart from './pages/Cart';

import OwnerProtectedRoute from './components/OwnerProtectedRoute';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerLogin from './pages/OwnerLogin';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import MyAccount from './pages/MyAccount';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />

      <Route path="/products" element={<Products />} />

      <Route path="/owner/login" element={<OwnerLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />

        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/myaccount" element={<MyAccount />} />
      </Route>

      <Route element={<OwnerProtectedRoute />}>
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />

        <Route path="/products/create" element={<CreateProduct />} />

        <Route path="/products/:id/edit" element={<UpdateProduct />} />
      </Route>
    </Routes>
  );
};

export default App;
