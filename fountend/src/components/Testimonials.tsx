const testimonials = [
  {
    name: "Bà Mai Anh",
    role: "Thành viên CLB Yoga",
    quote:
      "Từ ngày tham gia CLB Yoga, tôi thấy mình khỏe hơn, dẻo dai hơn và có thêm nhiều người bạn mới. Đây thực sự là ngôi nhà thứ hai của tôi.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAs2whSNaU_S1LtLK3I4d7m4w8oqYd6SJm5mT1fhPKF0ixauwmW9ONuXYSQdhahoJJk3bVqeRz-ZIZnS4opRHkt6_aeQIPHDJZh0LY1LmmdwReeSK82sripiuuEQB0sQ3fHs3lJipYFh-So_Y5ErKfXdWo1cXe9ghymBaIy2NLVeSqD9SZ0BWp_Kd6IO2TJWXh7zokK62tMLAf_n6NKodVP95E8En0Lrhpd9UdmBpyl-LBUP5WowOuAVumcr1Xh0sK_Gkk3EvmQLxze",
  },
  {
    name: "Ông Trần Hùng",
    role: "Thành viên CLB Du lịch",
    quote:
      "Chuyến đi Đà Lạt vừa rồi thật tuyệt vời. Mọi thứ được sắp xếp chu đáo, giúp chúng tôi có những trải nghiệm khó quên. Tôi rất mong chờ chuyến đi tiếp theo.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ34Br0WH5u1qyTt6uMe-ywodXByyeyjs9i-Y_5Rb1UHcMNz-myCVFBzAmN3zXTghHpTksRv6SjlEz-0sHwIl0N1sXDV7gdacPcR30I4yyB44__i0uD0aedyXx4bpXVuR1UZE4t-b7lstMGWPPy9uE_KyC3BEhpMRg7v2xFHJIOIXX8Uz9zcZnVKyx7hdwNnRBdvV38Kajs2q1fAFkyhZullkR-PDD33GXxNci79loO_zDAFXx8LToEhan_dV7aZjG1qxUZXQ-MRJH",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Chia sẻ từ thành viên</h2>
        <p className="text-gray-600">
          Lắng nghe những câu chuyện và trải nghiệm tuyệt vời từ cộng đồng của chúng tôi.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-8 rounded-lg text-center">
            <img 
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
