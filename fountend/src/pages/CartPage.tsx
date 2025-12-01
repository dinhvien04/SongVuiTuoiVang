import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, getTotalPrice, updateItem } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    navigate('/payment');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có dịch vụ nào trong giỏ hàng
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{item.serviceName}</h3>
                      {item.packageType && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                      Loại: {item.serviceType === 'package' ? 'Gói dịch vụ' : 'Dịch vụ đơn lẻ'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/booking/edit/${item.id}`)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Chỉnh sửa"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Xóa"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Người sử dụng</p>
                    <p className="font-semibold">{item.elderName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tuổi</p>
                    <p className="font-semibold">{item.elderAge} tuổi</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Giới tính</p>
                    <p className="font-semibold">{item.elderGender}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quan hệ</p>
                    <p className="font-semibold">{item.elderRelationship}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ngày bắt đầu</p>
                    <p className="font-semibold">
                      {new Date(item.startDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ngày kết thúc</p>
                    <p className="font-semibold">
                      {new Date(item.endDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                {item.elderHealth && (
                  <div className="mb-4 text-sm">
                    <p className="text-gray-600">Tình trạng sức khỏe</p>
                    <p className="text-gray-800">{item.elderHealth}</p>
                  </div>
                )}

                {item.notes && (
                  <div className="mb-4 text-sm">
                    <p className="text-gray-600">Ghi chú</p>
                    <p className="text-gray-800">{item.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Giá mỗi ngày</span>
                    <span className="font-semibold">
                      {item.pricePerDay.toLocaleString('vi-VN')}đ/{item.priceUnit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Số ngày</span>
                    <span className="font-semibold">{item.totalDays} ngày</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-700 font-semibold">Tổng tiền</span>
                    <span className="text-2xl font-bold text-green-600">
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Tổng quan đơn hàng</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số lượng dịch vụ</span>
                  <span className="font-semibold">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
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
                onClick={handleCheckout}
                className="w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg transition-colors"
              >
                Tiến hành thanh toán
              </button>

              <button
                onClick={() => navigate('/activities')}
                className="w-full mt-3 py-3 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 font-semibold transition-colors"
              >
                Tiếp tục chọn dịch vụ
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>Lưu ý:</strong> Giá dịch vụ có thể thay đổi tùy theo tình trạng sức khỏe cụ thể. Chúng tôi sẽ liên hệ xác nhận chi tiết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
