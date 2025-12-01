import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function EditCartItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, updateItem } = useCart();
  const [loading, setLoading] = useState(false);

  const cartItem = items.find((item) => item.id === id);

  const [formData, setFormData] = useState({
    elderName: '',
    elderAge: '',
    elderGender: '',
    elderRelationship: '',
    elderHealth: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!cartItem) {
      alert('Không tìm thấy sản phẩm!');
      navigate('/cart');
      return;
    }

    setFormData({
      elderName: cartItem.elderName,
      elderAge: cartItem.elderAge.toString(),
      elderGender: cartItem.elderGender,
      elderRelationship: cartItem.elderRelationship,
      elderHealth: cartItem.elderHealth,
      startDate: cartItem.startDate,
      endDate: cartItem.endDate,
      notes: cartItem.notes,
    });
  }, [cartItem, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (!cartItem) return 0;
    const days = calculateTotalDays();
    return cartItem.pricePerDay * days;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.elderName || !formData.elderAge || !formData.elderGender || !formData.startDate || !formData.endDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('Ngày kết thúc phải sau ngày bắt đầu!');
      return;
    }

    if (!cartItem) return;

    setLoading(true);

    try {
      const totalDays = calculateTotalDays();
      const totalPrice = calculateTotalPrice();

      updateItem(cartItem.id, {
        ...cartItem,
        elderName: formData.elderName,
        elderAge: parseInt(formData.elderAge),
        elderGender: formData.elderGender,
        elderRelationship: formData.elderRelationship,
        elderHealth: formData.elderHealth,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        totalDays,
        price: totalPrice,
      });

      alert('Cập nhật thành công!');
      navigate('/cart');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (!cartItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-3xl font-bold mb-2">Chỉnh sửa thông tin</h1>
          <p className="text-gray-600 mb-6">{cartItem.serviceName}</p>

          <form onSubmit={handleSubmit} className="space-y-8">
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
              </div>
            </div>

            {/* Thông tin dịch vụ */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin dịch vụ</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Giá dịch vụ</p>
                  <p className="text-xl font-bold text-green-600">
                    {cartItem.pricePerDay.toLocaleString('vi-VN')}đ
                    <span className="text-sm text-gray-500 ml-1">/{cartItem.priceUnit}</span>
                  </p>
                </div>
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
                onClick={() => navigate('/cart')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold disabled:bg-gray-400"
              >
                {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
