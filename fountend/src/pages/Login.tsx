import { useState } from 'react';
import { Link } from 'react-router-dom';
import { setAuth, clearAuth } from '../utils/auth';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clear any existing auth data first
      clearAuth();
      
      const { authAPI } = await import('../services/api');
      const result = await authAPI.login({ email, password });
      
      if (result.success && result.data) {
        // Use auth utility to safely store credentials
        setAuth(result.data.token, result.data);
        alert('Đăng nhập thành công!');
        
        // Redirect based on role
        if (result.data.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        alert(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      clearAuth();
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-xl overflow-hidden md:flex">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-green-600">Sống Vui Khỏe</span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Chào mừng trở lại!</h1>
              <p className="text-gray-600">Kết nối, giải trí và sống vui mỗi ngày.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Địa chỉ Email hoặc Số điện thoại
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nhập email hoặc số điện thoại"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Mật khẩu</label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-amber-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
              </button>

              <p className="text-center text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-bold text-amber-600 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtYKkD1XnHgRKrw4e4q8SPlQalCPjpfcerYKyWaNTOdZlO2l3Jm8cAFQHS7Wh0xZ_jZOt1TKSQWA6jPgDhCCe3KvjMsUBvi_wSukoixhBsmC5gQwuZ7YnO04ZQPZqYj07xbhsKL14mP3WP7Up5X4q7We_pLCZXLLub_PoktwJ6Jvh2rpDFjL9gBoJpvqMw1BZYhkWeU-o9bs-LtNWhkr8LXCFhXLrvaZnXVKLCynXx7BDrUd6doCJRGxyeHnqrsk3BqpgEPiQXRiTy")',
            }}
          />
          <div className="absolute inset-0 bg-green-600 opacity-30" />
        </div>
      </div>
    </div>
  );
}
