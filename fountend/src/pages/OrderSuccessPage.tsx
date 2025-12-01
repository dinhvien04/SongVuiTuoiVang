import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  
  const orderCount = searchParams.get('count') || '0';
  const totalAmount = searchParams.get('amount') || '0';
  const paymentMethod = searchParams.get('method') || 'bank';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/profile');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case 'bank':
        return 'Chuyển khoản ngân hàng';
      case 'momo':
        return 'Ví MoMo';
      case 'cash':
        return 'Thanh toán khi nhận dịch vụ';
      default:
        return 'Chưa xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Đặt dịch vụ thành công!
          </h1>
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-bold mb-4 text-center">Thông tin đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Số lượng dịch vụ</span>
                <span className="font-semibold">{orderCount} dịch vụ</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Phương thức thanh toán</span>
                <span className="font-semibold">{getPaymentMethodText()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Tổng tiền</span>
                <span className="text-2xl font-bold text-green-600">
                  {parseInt(totalAmount).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Các bước tiếp theo
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>
                  Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>
                  {paymentMethod === 'bank' || paymentMethod === 'momo'
                    ? 'Vui lòng hoàn tất thanh toán theo thông tin đã cung cấp'
                    : 'Vui lòng chuẩn bị thanh toán khi đến trung tâm'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>
                  Nhân viên của chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận chi tiết
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>
                  Bạn có thể theo dõi trạng thái đơn hàng trong trang "Hồ sơ"
                </span>
              </li>
            </ul>
          </div>

          {/* Support Info */}
          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-green-900 mb-3">Cần hỗ trợ?</h3>
            <p className="text-sm text-green-800 mb-3">
              Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:1900123456"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
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
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 font-semibold"
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg transition-colors"
            >
              Xem đơn hàng của tôi
            </button>
            <button
              onClick={() => navigate('/activities')}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Auto Redirect */}
          <p className="text-sm text-gray-500 mt-6">
            Tự động chuyển đến trang hồ sơ sau {countdown} giây...
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
