import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotlineButton from '../components/HotlineButton';
import { activityAPI, Activity } from '../services/api';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineFilter, setOnlineFilter] = useState(false);
  const [offlineFilter, setOfflineFilter] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const result = await activityAPI.getAll();
      if (result.success && result.data) {
        setActivities(result.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesCategory =
      selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesSearch = activity.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFormat =
      (!onlineFilter && !offlineFilter) ||
      (onlineFilter && activity.format === 'online') ||
      (offlineFilter && activity.format === 'offline');

    return matchesCategory && matchesSearch && matchesFormat;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 lg:max-w-xs">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-4">
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">Bộ lọc</h2>
                <p className="text-sm text-gray-600">
                  Lọc kết quả theo lựa chọn của bạn
                </p>
              </div>

              {/* Category Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3">Loại Dịch Vụ</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl"></span>
                    <span className="text-sm font-medium">Gói Dịch vụ</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('games')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'games'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl"></span>
                    <span className="text-sm font-medium">Chăm sóc sức khỏe</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('class')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'class'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl"></span>
                    <span className="text-sm font-medium">Giải trí</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('music')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'music'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl"></span>
                    <span className="text-sm font-medium">Tham quan Du lịch</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('sports')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'sports'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl"></span>
                    <span className="text-sm font-medium">quà Lưu niệm</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Format Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3">Hình Thức</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlineFilter}
                      onChange={(e) => setOnlineFilter(e.target.checked)}
                      className="rounded text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm">Tại Nhà</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offlineFilter}
                      onChange={(e) => setOfflineFilter(e.target.checked)}
                      className="rounded text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm">Tại trung tâm</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPackage('all');
                  setOnlineFilter(false);
                  setOfflineFilter(false);
                  setSearchQuery('');
                }}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4">
            {/* Page Heading */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Khám Phá Dịch Vụ
              </h1>
              <p className="text-gray-600">
                Tìm kiếm các dịch vụ chăm sóc và hoạt động phù hợp với bạn
              </p>
            </div>

            {/* Package Cards - Show when category is "all" */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Gói Dịch Vụ Chăm Sóc</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* VIP Package Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-400 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">👑</span>
                      <div>
                        <h3 className="text-2xl font-bold text-amber-700">
                          Gói VIP
                        </h3>
                        <p className="text-sm text-amber-600">
                          Cao cấp & Toàn diện
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-3xl font-bold text-amber-600">
                        180,000 - 400,000đ
                      </p>
                      <p className="text-sm text-gray-600">VNĐ/tháng</p>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500">✓</span>
                        <span>Phòng đơn/đôi cao cấp 4-5 sao</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500">✓</span>
                        <span>Tỉ lệ chăm sóc 1:2-3</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500">✓</span>
                        <span>Bác sĩ theo dõi thường xuyên</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500">✓</span>
                        <span>Thực đơn riêng biệt</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500">✓</span>
                        <span>Dịch vụ làm đẹp cao cấp</span>
                      </li>
                    </ul>
                    <Link
                      to="/packages"
                      className="block w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-center rounded-lg font-bold hover:from-amber-500 hover:to-amber-600 transition-all"
                    >
                      Xem Chi Tiết & Đặt Gói
                    </Link>
                  </div>

                  {/* Standard Package Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-400 p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">💚</span>
                      <div>
                        <h3 className="text-2xl font-bold text-green-700">
                          Gói Thường
                        </h3>
                        <p className="text-sm text-green-600">
                          Tiết kiệm & Chất lượng
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-3xl font-bold text-green-600">
                        90,000 - 150,000đ
                      </p>
                      <p className="text-sm text-gray-600">VNĐ/tháng</p>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span>Phòng 4-8 người tiện nghi</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span>3 bữa chính + 1-2 bữa phụ</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span>Theo dõi sức khỏe hàng ngày</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span>Hoạt động tập thể đa dạng</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span>Phòng giải trí, sân vườn</span>
                      </li>
                    </ul>
                    <Link
                      to="/packages"
                      className="block w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white text-center rounded-lg font-bold hover:from-green-500 hover:to-green-600 transition-all"
                    >
                      Xem Chi Tiết & Đặt Gói
                    </Link>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-6 mb-6">
                  <h2 className="text-2xl font-bold">Các Dịch Vụ Khác</h2>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm dịch vụ, gói chăm sóc..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Divider */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Các Dịch Vụ Khác</h2>
              </div>
            )}

            {/* Results Count */}
            {(selectedCategory !== 'all' || searchQuery) && (
              <p className="text-sm text-gray-600 mb-4">
                Tìm thấy {filteredActivities.length} dịch vụ
              </p>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            )}

            {/* Activity Cards Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity._id}
                  className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all ${
                    activity.package === 'vip'
                      ? 'border-amber-400'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Package Badge */}
                  <div className="relative">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                        activity.package === 'vip'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {activity.package === 'vip' ? '👑 VIP' : '💚 Thường'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold flex-1">
                        {activity.title}
                      </h3>
                      <div className="text-right ml-2">
                        <p className="text-lg font-bold text-green-600">
                          {activity.price.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.priceUnit}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                        <span>{activity.participants}</span>
                      </div>
                    </div>

                    {/* Features */}
                    {activity.features && activity.features.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Đặc điểm nổi bật:
                        </p>
                        <ul className="space-y-1">
                          {activity.features.slice(0, 3).map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-600 flex items-start gap-1"
                            >
                              <span className="text-green-500 mt-0.5">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      to={`/activities/${activity._id}`}
                      className={`block w-full py-2 rounded-lg font-semibold text-center transition-colors ${
                        activity.package === 'vip'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Xem chi tiết & Đăng ký
                    </Link>
                  </div>
                </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy dịch vụ phù hợp
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setOnlineFilter(false);
                    setOfflineFilter(false);
                    setSearchQuery('');
                  }}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
      <HotlineButton />
    </div>
  );
}
