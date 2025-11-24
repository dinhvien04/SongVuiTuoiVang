import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, checkAuth, clearAuth } from '../utils/auth';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  insuranceCard?: string;
}

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!checkAuth()) {
      clearAuth();
      alert('Vui lòng đăng nhập!');
      navigate('/login');
      return;
    }
    const userData = getUser();
    if (userData) setUser(userData);
  }, [navigate]);

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
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex gap-6 items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button onClick={() => navigate('/profile/edit')} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
              Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
              <p className="text-gray-600 font-medium">Họ và tên</p>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
              <p className="text-gray-600 font-medium">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
              <p className="text-gray-600 font-medium">Số điện thoại</p>
              <p className="text-gray-900">{user.phone}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
              <p className="text-gray-600 font-medium">Ngày sinh</p>
              <p className="text-gray-900">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
              <p className="text-gray-600 font-medium">Giới tính</p>
              <p className="text-gray-900">{user.gender || 'Chưa cập nhật'}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
              <p className="text-gray-600 font-medium">Địa chỉ</p>
              <p className="text-gray-900">{user.address || 'Chưa cập nhật'}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[25%_1fr] gap-4 py-4 border-t">
              <p className="text-gray-600 font-medium">Thẻ bảo hiểm</p>
              {user.insuranceCard ? (
                <img src={user.insuranceCard} alt="Insurance" className="w-full max-w-md h-48 object-cover rounded-lg" />
              ) : (
                <p className="text-gray-900">Chưa cập nhật</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
