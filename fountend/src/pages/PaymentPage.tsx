import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { getUser } from '../utils/auth';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const user = getUser();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'momo' | 'cash'>('bank');
  
  // Generate temporary order reference for payment
  const generatePaymentRef = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-4);
    return `SVK${dateStr}${timeStr}`;
  };
  
  const paymentRef = generatePaymentRef();

  const handlePayment = async () => {
    if (items.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Tạo 1 đơn hàng chứa nhiều items
      const orderItems = items.map((item) => ({
        serviceName: item.serviceName,
        serviceType: item.serviceType,
        packageType: item.packageType,
        elderName: item.elderName,
        elderAge: item.elderAge,
        elderGender: item.elderGender,
        elderRelationship: item.elderRelationship,
        elderHealth: item.elderHealth,
        elderInsurance: item.elderInsurance,
        startDate: item.startDate,
        endDate: item.endDate,
        pricePerDay: item.pricePerDay,
        totalDays: item.totalDays,
        itemTotal: item.price,
        notes: item.notes,
      }));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookedByName: user?.name,
          bookedByPhone: user?.phone,
          bookedByEmail: user?.email,
          items: orderItems,
          paymentMethod,
          totalAmount: getTotalPrice(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        const totalAmount = getTotalPrice();
        const orderCount = items.length;
        
        clearCart();
        
        // Redirect to success page with order info
        navigate(
          `/order-success?count=${orderCount}&amount=${totalAmount}&method=${paymentMethod}`
        );
      } else {
        alert(result.message || 'Có lỗi xảy ra khi đặt hàng!');
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">
              Vui lòng thêm dịch vụ vào giỏ hàng trước khi thanh toán
            </p>
            <button
              onClick={() => navigate('/activities')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
            >
              Khám phá dịch vụ
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin người đặt</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Họ và tên</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Số điện thoại</p>
                  <p className="font-semibold">{user?.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5 text-green-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Chuyển khoản ngân hàng</p>
                    <p className="text-sm text-gray-600">
                      Chuyển khoản qua tài khoản ngân hàng
                    </p>
                  </div>
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 8.5L12 2l10 6.5V21H2V8.5zm2 1.5v9h16v-9l-8-5.2L4 10z" />
                    <path d="M12 11a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </label>

                <label
                  // className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  //   paymentMethod === 'momo'
                  //     ? 'border-green-500 bg-green-50'
                  //     : 'border-gray-200 hover:border-gray-300'
                  // }`}
                >
                  {/* <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5 text-green-500"
                  /> */}
                  {/* <div className="flex-1">
                    <p className="font-semibold">Ví MoMo</p>
                    <p className="text-sm text-gray-600">
                      Thanh toán qua ví điện tử MoMo
                    </p>
                  </div> */}
                  {/* <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg> */}
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5 text-green-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Thanh toán khi nhận dịch vụ</p>
                    <p className="text-sm text-gray-600">
                      Thanh toán trực tiếp tại trung tâm
                    </p>
                  </div>
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </label>
              </div>

              {/* Cash Payment Info */}
              {paymentMethod === 'cash' && (
                <div className="mt-4 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="font-semibold mb-3 text-center text-lg">Thanh toán khi nhận dịch vụ</p>
                  
                  <div className="bg-white rounded-lg p-4 space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-800">Thanh toán trực tiếp</p>
                        <p className="text-gray-600">Bạn sẽ thanh toán trực tiếp tại trung tâm khi bắt đầu sử dụng dịch vụ</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-800">Số tiền cần thanh toán</p>
                        <p className="text-2xl font-bold text-green-600">
                          {getTotalPrice().toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-800">Địa điểm thanh toán</p>
                        <p className="text-gray-600">Trung tâm Sống Vui Khỏe</p>
                        <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP.HCM</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      📞 <strong>Liên hệ:</strong> Vui lòng gọi hotline 1900.123.456 để xác nhận lịch hẹn thanh toán
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info with QR Code */}
              {paymentMethod === 'bank' && (
                <div className="mt-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="font-semibold mb-4 text-center text-lg">Quét mã QR để thanh toán</p>
                  
                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <img
                        src={`https://img.vietqr.io/image/VCB-1030721718-qr_only.png?amount=${getTotalPrice()}&addInfo=${encodeURIComponent(
                          paymentRef
                        )}`}
                        alt="QR Thanh toán"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                  </div>

                  {/* Bank Info */}
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-semibold">Vietcombank (VCB)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <span className="font-semibold">1030721718</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <span className="font-semibold">NGUYEN DINH VIEN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-green-600">
                        {getTotalPrice().toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-gray-600 mb-1">Nội dung chuyển khoản:</p>
                      <p className="font-semibold text-blue-700 bg-blue-100 px-3 py-2 rounded font-mono">
                        {paymentRef}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Vui lòng ghi chính xác nội dung này
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      ⚠️ <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận đơn hàng
                    </p>
                  </div>
                </div>
              )}

              {/* MoMo Info */}
              {paymentMethod === 'momo' && (
                <div className="mt-4 p-6 bg-pink-50 rounded-lg border-2 border-pink-200">
                  <p className="font-semibold mb-4 text-center text-lg">Thanh toán qua MoMo</p>
                  
                  {/* MoMo QR Code Placeholder */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                      <div className="w-48 h-48 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-24 h-24 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                            MoMo
                          </text>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Quét mã trong ứng dụng MoMo</p>
                    </div>
                  </div>

                  {/* MoMo Info */}
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-semibold">0901234567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên:</span>
                      <span className="font-semibold">Trung tâm Sống Vui Khỏe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-pink-600">
                        {getTotalPrice().toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-gray-600 mb-1">Nội dung chuyển khoản:</p>
                      <p className="font-semibold text-pink-700 bg-pink-100 px-3 py-2 rounded font-mono">
                        {paymentRef}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Vui lòng ghi chính xác nội dung này
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Hướng dẫn:</strong> Mở ứng dụng MoMo → Chuyển tiền → Nhập số điện thoại và số tiền → Điền nội dung chuyển khoản
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="pb-3 border-b">
                    <p className="font-semibold text-sm">{item.serviceName}</p>
                    <p className="text-xs text-gray-600">
                      {item.elderName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.totalDays} ngày × {item.pricePerDay.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      {item.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng</span>
                  <span className="font-semibold">{items.length} dịch vụ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-semibold">
                    {getTotalPrice().toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-green-600">
                    {getTotalPrice().toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt dịch vụ'}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="w-full mt-3 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Quay lại giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
