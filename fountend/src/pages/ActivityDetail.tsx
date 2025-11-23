import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotlineButton from '../components/HotlineButton';
import { activityAPI, Activity } from '../services/api';

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchActivity(id);
    }
  }, [id]);

  const fetchActivity = async (activityId: string) => {
    try {
      setLoading(true);
      const result = await activityAPI.getById(activityId);
      if (result.success && result.data) {
        // Backend returns single object, not array
        const activityData = Array.isArray(result.data) ? result.data[0] : result.data;
        setActivity(activityData);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (!activity) return;
    // TODO: Implement registration logic
    alert(`Đăng ký tham gia: ${activity.title}`);
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

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-gray-600">Không tìm thấy dịch vụ</p>
            <Link
              to="/activities"
              className="mt-4 inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden h-80 mb-6">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-white text-4xl font-bold">{activity.title}</h1>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Trang chủ
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/activities" className="text-gray-500 hover:text-gray-700">
            Danh sách Dịch Vụ
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{activity.title}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Mô tả Dịch Vụ</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {activity.description}
                </p>
                {activity.features && activity.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">Đặc điểm nổi bật</h3>
                    <ul className="space-y-2">
                      {activity.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details & Registration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-5">Thông tin chi tiết</h3>

              <div className="space-y-5">
                {/* Date & Time */}
                <div className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-gray-600 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Ngày & Giờ</p>
                    <p className="text-gray-600 text-sm">{activity.date}</p>
                    <p className="text-gray-600 text-sm">{activity.time}</p>
                  </div>
                </div>

                {/* Location */}
                {activity.location && (
                  <div className="flex items-start gap-4">
                    <svg
                      className="w-6 h-6 text-gray-600 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Địa điểm</p>
                      <p className="text-gray-600 text-sm">{activity.location}</p>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-gray-600 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Chi phí</p>
                    <p className="text-gray-600 text-sm">
                      {activity.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="text-gray-500 text-xs">{activity.priceUnit}</p>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-gray-600 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Số lượng</p>
                    <p className="text-gray-600 text-sm">{activity.participants}</p>
                  </div>
                </div>

                {/* Instructor */}
                {activity.instructor && (
                  <div className="flex items-start gap-4">
                    <svg
                      className="w-6 h-6 text-gray-600 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Hướng dẫn viên</p>
                      <p className="text-gray-600 text-sm">{activity.instructor}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-lg transition-colors"
              >
                Đăng ký Tham gia
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-200">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Cần hỗ trợ?</h3>
            <p className="text-gray-700 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về dịch vụ hoặc cần giúp đỡ trong quá
              trình đăng ký, đừng ngần ngại liên hệ với chúng tôi.
            </p>
            <div className="space-y-2">
              <a
                href="tel:1900123456"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                1900.123.456 (Hotline)
              </a>
              <a
                href="mailto:hotro@songvuikhoe.vn"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                hotro@songvuikhoe.vn
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Chia sẻ dịch vụ này</h3>
            <p className="text-gray-700 mb-4">
              Hãy chia sẻ dịch vụ thú vị này đến bạn bè và người thân của bạn!
            </p>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <HotlineButton />
    </div>
  );
}
