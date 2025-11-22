import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-40">
      <div className="flex items-center justify-between py-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#10B981"
              />
            </svg>
          </div>
          <span className="font-bold text-base md:text-lg">
            Sống Vui Khỏe
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm hover:text-green-600">
            Trang chủ
          </a>
          <a href="#" className="text-sm hover:text-green-600">
            Hoạt động
          </a>
          <a href="#" className="text-sm hover:text-green-600">
            Tin tức
          </a>
          <a href="#" className="text-sm hover:text-green-600">
            Liên hệ
          </a>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user.name}</span>
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Trang cá nhân
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Cài đặt
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col p-4 space-y-3">
            <a
              href="#"
              className="py-2 text-sm hover:text-green-600 font-medium"
            >
              Trang chủ
            </a>
            <a
              href="#"
              className="py-2 text-sm hover:text-green-600 font-medium"
            >
              Hoạt động
            </a>
            <a
              href="#"
              className="py-2 text-sm hover:text-green-600 font-medium"
            >
              Tin tức
            </a>
            <a
              href="#"
              className="py-2 text-sm hover:text-green-600 font-medium"
            >
              Liên hệ
            </a>

            {user ? (
              <>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="block py-2 text-sm hover:text-green-600"
                  >
                    Trang cá nhân
                  </a>
                  <a
                    href="#"
                    className="block py-2 text-sm hover:text-green-600"
                  >
                    Cài ��ặt
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-sm text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}


