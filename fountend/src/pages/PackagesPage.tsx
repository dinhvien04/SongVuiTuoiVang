import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotlineButton from '../components/HotlineButton';

export default function PackagesPage() {
  const navigate = useNavigate();

  const handleBooking = (packageType: 'standard' | 'vip', packageName: string) => {
    navigate(`/booking?type=package&name=${encodeURIComponent(packageName)}&package=${packageType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Gói Dịch Vụ Chăm Sóc</h1>
          <p className="text-lg text-gray-600">Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Gói Thường - BÊN TRÁI */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-green-400 transform hover:scale-105 transition-transform">
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">💚</span>
                <div>
                  <h2 className="text-3xl font-bold">Gói Thường</h2>
                  <p className="text-green-100">Tiết kiệm & Chất lượng</p>
                </div>
              </div>
              <div className="text-center py-4 bg-white/20 rounded-lg">
                <p className="text-4xl font-bold">250,000 VND/ngày</p>
                {/* <p className="text-sm text-green-100">VNĐ/ngày</p> */}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">Lưu trú & Sinh hoạt</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Chỗ ở: 4-8 người</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Vệ sinh & Giặt giũ: Định kỳ</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Đồ dùng thiết yếu: Khăn mặt, khăn, xà phòng</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">Dinh dưỡng</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Chế độ ăn: 3 bữa chính & 1-2 bữa phụ</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Thực đơn: Phù hợp cho thể trạng chung</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">Chăm sóc Sức khỏe</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Theo dõi cơ bản: Hàng ngày</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Tư vấn y tế: Theo bệnh lý</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Thuốc: Hỗ trợ theo toa</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-700">Hoạt động Tinh thần</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Hoạt động tập thể: Hội giao, CLB VH</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-green-500 mt-1">✓</span><span>Kỹ giảng: Phòng giải trí, sân vườn</span></li>
                </ul>
              </div>
              <button onClick={() => handleBooking('standard', 'Gói Chăm Sóc Thường')} className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all shadow-lg">
                Đặt Gói Thường Ngay
              </button>
            </div>
          </div>

          {/* Gói VIP - BÊN PHẢI */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-amber-400 transform hover:scale-105 transition-transform">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">👑</span>
                <div>
                  <h2 className="text-3xl font-bold">Gói VIP</h2>
                  <p className="text-amber-100">Cao cấp & Toàn diện</p>
                </div>
              </div>
              <div className="text-center py-4 bg-white/20 rounded-lg">
                <p className="text-4xl font-bold">400,000 VND/ngày</p>
                {/* <p className="text-sm text-amber-100">VNĐ/tháng</p> */}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-amber-700">Lưu trú & Tiện nghi</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Phòng ở: Phòng đơn hoặc đôi cao cấp</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Nội thất: Tiêu chuẩn 4-5 sao</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Kỹ giảng: Yên tĩnh & sạch sẽ tuyệt đối</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 text-amber-700">Chăm sóc cá nhân</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Tỉ lệ: 1 chăm dưỡng cho 2-3 người</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Hỗ trợ sinh hoạt: Toàn diện</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Dịch vụ làm đẹp: Gội đầu, cắt móng</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 text-amber-700">Dinh dưỡng đặc biệt</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Thực đơn: Thiết kế riêng</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Dịch vụ: Phục vụ tại phòng</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 text-amber-700">Y tế chuyên sâu</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Bác sĩ: Theo dõi sát sao</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Phục hồi chức năng: Trị liệu, xoa bóp</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-amber-500 mt-1">✓</span><span>Kiểm tra: Định kỳ</span></li>
                </ul>
              </div>
              <button onClick={() => handleBooking('vip', 'Gói Chăm Sóc VIP')} className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg">
                Đặt Gói VIP Ngay
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-900">💡 Lưu ý khi chọn gói</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2"><span>•</span><span><strong>Gói Thường:</strong> Phù hợp cho người cần chăm sóc cơ bản, thích sinh hoạt tập thể</span></li>
            <li className="flex items-start gap-2"><span>•</span><span><strong>Gói VIP:</strong> Phù hợp cho người cần chăm sóc đặc biệt, phòng riêng, dịch vụ cao cấp</span></li>
            <li className="flex items-start gap-2"><span>•</span><span>Giá có thể thay đổi tùy theo tình trạng sức khỏe</span></li>
            <li className="flex items-start gap-2"><span>•</span><span>Liên hệ hotline để được tư vấn chi tiết</span></li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Cần tư vấn thêm? Liên hệ với chúng tôi</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:1900123456" className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">📞 Gọi Hotline</a>
            <Link to="/activities" className="px-8 py-3 border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50">Xem Dịch Vụ Khác</Link>
          </div>
        </div>
      </div>
      <Footer />
      <HotlineButton />
    </div>
  );
}
