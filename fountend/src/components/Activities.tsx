const activities = [
  {
    title: "Lớp học Yoga Dưỡng sinh",
    description: "Tăng cường sự dẻo dai và thư giãn tinh thần.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2wafDzr_TWk1BaKev2EzBKzvchJxy_tmDAm-ByMIzjpfHdMtQPzXawujEEQqRtGUyq6tApvE8JjYc8HFIZxedE93Xgh4Die8KB_R-xYoB_0RXCR0lrbF8S62DLizWWxRb0bnnjQkUeRYGrJ-pkWY-nKpjA-MrjR_ZLr1tgS0zyb6GL5V68eG_cEb9f2ffZJKhO_QYBw6yX7OqbaAUuJJDkfTNLxp2EddE9fLkFqVG3YtWqI_noi2nP63uo-y3lHSchKVPHngpvSJ",
  },
  {
    title: "Câu lạc bộ Cờ tướng",
    description: "Rèn luyện trí tuệ và giao lưu cùng bạn bè.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgc25WwHQusokhqfJOuxjjCkmr3EaOwvtdMc1WT9i9mz3TtPh6pRMAoBaJ28s_qJr1a-5MttCZrI7Yu3ONtHLuCmlgXkkFEQttiK9PkCGZVOjrlInmss8WFdoNQMyE2Fpx-666adC6e6Wtuzq5oJ_VQ7kGhXpjDmefyyGOKfJgHty_RcHRhLFaViV0pwHkyH9ISLaXaP_c1nsHYiO0z3RAhOFojmC40z24KxVhygDQTa0s1LDAe2kzlKk_iR4NkKROG4fD8OHuv8io",
  },
  {
    title: "Tour du lịch Đà Lạt",
    description: "Tận hưởng không khí trong lành và cảnh đẹp.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAk0KLadiyYhvJ2FbmwCfMfPwxkF_glS5ZRhUjHaHtyKpuvsHRs_AT2Z2ARqhTaHIvO0TQb__M7JCr65vRrUSAWZRnvaY-ZDxlOxn6zDUN9l7PCBtOL8eGJOnkuUKzS0hZVvkZedM6f5mPN1D_tZsuSA0kpSS-B_STmXFXwgHivizR0xfhe5cwELQr_qYYfcylNZXqBmhkFxd_9cnOu1vLCe5VvoyV3cwSexUct2hlZj-ieAoF5_2VBtqvZhHLmQxbe9oAcc0cHTzvF",
  },
  {
    title: "Workshop Làm gốm",
    description: "Khơi nguồn sáng tạo và tự tay làm sản phẩm.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvWTYfH6G3_VmuHxPXP9JfILor163CijfIeSuzJ9gximHsdOnkPHBW97ImLMCkcaeHBU8PP1pv5kyNswnL82H7N-ZhX7EAqYSTqZEgZjguTnAgA0Y98EWryA5pkztVc_ARRH0BTE-Hc34uejzIkVJHrD069VaclGL1cj2-WQqMWV9a9yaOuSM2_WHDGjP9eJvsrYEE6P_xbsVNlkL03YXzUDeoC9nieiB7Q7JKc17YYl_DIH7dUkUD-s59TxyJ8ezUK2mQbMr9geL9",
  },
];

export default function Activities() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-6">Hoạt Động Nổi Bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((activity, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="rounded-lg overflow-hidden mb-3">
              <img 
                src={activity.image}
                alt={activity.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold mb-1">{activity.title}</h3>
            <p className="text-sm text-gray-600">{activity.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
