import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AshramaDashboardPage from './pages/AshramaDashboardPage';
import DeliveryNgoAuthPage from './pages/DeliveryNgoAuthPage';
import DeliveryNgoDashboardPage from './pages/DeliveryNgoDashboardPage';
import DonateMeAuthPage from './pages/DonateMeAuthPage';

import DonorDashboardPage from './pages/DonorDashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/donateme-auth" element={<DonateMeAuthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ashrama/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/delivery-ngo/auth" element={<DeliveryNgoAuthPage />} />
      <Route path="/delivery-ngo/dashboard" element={<DeliveryNgoDashboardPage />} />
      <Route path="/donor/dashboard" element={<DonorDashboardPage />} />
      <Route path="/ashrama/dashboard" element={<AshramaDashboardPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
