import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/otp/send-register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Mã OTP đã được gửi đến email của bạn!');
        setStep('otp');
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify OTP first
      const verifyResponse = await fetch(
        'http://localhost:5000/api/otp/verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            otp,
            type: 'register',
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        alert(verifyData.message || 'Mã OTP không đúng');
        setLoading(false);
        return;
      }

      // Register user
      const { authAPI } = await import('../services/api');
      const result = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (result.success && result.data) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data));
        alert('Đăng ký thành công!');
        window.location.href = '/';
      } else {
        alert(result.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              <h1 className="text-4xl font-bold mb-2">Tạo tài khoản mới</h1>
              <p className="text-gray-600">Tham gia cộng đồng sống vui khỏe ngay hôm nay!</p>
            </div>

            {/* Form */}
            {step === 'form' ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Xác nhận mật khẩu</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Đang gửi...' : 'Tiếp tục'}
              </button>

              <p className="text-center text-gray-600">
                Đã có tài khoản?{' '}
                <Link
                  to="/login"
                  className="font-bold text-amber-600 hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
            ) : (
              <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Mã OTP đã được gửi đến
                  </p>
                  <p className="font-semibold text-green-600">
                    {formData.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mã OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Mã OTP có hiệu lực trong 10 phút
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Đang xử lý...' : 'Xác thực và Đăng ký'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Quay lại
                </button>
              </form>
            )}
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
