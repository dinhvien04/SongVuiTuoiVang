export default function Hero() {
  return (
    <div className="relative rounded-xl md:rounded-2xl overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center text-center px-4 md:px-8 mt-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgQXZRGVhss96Ewkbo1qWVeKRNoxGWia3gqL-c_mWCvG5JPXQ8ynYFcnnTEN3xneejsls2ViEPuNc4JNGeDVv1770rzpLLbnHSae5HQ3VsR4PfjPQXhmVkxc6-TxzdXElEvnXDq8MFQauy2-vSFfR5bZFlvg5bLSbtkQhMwGvAkNvgbr_03jxzJ1m2I3053cg_ojLdzstIsQFXUNQHMDvBiHX3R3Nh_uWdTWH1dq5tiLfpe7L0Gagx-iO-_-NPz_pLdMFhVJRAq6t1")',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
          Sống Vui - Sống Khỏe Mỗi Ngày
        </h1>
        <p className="text-white text-sm md:text-lg mb-4 md:mb-6 px-4">
          Khám phá thế giới hoạt động giải trí đa dạng và kết nối với cộng đồng
          <br className="hidden md:block" />
          những người bạn tuyệt vời.
        </p>
        <button className="px-5 py-2.5 md:px-6 md:py-3 bg-green-500 text-white rounded-lg text-sm md:text-base font-semibold hover:bg-green-600 transition-colors">
          Khám Phá Ngay
        </button>
      </div>
    </div>
  );
}
