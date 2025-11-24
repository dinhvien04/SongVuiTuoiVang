import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, checkAuth, clearAuth } from '../utils/auth';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    insuranceCard: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      clearAuth();
      alert('Vui lòng đăng nhập!');
      navigate('/login');
      return;
    }
    const userData = getUser();
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        address: userData.address || '',
        insuranceCard: userData.insuranceCard || '',
      });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        setFormData({ ...formData, insuranceCard: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { authAPI } = await import('../services/api');
      const result = await authAPI.updateProfile(formData);
      if (result.success && result.data) {
        localStorage.setItem('user', JSON.stringify(result.data));
        alert('Cập nhật thành công!');
        navigate('/profile');
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-bold mb-6">Chỉnh sửa thông tin</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Họ và tên *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Số điện thoại *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Ngày sinh</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Giới tính</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Địa chỉ</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Thẻ bảo hiểm y tế</label>
              <label className="cursor-pointer block">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg hover:border-green-500 hover:bg-green-50">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Chọn hình ảnh</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {formData.insuranceCard && (
                <div className="mt-3 relative">
                  <img src={formData.insuranceCard} alt="Insurance" className="w-full h-48 object-cover rounded-lg" />
                  <button type="button" onClick={() => setFormData({ ...formData, insuranceCard: '' })} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">* JPG, PNG. Tối đa 5MB</p>
            </div>
            <div className="flex gap-4 pt-4 border-t">
              <button type="button" onClick={() => navigate('/profile')} className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 font-semibold">Hủy</button>
              <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold disabled:bg-gray-400">
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
