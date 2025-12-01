import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
      return;
    }

    setUser(parsedUser);
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch activities
      const activitiesRes = await fetch('http://localhost:5000/api/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activitiesData = await activitiesRes.json();

      // Fetch users
      const usersRes = await fetch('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();

      // Fetch orders
      const ordersRes = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();

      // Fetch bookings (old data)
      const bookingsRes = await fetch('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingsData = await bookingsRes.json();

      // Calculate stats
      const totalActivities = activitiesData.success ? activitiesData.count || 0 : 0;
      const totalUsers = usersData.success ? usersData.data?.length || 0 : 0;
      const totalOrders = (ordersData.success ? ordersData.count || 0 : 0) + 
                         (bookingsData.success ? bookingsData.data?.length || 0 : 0);
      
      // Calculate revenue from orders
      let totalRevenue = 0;
      if (ordersData.success && ordersData.data) {
        totalRevenue += ordersData.data.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || 0), 0
        );
      }
      if (bookingsData.success && bookingsData.data) {
        totalRevenue += bookingsData.data.reduce((sum: number, booking: any) => 
          sum + (booking.totalAmount || 0), 0
        );
      }

      setStats({
        totalActivities,
        totalUsers,
        totalOrders,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Xin chào, <strong>{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-sm">
          <nav className="p-4 space-y-2">
            <Link
              to="/admin"
              className="block px-4 py-3 bg-green-100 text-green-700 rounded-lg font-semibold"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/admin/bookings"
              className="block px-4 py-3 hover:bg-gray-100 rounded-lg"
            >
              📦 Quản lý Đơn hàng
            </Link>
            <Link
              to="/admin/users"
              className="block px-4 py-3 hover:bg-gray-100 rounded-lg"
            >
              👥 Quản lý Người dùng
            </Link>
            <Link
              to="/admin/activities"
              className="block px-4 py-3 hover:bg-gray-100 rounded-lg"
            >
              🎯 Quản lý Dịch vụ
            </Link>
            <Link
              to="/"
              className="block px-4 py-3 hover:bg-gray-100 rounded-lg text-blue-600"
            >
              🏠 Về trang chủ
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tổng Dịch vụ</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalActivities}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Người dùng</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Đơn hàng</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Doanh thu</p>
                    <p className="text-3xl font-bold mt-2">
                      {stats.totalRevenue.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/activities/new"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
              >
                <span className="text-3xl mb-2 block">➕</span>
                <p className="font-semibold">Thêm Dịch vụ mới</p>
              </Link>
              <Link
                to="/admin/users"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
              >
                <span className="text-3xl mb-2 block">👥</span>
                <p className="font-semibold">Xem Người dùng</p>
              </Link>
              <Link
                to="/admin/bookings"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors text-center"
              >
                <span className="text-3xl mb-2 block">📦</span>
                <p className="font-semibold">Quản lý Đơn hàng</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
