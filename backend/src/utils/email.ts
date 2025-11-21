import nodemailer from 'nodemailer';

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  console.log('Email Config:', {
    user: user || 'MISSING',
    pass: pass ? '***configured***' : 'MISSING',
  });

  if (!user || !pass) {
    throw new Error('Email credentials not configured in .env file');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
};

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: 'register' | 'reset-password'
): Promise<boolean> => {
  const transporter = createTransporter();
  const subject =
    type === 'register'
      ? 'Xác thực tài khoản - Sống Vui Khỏe'
      : 'Đặt lại mật khẩu - Sống Vui Khỏe';

  const message =
    type === 'register'
      ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10B981;">Chào mừng đến với Sống Vui Khỏe!</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP bên dưới để xác thực tài khoản:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #10B981; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
      </div>
      <p style="color: #666;">Mã OTP này có hiệu lực trong <strong>10 phút</strong>.</p>
      <p style="color: #666;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">Email này được gửi từ Sống Vui Khỏe</p>
    </div>
  `
      : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10B981;">Đặt lại mật khẩu</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP bên dưới:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #10B981; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
      </div>
      <p style="color: #666;">Mã OTP này có hiệu lực trong <strong>10 phút</strong>.</p>
      <p style="color: #666;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">Email này được gửi từ Sống Vui Khỏe</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
