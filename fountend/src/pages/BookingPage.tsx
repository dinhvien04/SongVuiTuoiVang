import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, checkAuth, clearAuth } from '../utils/auth';
import { useCart } from '../context/CartContext';
import { activityAPI } from '../services/api';

function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isSelfService, setIsSelfService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicePrice, setServicePrice] = useState(0);
  const [servicePriceUnit, setServicePriceUnit] = useState('tháng');

  const serviceType = searchParams.get('type') || 'package';
  const serviceName = searchParams.get('name') || '';
  const packageType = searchParams.get('package') as 'vip' | 'standard' | null;
  const activityId = searchParams.get('id');

  const [formData, setFormData] = useState({
    elderName: '',
    elderAge: '',
    elderGender: '',
    elderRelationship: 'Bản thân',
    elderHealth: '',
    elderInsurance: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!checkAuth()) {
      clearAuth();
      alert('Vui lòng đăng nhập để đặt dịch vụ!');
      navigate('/login');
      return;
    }
    const userData = getUser();
    if (userData) setUser(userData);

    // Fetch activity price if it's an activity
    if (serviceType === 'activity' && activityId) {
      fetchActivityPrice(activityId);
    } else if (serviceType === 'package') {
      // Set default package prices per day
      if (packageType === 'vip') {
        setServicePrice(400000);
        setServicePriceUnit('ngày');
      } else {
        setServicePrice(250000);
        setServicePriceUnit('ngày');
      }
    }
  }, [navigate, serviceType, activityId, packageType]);

  const fetchActivityPrice = async (id: string) => {
    try {
      const result = await activityAPI.getById(id);
      if (result.success && result.data) {
        const activity = Array.isArray(result.data) ? result.data[0] : result.data;
        setServicePrice(activity.price);
        setServicePriceUnit(activity.priceUnit || 'lần');
      }
    } catch (error) {
      console.error('Error fetching activity price:', error);
    }
  };

  const handleSelfServiceChange = (checked: boolean) => {
    setIsSelfService(checked);
    if (checked && user) {
      setFormData({
        ...formData,
        elderName: user.name,
        elderAge: user.dateOfBirth ? calculateAge(user.dateOfBirth).toString() : '',
        elderGender: user.gender || '',
        elderRelationship: 'Bản thân',
      });
    } else {
      setFormData({
        ...formData,
        elderName: '',
        elderAge: '',
        elderGender: '',
        elderRelationship: 'Bản thân',
      });
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File quá lớn! Tối đa 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, elderInsurance: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateTotalDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    return servicePrice * days;
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.elderName || !formData.elderAge || !formData.elderGender || !formData.startDate || !formData.endDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Validate dates
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('Ngày kết thúc phải sau ngày bắt đầu!');
      return;
    }

    const totalDays = calculateTotalDays();
    const totalPrice = calculateTotalPrice();

    setLoading(true);

    try {
      // Add to cart
      addItem({
        id: Date.now().toString(),
        serviceType: serviceType as 'package' | 'activity',
        serviceName,
        packageType: packageType || undefined,
        price: totalPrice,
        pricePerDay: servicePrice,
        totalDays,
        priceUnit: servicePriceUnit,
        elderName: formData.elderName,
        elderAge: parseInt(formData.elderAge),
        elderGender: formData.elderGender,
        elderRelationship: formData.elderRelationship,
        elderHealth: formData.elderHealth,
        elderInsurance: formData.elderInsurance,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
      });

      alert('Đã thêm vào giỏ hàng!');
      navigate('/cart');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-3xl font-bold mb-2">Đặt Dịch Vụ</h1>
          <p className="text-gray-600 mb-6">Vui lòng điền đầy đủ thông tin để đặt dịch vụ</p>

          <form onSubmit={handleAddToCart} className="space-y-8">
            {/* Thông tin người đặt */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin người đặt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ và tên</p>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-semibold">{user.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Checkbox tự sử dụng */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                id="selfService"
                checked={isSelfService}
                onChange={(e) => handleSelfServiceChange(e.target.checked)}
                className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
              />
              <label htmlFor="selfService" className="font-semibold text-blue-900 cursor-pointer">
                Tôi là người sử dụng dịch vụ
              </label>
            </div>

            {/* Thông tin người sử dụng */}
            <div>
              <h2 className="text-xl font-bold mb-4">Thông tin người sử dụng dịch vụ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    name="elderName"
                    value={formData.elderName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tuổi *</label>
                  <input
                    type="number"
                    name="elderAge"
                    value={formData.elderAge}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Giới tính *</label>
                  <select
                    name="elderGender"
                    value={formData.elderGender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Quan hệ với người đặt *</label>
                  <select
                    name="elderRelationship"
                    value={formData.elderRelationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                    disabled={isSelfService}
                  >
                    <option value="Bản thân">Bản thân</option>
                    <option value="Cha">Cha</option>
                    <option value="Mẹ">Mẹ</option>
                    <option value="Ông">Ông</option>
                    <option value="Bà">Bà</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Tình trạng sức khỏe</label>
                  <textarea
                    name="elderHealth"
                    value={formData.elderHealth}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="VD: Tiểu đường, huyết áp cao..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Căn cước công dân</label>
                  <label className="cursor-pointer block">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg hover:border-green-500 hover:bg-green-50">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">Chọn hình ảnh CCCD</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {formData.elderInsurance && (
                    <div className="mt-3 relative">
                      <img
                        src={formData.elderInsurance}
                        alt="Insurance"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, elderInsurance: '' })}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin dịch vụ */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin dịch vụ</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Dịch vụ đã chọn</p>
                  <p className="font-semibold text-lg">{serviceName}</p>
                  {packageType && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                        packageType === 'vip'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {packageType === 'vip' ? '👑 Gói VIP' : '💚 Gói Thường'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Giá dịch vụ</p>
                  <p className="text-xl font-bold text-green-600">
                    {servicePrice.toLocaleString('vi-VN')}đ
                    <span className="text-sm text-gray-500 ml-1">/{servicePriceUnit}</span>
                  </p>
                </div>
                {formData.startDate && formData.endDate && calculateTotalDays() > 0 && (
                  <div className="bg-white rounded-lg p-4 border-2 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Tổng số ngày</p>
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      {calculateTotalDays()} ngày
                    </p>
                    <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                    <p className="text-3xl font-bold text-green-600">
                      {calculateTotalPrice().toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-2">Ngày bắt đầu sử dụng *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Ngày kết thúc sử dụng *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Ghi chú đặc biệt</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Yêu cầu đặc biệt hoặc thông tin bổ sung..."
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold disabled:bg-gray-400"
              >
                {loading ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookingPage;
