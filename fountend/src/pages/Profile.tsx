import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, checkAuth, clearAuth } from '../utils/auth';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  insuranceCard?: string;
}

interface OrderItem {
  serviceName: string;
  serviceType: 'activity' | 'package';
  packageType?: 'vip' | 'standard';
  elderName: string;
  elderAge: number;
  elderGender: string;
  elderRelationship: string;
  elderHealth?: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  totalDays: number;
  itemTotal: number;
  notes?: string;
}

interface Order {
  _id: string;
  orderCode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      clearAuth();
      alert('Vui lòng đăng nhập!');
      navigate('/login');
      return;
    }
    loadUserData();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload user data when component mounts or becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadUserData = async () => {
    try {
      // Fetch fresh data from server
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        // Update localStorage with fresh data
        const currentUser = getUser();
        const updatedUser = {
          ...currentUser,
          ...result.data,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        // Fallback to localStorage if API fails
        const userData = getUser();
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage
      const userData = getUser();
      if (userData) {
        setUser(userData);
      }
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try to fetch Orders first
      let response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      let result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        setOrders(result.data);
      } else {
        // Fallback to old Bookings if no Orders found
        console.log('No orders found, trying bookings...');
        response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        result = await response.json();
        if (result.success && result.data) {
          // Convert old bookings to order format
          const convertedOrders = result.data.map((booking: any) => ({
            _id: booking._id,
            orderCode: booking.orderCode || `#${booking._id.slice(-8).toUpperCase()}`,
            items: [{
              serviceName: booking.serviceName || 'Dịch vụ không xác định',
              serviceType: booking.serviceType || 'package',
              packageType: booking.packageType,
              elderName: booking.elderName || 'Không xác định',
              elderAge: booking.elderAge || 0,
              elderGender: booking.elderGender || 'Không xác định',
              elderRelationship: booking.elderRelationship || 'Không xác định',
              elderHealth: booking.elderHealth,
              startDate: booking.startDate || new Date().toISOString(),
              endDate: booking.endDate || booking.startDate || new Date().toISOString(),
              pricePerDay: Number(booking.pricePerDay) || Number(booking.totalAmount) || 0,
              totalDays: Number(booking.totalDays) || 1,
              itemTotal: Number(booking.totalAmount) || 0,
              notes: booking.notes,
            }],
            totalAmount: Number(booking.totalAmount) || 0,
            paymentMethod: booking.paymentMethod,
            status: booking.status || 'pending',
            paymentStatus: booking.paymentStatus || 'pending',
            createdAt: booking.createdAt || new Date().toISOString(),
          }));
          setOrders(convertedOrders);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
      approved: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
      completed: { text: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
      rejected: { text: 'Đã hủy', color: 'bg-red-100 text-red-700' },
    };
    const c = config[status as keyof typeof config] || config.pending;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.color}`}>{c.text}</span>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const config = {
      pending: { text: 'Chưa thanh toán', color: 'bg-orange-100 text-orange-700' },
      paid: { text: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
      failed: { text: 'Thất bại', color: 'bg-red-100 text-red-700' },
    };
    const c = config[status as keyof typeof config];
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.color}`}>{c.text}</span>;
  };

  const getPaymentMethodText = (method?: string) => {
    const methods = {
      bank: 'Chuyển khoản',
      momo: 'Ví MoMo',
      cash: 'Tiền mặt',
    };
    return method ? methods[method as keyof typeof methods] || method : 'Chưa xác định';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* User Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">{user.phone}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
            >
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'info'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                activeTab === 'orders'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lịch sử đơn hàng
              {orders.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  {orders.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
                  <p className="text-gray-600 font-medium">Họ và tên</p>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
                  <p className="text-gray-600 font-medium">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
                  <p className="text-gray-600 font-medium">Số điện thoại</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
                  <p className="text-gray-600 font-medium">Ngày sinh</p>
                  <p className="text-gray-900">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN')
                      : 'Chưa cập nhật'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
                  <p className="text-gray-600 font-medium">Giới tính</p>
                  <p className="text-gray-900">{user.gender || 'Chưa cập nhật'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
                  <p className="text-gray-600 font-medium">Địa chỉ</p>
                  <p className="text-gray-900">{user.address || 'Chưa cập nhật'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
                  <p className="text-gray-600 font-medium">Căn cước công dân</p>
                  {user.insuranceCard ? (
                    <img
                      src={user.insuranceCard}
                      alt="Insurance"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">Chưa cập nhật</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Chưa có đơn hàng nào
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Bạn chưa đặt dịch vụ nào. Hãy khám phá các dịch vụ của chúng tôi!
                    </p>
                    <button
                      onClick={() => navigate('/activities')}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                    >
                      Khám phá dịch vụ
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold">
                                Đơn hàng #{order.orderCode}
                              </h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                                {order.items.length} dịch vụ
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Ngày đặt:{' '}
                              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>

                        {/* Danh sách dịch vụ */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Dịch vụ đã đặt:</p>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-semibold">{item.serviceName}</p>
                                      {item.packageType && (
                                        <span
                                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            item.packageType === 'vip'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-green-100 text-green-700'
                                          }`}
                                        >
                                          {item.packageType === 'vip' ? '👑 VIP' : '💚 Thường'}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {item.elderName} ({item.elderAge} tuổi) - {item.elderRelationship}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')} ({item.totalDays} ngày)
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-green-600">
                                      {(item.itemTotal || 0).toLocaleString('vi-VN')}đ
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(item.pricePerDay || 0).toLocaleString('vi-VN')}đ/ngày
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Phương thức thanh toán</p>
                            <p className="font-semibold">
                              {getPaymentMethodText(order.paymentMethod)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-700 font-semibold">Tổng tiền</span>
                            <span className="text-2xl font-bold text-green-600">
                              {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                          <button
                            onClick={() => navigate(`/order-detail/${order._id}`)}
                            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                          >
                            Xem chi tiết đơn hàng
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;