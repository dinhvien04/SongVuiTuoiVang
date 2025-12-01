import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ActivitiesPage from './pages/ActivitiesPage';
import PackagesPage from './pages/PackagesPage';
import ActivityDetail from './pages/ActivityDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import BookingPage from './pages/BookingPage';
import EditCartItem from './pages/EditCartItem';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageActivities from './pages/admin/ManageActivities';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import ActivityForm from './pages/admin/ActivityForm';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/edit/:id" element={<EditCartItem />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-detail/:id" element={<OrderDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/activities" element={<ManageActivities />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/activities/new" element={<ActivityForm />} />
          <Route path="/admin/activities/edit/:id" element={<ActivityForm />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
