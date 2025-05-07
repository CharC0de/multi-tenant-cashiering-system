import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CashierInterfacePage from './pages/CashierInterfacePage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import SessionProtectedRoute from './components/routing/SessionProtectedRoute';
import EditProfilePage from './pages/EditProfilePage';
import LogoutPage from './pages/LogoutPage';
function App() {
  return (

    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route element={<SessionProtectedRoute />}>
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/home/products" element={<ProductsPage />} />
        <Route path="/home/interface" element={<CashierInterfacePage />} />
        <Route path="/home/transaction" element={<TransactionHistoryPage />} />
        <Route path="/home/profile" element={<EditProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
