import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { activityAPI } from '../../services/api';
import Header from '../../components/Header';
import { getUser, checkAuth, clearAuth } from '../../utils/auth';

export default function ActivityForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    date: '',
    time: '',
    participants: '',
    category: 'other',
    format: 'offline',
    package: 'standard',
    price: 0,
    priceUnit: 'VNĐ/tháng',
    location: '',
    instructor: '',
    features: [''],
  });

  useEffect(() => {
    // Check if auth is valid
    if (!checkAuth()) {
      clearAuth();
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      navigate('/login');
      return;
    }

    const user = getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
      return;
    }

    if (isEdit && id) {
      fetchActivity(id);
    }
  }, [navigate, isEdit, id]);

  const fetchActivity = async (activityId: string) => {
    try {
      const result = await activityAPI.getById(activityId);
      if (result.success && result.data) {
        // Backend returns single object, not array
        const activity = Array.isArray(result.data) ? result.data[0] : result.data;
        setFormData({
          title: activity.title,
          description: activity.description,
          image: activity.image,
          date: activity.date,
          time: activity.time,
          participants: activity.participants,
          category: activity.category,
          format: activity.format,
          package: activity.package,
          price: activity.price,
          priceUnit: activity.priceUnit,
          location: activity.location || '',
          instructor: activity.instructor || '',
          features: activity.features.length > 0 ? activity.features : [''],
        });
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước file quá lớn! Vui lòng chọn file nhỏ hơn 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const dataToSend = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ''),
        price: Number(formData.price),
        format: formData.format as 'online' | 'offline',
        category: formData.category as 'games' | 'class' | 'music' | 'sports' | 'other',
        package: formData.package as 'vip' | 'standard',
      };

      let result;
      if (isEdit && id) {
        const response = await fetch(
          `http://localhost:5000/api/activities/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
          }
        );
        result = await response.json();
      } else {
        result = await activityAPI.create(dataToSend);
      }

      if (result.success) {
        alert(isEdit ? 'Cập nhật thành công!' : 'Thêm dịch vụ thành công!');
        navigate('/admin/activities');
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Breadcrumb Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/admin/activities"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại Danh sách
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
          </h1>
          <div className="w-32"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Tên dịch vụ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="VD: Lớp Yoga Cười"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Mô tả chi tiết về dịch vụ..."
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Hình ảnh <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {/* File Upload Button */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
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
                      <span className="text-sm text-gray-600">
                        Chọn hình ảnh từ máy tính
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Or URL Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">hoặc</span>
                  </div>
                </div>

                <input
                  type="url"
                  name="image"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Hoặc nhập URL hình ảnh: https://example.com/image.jpg"
                />

                {/* Image Preview */}
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  * Chấp nhận file: JPG, PNG, GIF. Kích thước tối đa: 2MB
                </p>
              </div>
            </div>

            {/* Package & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Gói dịch vụ <span className="text-red-500">*</span>
                </label>
                <select
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  required
                >
                  <option value="standard">💚 Gói Thường</option>
                  <option value="vip">👑 Gói VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Loại dịch vụ <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  required
                >
                  <option value="other">Giải Dịch vụ</option>
                  <option value="class">Chăm sóc sức khỏe</option>
                  <option value="music">Giải trí</option>
                  <option value="sports">Tham quan Du lịch</option>
                  <option value="games">Quà Lưu niệm</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="VD: Thứ 3 & 5 hàng tuần"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Giờ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="VD: 9:00 - 10:00 (60 phút)"
                  required
                />
              </div>
            </div>

            {/* Price & Participants */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Giá <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="200000"
                    required
                  />
                  <input
                    type="text"
                    name="priceUnit"
                    value={formData.priceUnit}
                    onChange={handleChange}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="VNĐ/tháng"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="VD: Tối đa 15 người"
                  required
                />
              </div>
            </div>

            {/* Location & Instructor */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Địa điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="VD: Phòng tập số 1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Hướng dẫn viên
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="VD: Cô Lan"
                />
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Hình thức <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="offline"
                    checked={formData.format === 'offline'}
                    onChange={handleChange}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <span>Tại trung tâm</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="online"
                    checked={formData.format === 'online'}
                    onChange={handleChange}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <span>Trực tuyến</span>
                </label>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Đặc điểm nổi bật
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder={`Đặc điểm ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors w-full"
                >
                  ➕ Thêm đặc điểm
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/activities')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold disabled:bg-gray-400"
              >
                {loading
                  ? 'Đang xử lý...'
                  : isEdit
                  ? 'Cập nhật'
                  : 'Thêm Dịch vụ'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
