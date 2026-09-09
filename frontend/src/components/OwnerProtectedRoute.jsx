import { Navigate, Outlet } from 'react-router-dom';

const OwnerProtectedRoute = () => {
  const ownerToken = localStorage.getItem('ownerToken');

  if (!ownerToken) {
    return <Navigate to="/owner/login" replace />;
  }

  return <Outlet />;
};

export default OwnerProtectedRoute;
