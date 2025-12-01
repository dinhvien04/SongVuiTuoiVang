import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getUser, checkAuth } from '../../utils/auth';

interface Booking {
  _id: string;
  orderId?: string; // Original order ID (for items from Orders)
  orderCode: string;
  bookedByName: string;
  bookedByPhone: string;
  bookedByEmail: string;
  elderName: string;
  elderAge: number;
  elderGender: string;
  serviceName: string;
  packageType?: 'vip' | 'standard';
  startDate: string;
  endDate?: string;
  totalAmount?: number;
  totalDays?: number;
  pricePerDay?: number;
  paymentMethod?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  notes?: string;
  createdAt: string;
  isFromOrder?: boolean; // Flag to identify if this came from Orders collection
}

export default function ManageBookings() {
  const navigate = useNavigate();
  const user = getUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!checkAuth() || user?.role !== 'admin') {
      alert('Bạn không có quyền truy cập!');
      navigate('/');
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch both Orders and Bookings
      const [ordersResponse, bookingsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      
      const ordersResult = await ordersResponse.json();
      const bookingsResult = await bookingsResponse.json();
      
      let allBookings: Booking[] = [];
      
      // Convert Orders to Booking format (flatten items)
      if (ordersResult.success && ordersResult.data) {
        const convertedOrders = ordersResult.data.flatMap((order: any) => 
          order.items.map((item: any) => ({
            _id: `${order._id}_${item.serviceName}`, // Unique ID for each item
            orderId: order._id, // Keep original order ID
            orderCode: order.orderCode,
            bookedByName: order.bookedByName,
            bookedByPhone: order.bookedByPhone,
            bookedByEmail: order.bookedByEmail,
            elderName: item.elderName,
            elderAge: item.elderAge,
            elderGender: item.elderGender,
            serviceName: item.serviceName,
            packageType: item.packageType,
            startDate: item.startDate,
            endDate: item.endDate,
            totalAmount: item.itemTotal,
            totalDays: item.totalDays,
            pricePerDay: item.pricePerDay,
            paymentMethod: order.paymentMethod,
            status: order.status,
            paymentStatus: order.paymentStatus,
            notes: item.notes,
            createdAt: order.createdAt,
            isFromOrder: true, // Flag to identify converted orders
          }))
        );
        allBookings = [...allBookings, ...convertedOrders];
      }
      
      // Add old Bookings
      if (bookingsResult.success && bookingsResult.data) {
        allBookings = [...allBookings, ...bookingsResult.data];
      }
      
      // Sort by creation date (newest first)
      allBookings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Lỗi tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const booking = bookings.find(b => b._id === bookingId);
      
      // Determine if this is from Orders or Bookings
      const apiEndpoint = booking?.isFromOrder && booking?.orderId
        ? `http://localhost:5000/api/orders/${booking.orderId}/status`
        : `http://localhost:5000/api/bookings/${bookingId}/status`;
      
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Cập nhật trạng thái thành công!');
        fetchBookings();
      } else {
        alert(result.message || 'Lỗi cập nhật!');
      }
    } catch (error) {
      alert('Lỗi cập nhật trạng thái!');
    }
  };

  const updatePaymentStatus = async (bookingId: string, paymentStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const booking = bookings.find(b => b._id === bookingId);
      
      // Determine if this is from Orders or Bookings
      const apiEndpoint = booking?.isFromOrder && booking?.orderId
        ? `http://localhost:5000/api/orders/${booking.orderId}/payment`
        : `http://localhost:5000/api/bookings/${bookingId}/payment`;
      
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Cập nhật trạng thái thanh toán thành công!');
        fetchBookings();
      } else {
        alert(result.message || 'Lỗi cập nhật!');
      }
    } catch (error) {
      alert('Lỗi cập nhật trạng thái thanh toán!');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment;
    const matchesSearch =
      booking.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookedByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookedByPhone.includes(searchQuery) ||
      booking.elderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPayment && matchesSearch;
  });

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

  const getPaymentBadge = (status?: string) => {
    if (!status) return null;
    const config = {
      pending: { text: 'Chưa TT', color: 'bg-orange-100 text-orange-700' },
      paid: { text: 'Đã TT', color: 'bg-green-100 text-green-700' },
      failed: { text: 'Thất bại', color: 'bg-red-100 text-red-700' },
    };
    const c = config[status as keyof typeof config];
    return c ? <span className={`px-2 py-1 rounded text-xs font-semibold ${c.color}`}>{c.text}</span> : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
            <p className="text-gray-600">Tổng số: {filteredBookings.length} đơn</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            ← Quay lại Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mã đơn, tên, SĐT..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Trạng thái đơn</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="approved">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="rejected">Đã hủy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Thanh toán</label>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Mã đơn</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Người đặt</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Dịch vụ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Người dùng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tổng tiền</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm font-semibold">{booking.orderCode}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold">{booking.bookedByName}</p>
                        <p className="text-xs text-gray-500">{booking.bookedByPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold">{booking.serviceName}</p>
                        {booking.packageType && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              booking.packageType === 'vip'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {booking.packageType === 'vip' ? 'VIP' : 'Thường'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{booking.elderName}</p>
                        <p className="text-xs text-gray-500">{booking.elderAge} tuổi</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-green-600">
                          {booking.totalAmount?.toLocaleString('vi-VN')}đ
                        </p>
                        {booking.totalDays && (
                          <p className="text-xs text-gray-500">{booking.totalDays} ngày</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {getStatusBadge(booking.status)}
                          {getPaymentBadge(booking.paymentStatus)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailModal(true);
                            }}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Chi tiết
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'approved')}
                              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Xác nhận
                            </button>
                          )}
                          {booking.paymentStatus === 'pending' && (
                            <button
                              onClick={() => updatePaymentStatus(booking._id, 'paid')}
                              className="px-3 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600"
                            >
                              Xác nhận TT
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
                    <p className="text-gray-600 font-mono">{selectedBooking.orderCode}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3">Người đặt</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Tên:</strong> {selectedBooking.bookedByName}</p>
                        <p><strong>SĐT:</strong> {selectedBooking.bookedByPhone}</p>
                        <p><strong>Email:</strong> {selectedBooking.bookedByEmail}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3">Người sử dụng</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Tên:</strong> {selectedBooking.elderName}</p>
                        <p><strong>Tuổi:</strong> {selectedBooking.elderAge}</p>
                        <p><strong>Giới tính:</strong> {selectedBooking.elderGender}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-3">Dịch vụ</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Tên:</strong> {selectedBooking.serviceName}</p>
                      <p><strong>Thời gian:</strong> {new Date(selectedBooking.startDate).toLocaleDateString('vi-VN')} - {selectedBooking.endDate && new Date(selectedBooking.endDate).toLocaleDateString('vi-VN')}</p>
                      <p><strong>Số ngày:</strong> {selectedBooking.totalDays} ngày</p>
                      <p><strong>Giá/ngày:</strong> {selectedBooking.pricePerDay?.toLocaleString('vi-VN')}đ</p>
                      <p><strong>Tổng tiền:</strong> <span className="text-green-600 font-bold text-lg">{selectedBooking.totalAmount?.toLocaleString('vi-VN')}đ</span></p>
                    </div>
                  </div>

                  {selectedBooking.notes && (
                    <div>
                      <h3 className="font-bold mb-3">Ghi chú</h3>
                      <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Trạng thái đơn hàng</label>
                      <select
                        value={selectedBooking.status}
                        onChange={(e) => {
                          updateBookingStatus(selectedBooking._id, e.target.value);
                          setShowDetailModal(false);
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="approved">Đã xác nhận</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="rejected">Đã hủy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Trạng thái thanh toán</label>
                      <select
                        value={selectedBooking.paymentStatus || 'pending'}
                        onChange={(e) => {
                          updatePaymentStatus(selectedBooking._id, e.target.value);
                          setShowDetailModal(false);
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="pending">Chưa thanh toán</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="failed">Thất bại</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="w-full px-6 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
