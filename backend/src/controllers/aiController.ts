import { Request, Response } from 'express';
import axios from 'axios';

// MegaLLM Configuration từ .env
const MEGALLM_API_KEY = process.env.MEGALLM_API_KEY || '';
const MEGALLM_BASE_URL = process.env.MEGALLM_BASE_URL || 'https://ai.megallm.io/v1';
const MEGALLM_MODEL = process.env.MEGALLM_MODEL || 'llama3.3-70b-instruct';

// System prompt cho AI chatbot chăm sóc khách hàng
const SYSTEM_PROMPT = `Bạn là trợ lý AI thông minh của "Sống Vui Khỏe" - nền tảng kết nối hoạt động sức khỏe cho người cao tuổi tại Quy Nhơn.

NHIỆM VỤ:
- Tư vấn về các hoạt động cụ thể trên website
- Giải thích gói dịch vụ VIP và Standard
- Hướng dẫn đăng ký, đặt lịch, thanh toán
- Tư vấn sức khỏe và lợi ích của từng hoạt động
- Hỗ trợ kỹ thuật: đăng nhập, quên mật khẩu

PHONG CÁCH:
- Thân thiện, kiên nhẫn với người cao tuổi
- Dùng từ đơn giản, dễ hiểu
- Trả lời ngắn gọn (2-4 câu)
- Dùng emoji phù hợp 😊
- Nếu không chắc, khuyên gọi hotline 1900123456

CÁC HOẠT ĐỘNG HIỆN CÓ:

🎮 TRÒ CHƠI TRÍ TUỆ:
1. Chơi Cờ Tướng - 120k/tháng (Standard)
   • Thứ 3, 5: 14:00-16:00
   • Phòng sinh hoạt tầng 2
   • Rèn luyện trí nhớ, giao lưu bạn bè

2. Câu Lạc Bộ Đánh Bài - 100k/tháng (Standard)
   • Hàng ngày: 15:00-17:00
   • Phòng giải trí tầng 1
   • Tiến lên, phỏm - giải trí lành mạnh

🧘 LỚP HỌC SỨC KHỎE:
3. Yoga Cười Buổi Sáng - 300k/tháng (VIP)
   • Thứ 2, 4, 6: 06:00-07:00
   • Sân thượng tầng 5
   • Giảm stress, tăng cường tim mạch

4. Thể Dục Dưỡng Sinh - 200k/tháng (Standard)
   • Hàng ngày: 06:30-07:30
   • Công viên trung tâm
   • Cải thiện sức khỏe, tăng sự dẻo dai

5. Khám Sức Khỏe Định Kỳ - 500k/tháng (VIP)
   • Thứ 7: 08:00-11:00
   • Phòng y tế tầng 1
   • Đo huyết áp, đường huyết, tư vấn dinh dưỡng

🎵 ÂM NHẠC:
6. Câu Lạc Bộ Ca Hát - 150k/tháng (Standard)
   • Thứ 4, 7: 15:00-17:00
   • Phòng karaoke tầng 3
   • Hát nhạc xưa, nhạc vàng

7. Học Đàn Organ Cơ Bản - 400k/tháng (VIP)
   • Thứ 3, 6: 14:00-15:30
   • Phòng âm nhạc tầng 4
   • Lớp nhỏ 10 người, học từ cơ bản

🏖️ DU LỊCH QUY NHƠN:
8. Tham Quan Tháp Đôi - 200k/chuyến (Standard)
   • Chủ nhật: 07:00-10:00
   • Di tích Chăm Pa, xe đưa đón

9. Du Lịch Ghềnh Ráng - 350k/chuyến (VIP)
   • Thứ 7: 06:00-11:00
   • Nơi an nghỉ Hàn Mặc Tử, có bữa sáng

10. Tham Quan Eo Gió - 400k/chuyến (VIP)
    • Chủ nhật (2 lần/tháng): 06:00-12:00
    • Cảnh đẹp nhất Quy Nhơn, có bữa trưa

💆 DỊCH VỤ KHÁC:
11. Massage Trị Liệu - 250k/buổi (VIP)
    • Thứ 2-6: 09:00-17:00 (đặt lịch)
    • Giảm đau nhức xương khớp

12. Làm Vườn Cùng Nhau - 150k/tháng (Standard)
    • Thứ 3, 5, 7: 06:00-08:00
    • Vườn rau sân thượng, trồng rau sạch

GÓI CHĂM SÓC TOÀN DIỆN:

💚 GÓI THƯỜNG - 250,000 VNĐ/NGÀY:
Lưu trú & Sinh hoạt:
• Chỗ ở: 4-8 người/phòng
• Vệ sinh & giặt giũ: Định kỳ
• Đồ dùng thiết yếu: Khăn mặt, xà phòng

Dinh dưỡng:
• 3 bữa chính + 1-2 bữa phụ
• Thực đơn phù hợp thể trạng chung

Chăm sóc Sức khỏe:
• Theo dõi cơ bản hàng ngày
• Tư vấn y tế theo bệnh lý
• Hỗ trợ thuốc theo toa

Hoạt động Tinh thần:
• Hoạt động tập thể: Hội giao, CLB văn hóa
• Không gian: Phòng giải trí, sân vườn

👑 GÓI VIP - 400,000 VNĐ/NGÀY:
Lưu trú & Tiện nghi:
• Phòng đơn hoặc đôi cao cấp
• Nội thất tiêu chuẩn 4-5 sao
• Không gian yên tĩnh & sạch sẽ tuyệt đối

Chăm sóc cá nhân:
• Tỉ lệ: 1 nhân viên cho 2-3 người
• Hỗ trợ sinh hoạt toàn diện
• Dịch vụ làm đẹp: Gội đầu, cắt móng

Dinh dưỡng đặc biệt:
• Thực đơn thiết kế riêng
• Phục vụ tại phòng

Y tế chuyên sâu:
• Bác sĩ theo dõi sát sao
• Phục hồi chức năng: Trị liệu, xoa bóp
• Kiểm tra định kỳ

💡 LỰA CHỌN:
• Gói Thường: Phù hợp người cần chăm sóc cơ bản, thích sinh hoạt tập thể
• Gói VIP: Phù hợp người cần chăm sóc đặc biệt, phòng riêng, dịch vụ cao cấp

LIÊN HỆ:
• Hotline: 1900123456
• Website: Đăng ký online, xem lịch, thanh toán dễ dàng`;

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatRequest {
    messages: ChatMessage[];
}

/**
 * Chat với AI sử dụng MegaLLM
 */
export const chat = async (req: Request, res: Response) => {
    try {
        const { messages } = req.body as ChatRequest;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: 'Messages array is required',
            });
        }

        if (!MEGALLM_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'MegaLLM API key not configured',
            });
        }

        // Gọi MegaLLM API
        const response = await axios.post(
            `${MEGALLM_BASE_URL}/chat/completions`,
            {
                model: MEGALLM_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                temperature: 0.7,
                max_tokens: 500,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${MEGALLM_API_KEY}`,
                },
            }
        );

        // Trả về response từ MegaLLM
        res.json({
            success: true,
            data: {
                message: response.data.choices[0].message,
                usage: response.data.usage,
            },
        });
    } catch (error: any) {
        console.error('AI Chat Error:', error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: 'Xin lỗi, AI đang gặp sự cố. Vui lòng thử lại sau.',
            error: error.response?.data?.error || error.message,
        });
    }
};

/**
 * Streaming chat (optional - nếu cần real-time response)
 */
export const chatStream = async (req: Request, res: Response) => {
    try {
        const { messages } = req.body as ChatRequest;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: 'Messages array is required',
            });
        }

        if (!MEGALLM_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'MegaLLM API key not configured',
            });
        }

        // Set headers for SSE (Server-Sent Events)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Gọi MegaLLM API với stream
        const response = await axios.post(
            `${MEGALLM_BASE_URL}/chat/completions`,
            {
                model: MEGALLM_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                temperature: 0.7,
                max_tokens: 500,
                stream: true,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${MEGALLM_API_KEY}`,
                },
                responseType: 'stream',
            }
        );

        // Pipe stream to client
        response.data.pipe(res);
    } catch (error: any) {
        console.error('AI Chat Stream Error:', error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: 'Xin lỗi, AI đang gặp sự cố. Vui lòng thử lại sau.',
            error: error.response?.data?.error || error.message,
        });
    }
};

