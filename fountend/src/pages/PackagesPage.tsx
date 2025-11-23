import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotlineButton from '../components/HotlineButton';

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<'vip' | 'standard' | null>(null);

  const packages = {
    vip: {
      name: 'Gói VIP',
      icon: '👑',
      price: '180,000 - 400,000',
      priceUnit: 'VNĐ/tháng',
      color: 'amber',
      features: [
        {
          title: 'Lưu trú & Tiện nghi',
          items: [
            'Phòng ở: Phòng đơn hoặc Phòng đôi cao cấp',
            'Nội thất: Tiêu chuẩn 4-5 sao',
            'Kỹ giảng: Đảm bảo yên tĩnh & sạch sẽ tuyệt đối',
          ],
        },
        {
          title: 'Chăm sóc cá nhân',
          items: [
            'Tỉ lệ: 1 chăm dưỡng cho 2-3 người cao tuổi',
            'Hỗ trợ sinh hoạt: Toàn diện và chu đáo',
            'Dịch vụ làm đẹp: Gội đầu, cắt móng tay...',
          ],
        },
        {
          title: 'Dinh dưỡng đặc biệt',
          items: [
            'Thực đơn: Được thiết kế riêng',
            'Dịch vụ: Phục vụ tại phòng',
          ],
        },
        {
          title: 'Y tế & Tư liệu chuyên sâu',
          items: [
            'Bác sĩ thường xuyên: Theo dõi sát sao',
            'Phục hồi chức năng: Bao gồm trị liệu, xoa bóp...',
            'Kiểm tra: Định kỳ',
          ],
        },
        {
          title: 'Hoạt động Tinh thần',
          items: [
            'Cơ quan học: Buổi tu văn tâm lý, lớp học sở thích, thiền...',
            'Theo nhu cầu',
            'Đặc quyền: Thỏa cốc chuyện đổi ngoại...',
          ],
        },
      ],
    },
    standard: {
      name: 'Gói Thường',
      icon: '💚',
      price: '90,000 - 150,000',
      priceUnit: 'VNĐ/tháng',
      color: 'green',
      features: [
        {
          title: 'Lưu trú & Sinh hoạt',
          items: [
            'Chỗ ở: 4-8 người',
            'Vệ sinh & Giặt giũ: Định kỳ',
            'Đồ dùng thiết yếu: Khăn mặt, khăn, xà phòng',
          ],
        },
        {
          title: 'Dinh dưỡng',
          items: [
            'Chế độ ăn: 3 bữa chính & 1-2 bữa phụ',
            'Thực đơn: Phù hợp cho thể trạng chung',
          ],
        },
        {
          title: 'Chăm sóc Sức khỏe',
          items: [
            'Theo dõi cơ bản: Hàng ngày',
            'Tư vấn y tế: Theo bệnh lý, thông thường: Hỗ, cam...',
            'Thuốc: Hỗ trợ theo toa',
          ],
        },
        {
          title: 'Hoạt động Tinh thần',
          items: [
            'Hoạt động tập thể: Hội giao, CLB VH, sáng tạo...',
            'Kỹ giảng: Phòng giải trí, sân vườn',
          ],
        },
      ],
    },
  };

  const handleBooking = (packageType: 'vip' | 'standard') => {
    setSelectedPackage(packageType);
    // TODO: Implement booking logic
    alert(`Bạn đã chọn ${packages[packageType].name}. Chức năng đặt gói đang được phát triển!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Gói Dịch Vụ Chăm Sóc</h1>
          <p className="text-lg text-gray-600">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* VIP Package */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-amber-400 transform hover:scale-105 transition-transform">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{packages.vip.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold">{packages.vip.name}</h2>
                    <p className="text-amber-100">Cao cấp & Toàn diện</p>
                  </div>
                </div>
              </div>
              <div className="text-center py-4 bg-white/20 rounded-lg">
                <p className="text-4xl font-bold">{packages.vip.price}</p>
                <p className="text-sm text-amber-100">{packages.vip.priceUnit}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {packages.vip.features.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-lg mb-3 text-amber-700">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500 mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={() => handleBooking('vip')}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg"
              >
                Đặt Gói VIP Ngay
              </button>
            </div>
          </div>

          {/* Standard Package */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-green-400 transform hover:scale-105 transition-transform">
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{packages.standard.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold">{packages.standard.name}</h2>
                    <p className="text-green-100">Tiết kiệm & Chất lượng</p>
                  </div>
                </div>
              </div>
              <div className="text-center py-4 bg-white/20 rounded-lg">
                <p className="text-4xl font-bold">{packages.standard.price}</p>
                <p className="text-sm text-green-100">{packages.standard.priceUnit}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {packages.standard.features.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-lg mb-3 text-green-700">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={() => handleBooking('standard')}
                className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all shadow-lg"
              >
                Đặt Gói Thường Ngay
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Note */}
        <div className="mt-12 max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-900">
            💡 Lưu ý khi chọn gói
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                <strong>Gói VIP:</strong> Phù hợp cho người cần chăm sóc đặc biệt, phòng riêng, và dịch vụ cao cấp
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                <strong>Gói Thường:</strong> Phù hợp cho người cần chăm sóc cơ bản, thích sinh hoạt tập thể
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                Giá có thể thay đổi tùy theo tình trạng sức khỏe và yêu cầu đặc biệt
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>
                Liên hệ hotline để được tư vấn chi tiết và đăng ký gói phù hợp
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Cần tư vấn thêm? Liên hệ với chúng tôi
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="tel:1900123456"
              className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              📞 Gọi Hotline
            </a>
            <Link
              to="/activities"
              className="px-8 py-3 border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Xem Dịch Vụ Khác
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <HotlineButton />
    </div>
  );
}
