require("dotenv").config();
const nodemailer = require("nodemailer");

const testEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    debug: true,
  });

  // Tampilkan config yang digunakan
  console.log("Using Gmail config:", {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD ? "****" : undefined,
  });

  // Cek koneksi ke SMTP server
  try {
    const verify = await transporter.verify();
    console.log("SMTP Connection verified:", verify);
  } catch (error) {
    console.error("SMTP Connection failed:", error);
    return;
  }

  // Kirim email test
  try {
    const info = await transporter.sendMail({
      from: `"Rayfilm" <${process.env.EMAIL_FROM}>`,
      to: "test@example.com",
      subject: "Test Email from Rayfilm",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email Berhasil</h2>
          <p>Ini adalah email test untuk memastikan konfigurasi Gmail SMTP berfungsi dengan baik.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    console.log("Message sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

testEmail();
