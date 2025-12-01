import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, checkAuth } from '../utils/auth';

interface OrderItem {
  serviceName: string;
  serviceType: 'activity' | 'package';
  packageType?: 'vip' | 'standard';
  elderName: string;
  elderAge: number;
  elderGender: string;
  elderRelationship: string;
  elderHealth?: string;
  elderInsurance?: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  totalDays: number;
  itemTotal: number;
  notes?: string;
}

interface OrderDetail {
  _id: string;
  orderCode: string;
  bookedByName: string;
  bookedByPhone: string;
  bookedByEmail: string;
  items?: OrderItem[]; // New format with multiple items
  // Legacy single item format (for old bookings)
  elderName?: string;
  elderAge?: number;
  elderGender?: string;
  elderRelationship?: string;
  elderHealth?: string;
  elderInsurance?: string;
  serviceName?: string;
  packageType?: 'vip' | 'standard';
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  pricePerDay?: number;
  notes?: string;
  // Common fields
  totalAmount?: number;
  paymentMethod?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getUser();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checkAuth()) {
      alert('Vui lòng đăng nhập!');
      navigate('/login');
      return;
    }
    if (id) {
      fetchOrderDetail(id);
    }
  }, [id, navigate]);

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try Orders API first
      let response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      let result = await response.json();
      
      if (result.success && result.data) {
        // New Order format with items array
        setOrder(result.data);
        return;
      }
      
      // Fallback to Bookings API if Orders not found
      response = await fetch(`http://localhost:5000/api/bookings/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      result = await response.json();
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        alert('Không tìm thấy đơn hàng!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Lỗi tải thông tin đơn hàng!');
      navigate('/profile');
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
    return <span className={`px-4 py-2 rounded-full text-sm font-semibold ${c.color}`}>{c.text}</span>;
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return null;
    const config = {
      pending: { text: 'Chưa thanh toán', color: 'bg-orange-100 text-orange-700' },
      paid: { text: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
      failed: { text: 'Thất bại', color: 'bg-red-100 text-red-700' },
    };
    const c = config[status as keyof typeof config];
    return c ? <span className={`px-4 py-2 rounded-full text-sm font-semibold ${c.color}`}>{c.text}</span> : null;
  };

  const getPaymentMethodText = (method?: string) => {
    const methods = {
      bank: 'Chuyển khoản ngân hàng',
      momo: 'Ví MoMo',
      cash: 'Thanh toán khi nhận dịch vụ',
    };
    return method ? methods[method as keyof typeof methods] || method : 'Chưa xác định';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-gray-600">Không tìm thấy đơn hàng</p>
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Quay lại hồ sơ
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chi tiết đơn hàng</h1>
              <p className="text-gray-600 font-mono text-lg">{order.orderCode}</p>
              <p className="text-sm text-gray-500">
                Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {getStatusBadge(order.status)}
              {order.paymentStatus && getPaymentStatusBadge(order.paymentStatus)}
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Thông tin dịch vụ</h2>
          
          {/* New format: Multiple items */}
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{item.serviceName}</h3>
                    {item.packageType && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          item.packageType === 'vip'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {item.packageType === 'vip' ? '👑 VIP' : '💚 Thường'}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Người sử dụng</p>
                      <p className="font-semibold">{item.elderName} ({item.elderAge} tuổi)</p>
                      <p className="text-sm text-gray-500">{item.elderGender} - {item.elderRelationship}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Thời gian</p>
                      <p className="font-semibold">
                        {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-gray-500">({item.totalDays} ngày)</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-gray-600">Chi phí dịch vụ này</span>
                    <span className="text-xl font-bold text-green-600">
                      {(item.itemTotal || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Tổng tiền đơn hàng</span>
                  <span className="text-3xl font-bold text-green-600">
                    {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Legacy format: Single service */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{order.serviceName}</h3>
                {order.packageType && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      order.packageType === 'vip'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {order.packageType === 'vip' ? '👑 VIP' : '💚 Thường'}
                  </span>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Thời gian sử dụng</p>
                  <p className="font-semibold">
                    {order.startDate && new Date(order.startDate).toLocaleDateString('vi-VN')}
                    {order.endDate && (
                      <> - {new Date(order.endDate).toLocaleDateString('vi-VN')}</>
                    )}
                  </p>
                  {order.totalDays && (
                    <p className="text-sm text-gray-500">({order.totalDays} ngày)</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chi phí</p>
                  {order.pricePerDay ? (
                    <div>
                      <p className="font-semibold">
                        {(order.pricePerDay || 0).toLocaleString('vi-VN')}đ/ngày
                      </p>
                      {order.totalDays && (
                        <p className="text-sm text-gray-500">
                          {order.totalDays} ngày × {(order.pricePerDay || 0).toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-semibold">Chưa xác định</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Tổng tiền</span>
                  <span className="text-3xl font-bold text-green-600">
                    {order.totalAmount
                      ? `${(order.totalAmount || 0).toLocaleString('vi-VN')}đ`
                      : 'Chưa xác định'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin người đặt</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Họ và tên</p>
                <p className="font-semibold">{order.bookedByName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-semibold">{order.bookedByPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{order.bookedByEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin người sử dụng</h2>
            {order.items && order.items.length > 0 ? (
              /* New format: Show all elders */
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className={`${index > 0 ? 'pt-4 border-t' : ''}`}>
                    <p className="text-xs text-gray-500 mb-2">Dịch vụ {index + 1}: {item.serviceName}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Họ và tên</p>
                        <p className="font-semibold">{item.elderName}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm text-gray-600">Tuổi</p>
                          <p className="font-semibold">{item.elderAge} tuổi</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Giới tính</p>
                          <p className="font-semibold">{item.elderGender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quan hệ</p>
                          <p className="font-semibold">{item.elderRelationship}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Legacy format: Single elder */
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Họ và tên</p>
                  <p className="font-semibold">{order.elderName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tuổi</p>
                  <p className="font-semibold">{order.elderAge} tuổi</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Giới tính</p>
                  <p className="font-semibold">{order.elderGender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quan hệ</p>
                  <p className="font-semibold">{order.elderRelationship}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Thông tin bổ sung</h2>
          <div className="space-y-4">
            {order.elderHealth && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Tình trạng sức khỏe</p>
                <p className="text-gray-800">{order.elderHealth}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Phương thức thanh toán</p>
              <p className="font-semibold">{getPaymentMethodText(order.paymentMethod)}</p>
            </div>

            {order.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Ghi chú</p>
                <p className="text-gray-800">{order.notes}</p>
              </div>
            )}

            {order.elderInsurance && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Căn cước công dân</p>
                <img
                  src={order.elderInsurance}
                  alt="CCCD"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-3">Cần hỗ trợ?</h3>
          <p className="text-blue-800 mb-4">
            Nếu bạn có thắc mắc về đơn hàng này, vui lòng liên hệ với chúng tôi:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:1900123456"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Gọi Hotline
            </a>
            <a
              href="mailto:hotro@songvuikhoe.vn"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Gửi Email
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
          >
            ← Quay lại hồ sơ
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}