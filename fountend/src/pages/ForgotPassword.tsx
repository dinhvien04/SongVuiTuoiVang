import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/otp/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type: 'reset-password' }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Xác thực thành công!');
        setStep('password');
      } else {
        alert(data.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      alert('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/otp/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Đặt lại mật khẩu thành công!');
        window.location.href = '/login';
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-green-600">
            Sống Vui Khỏe
          </span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Quên mật khẩu</h1>
          <p className="text-gray-600">
            {step === 'email' && 'Nhập email để nhận mã OTP'}
            {step === 'otp' && 'Nhập mã OTP đã gửi đến email'}
            {step === 'password' && 'Tạo mật khẩu mới'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>

            <p className="text-center text-gray-600">
              <Link to="/login" className="text-blue-600 hover:underline">
                Quay lại đăng nhập
              </Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Mã OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Gửi lại mã OTP
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Nhập mật khẩu mới"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Nhập lại mật khẩu mới"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
