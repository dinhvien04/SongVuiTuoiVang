export default function About() {
  return (
    <section className="py-8 md:py-12 px-2 md:px-0">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
        Về Chúng Tôi
      </h2>
      <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-3xl">
        Sứ mệnh của chúng tôi là tạo ra một không gian kết nối, nơi người cao tuổi có thể tìm thấy niềm vui, duy trì sức khỏe và làm phong phú thêm đời sống tinh thần mỗi ngày.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="flex flex-col items-center text-center p-6 border rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Cộng đồng Gắn kết</h3>
          <p className="text-sm text-gray-600">
            Tham gia các câu lạc bộ và sự kiện để gặp gỡ những người bạn mới.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 border rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Sức khỏe Toàn diện</h3>
          <p className="text-sm text-gray-600">
            Các hoạt động thể chất và tinh thần được thiết kế phù hợp.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 border rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Niềm vui Mỗi ngày</h3>
          <p className="text-sm text-gray-600">
            Khám phá sở thích mới và tận hưởng những khoảnh khắc đáng nhớ.
          </p>
        </div>
      </div>
    </section>
  );
}
