import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getUser, checkAuth } from '../../utils/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  createdAt: string;
}

export default function ManageUsers() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!checkAuth() || currentUser?.role !== 'admin') {
      alert('Bạn không có quyền truy cập!');
      navigate('/');
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success && result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Lỗi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    if (userId === currentUser?._id) {
      alert('Bạn không thể thay đổi quyền của chính mình!');
      return;
    }

    if (!window.confirm(`Xác nhận thay đổi quyền thành "${newRole === 'admin' ? 'Admin' : 'User'}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Cập nhật quyền thành công!');
        fetchUsers();
        setShowDetailModal(false);
      } else {
        alert(result.message || 'Lỗi cập nhật!');
      }
    } catch (error) {
      alert('Lỗi cập nhật quyền!');
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === currentUser?._id) {
      alert('Bạn không thể xóa tài khoản của chính mình!');
      return;
    }

    if (!window.confirm('Xác nhận xóa người dùng này? Hành động này không thể hoàn tác!')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        alert('Xóa người dùng thành công!');
        fetchUsers();
        setShowDetailModal(false);
      } else {
        alert(result.message || 'Lỗi xóa người dùng!');
      }
    } catch (error) {
      alert('Lỗi xóa người dùng!');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
        👑 Admin
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        👤 User
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
            <p className="text-gray-600">Tổng số: {filteredUsers.length} người dùng</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            ← Quay lại Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tên, email, SĐT..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Quyền</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="all">Tất cả</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có người dùng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Người dùng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Liên hệ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Thông tin</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Quyền</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ngày tạo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            {user._id === currentUser?._id && (
                              <span className="text-xs text-green-600">(Bạn)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">
                          {user.gender || 'Chưa cập nhật'} - {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{user.address || 'Chưa có địa chỉ'}</p>
                      </td>
                      <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                          }}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Chi tiết người dùng</h2>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3">Thông tin cơ bản</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Tên:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>SĐT:</strong> {selectedUser.phone}</p>
                        <p><strong>Quyền:</strong> {getRoleBadge(selectedUser.role)}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3">Thông tin bổ sung</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Giới tính:</strong> {selectedUser.gender || 'Chưa cập nhật'}</p>
                        <p><strong>Ngày sinh:</strong> {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                        <p><strong>Địa chỉ:</strong> {selectedUser.address || 'Chưa cập nhật'}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>

                  {selectedUser._id !== currentUser?._id && (
                    <div className="pt-4 border-t space-y-3">
                      <h3 className="font-bold">Quản lý tài khoản</h3>
                      <div className="flex gap-3">
                        {selectedUser.role === 'user' ? (
                          <button
                            onClick={() => updateUserRole(selectedUser._id, 'admin')}
                            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                          >
                            Nâng cấp lên Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserRole(selectedUser._id, 'user')}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Hạ xuống User
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(selectedUser._id)}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Xóa tài khoản
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="w-full px-6 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
