import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from './components/Layout';
import { AdminPage } from './admin/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PaymentCancelledPage } from './pages/PaymentCancelledPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { RegistrationPage } from './pages/RegistrationPage';

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancelled" element={<PaymentCancelledPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      {/* El panel de administración tiene su propio marco (sin el pie del formulario). */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
