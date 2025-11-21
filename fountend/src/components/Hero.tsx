export default function Hero() {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[400px] flex items-center justify-center text-center px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgQXZRGVhss96Ewkbo1qWVeKRNoxGWia3gqL-c_mWCvG5JPXQ8ynYFcnnTEN3xneejsls2ViEPuNc4JNGeDVv1770rzpLLbnHSae5HQ3VsR4PfjPQXhmVkxc6-TxzdXElEvnXDq8MFQauy2-vSFfR5bZFlvg5bLSbtkQhMwGvAkNvgbr_03jxzJ1m2I3053cg_ojLdzstIsQFXUNQHMDvBiHX3R3Nh_uWdTWH1dq5tiLfpe7L0Gagx-iO-_-NPz_pLdMFhVJRAq6t1")',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
          Sống Vui - Sống Khỏe Mỗi Ngày
        </h1>
        <p className="text-white text-lg mb-6">
          Khám phá thế giới hoạt động giải trí đa dạng và kết nối với cộng đồng
          <br />
          những người bạn tuyệt vời.
        </p>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">
          Khám Phá Ngay
        </button>
      </div>
    </div>
  );
}
