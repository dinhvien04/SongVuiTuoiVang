export default function Footer() {
  return (
    <footer className="mt-8 md:mt-16 border-t pt-8 md:pt-12 pb-6 md:pb-8 px-2 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#10B981"/>
              </svg>
            </div>
            <span className="font-bold">Sống Vui Khỏe</span>
          </div>
          <p className="text-sm text-gray-600">
            Nền tảng kết nối và giải trí dành cho người cao tuổi.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Thông tin</h3>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">Về chúng tôi</a>
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">Chính sách bảo mật</a>
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">Điều khoản sử dụng</a>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Liên hệ</h3>
          <p className="text-sm text-gray-600">Email: lienhe@songvuikhoe.vn</p>
          <p className="text-sm text-gray-600">Điện thoại: 1900 1234</p>
        </div>
      </div>

      <div className="border-t pt-4 md:pt-6 text-center">
        <p className="text-xs md:text-sm text-gray-500">
          © 2024 Sống Vui Khỏe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
