const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

// Config constants
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const TOKEN_EXPIRY = "1d";
const SALT_ROUNDS = 10;
const FRONTEND_URL = "http://localhost:5173";
const API_URL = "http://localhost:3001/api";
const EMAIL_TEMPLATES = {
  verification: (fullname, verificationUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="color: #333;">Verifikasi Akun Rayfilm</h2>
      <p>Hi ${fullname},</p>
      <p>Terima kasih telah mendaftar di Rayfilm. Silakan klik tombol di bawah untuk memverifikasi akun Anda:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Verifikasi Email
        </a>
      </div>
      <p>Jika tombol di atas tidak berfungsi, silakan salin dan tempel URL berikut ke browser Anda:</p>
      <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        ${verificationUrl}
      </p>
      <p>Link ini akan kedaluwarsa dalam 24 jam.</p>
      <p>Salam,<br>Tim Rayfilm</p>
    </div>
  `,
};

// HTML response templates
const HTML_RESPONSES = {
  verificationSuccess: `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
        <h1 style="color: #2ecc71;">Email Berhasil Diverifikasi!</h1>
        <p>Akun Anda telah aktif. Sekarang Anda dapat login ke aplikasi.</p>
        <a href="${FRONTEND_URL}/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">Login Sekarang</a>
      </body>
    </html>
  `,
  verificationInvalid: `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
        <h1 style="color: #e74c3c;">Link Verifikasi Tidak Valid</h1>
        <p>Token verifikasi tidak ditemukan atau sudah digunakan.</p>
        <a href="${FRONTEND_URL}/login" style="color: #3498db;">Kembali ke halaman login</a>
      </body>
    </html>
  `,
  verificationError: `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
        <h1 style="color: #e74c3c;">Terjadi Kesalahan</h1>
        <p>Gagal memverifikasi email. Silakan coba lagi nanti.</p>
        <a href="${FRONTEND_URL}/login" style="color: #3498db;">Kembali ke halaman login</a>
      </body>
    </html>
  `,
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Useful in development environment
    },
  });
};

// Send verification email
const sendVerificationEmail = async (user, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${API_URL}/users/verifikasi-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Rayfilm" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Verifikasi Akun Rayfilm",
      html: EMAIL_TEMPLATES.verification(user.fullname, verificationUrl),
    });

    console.log("Email verifikasi berhasil dikirim ke:", user.email);
    return true;
  } catch (error) {
    console.error("Error saat mengirim email:", error);
    return false;
  }
};

// Register user baru
exports.register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // Validate input
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Semua field (nama, username, email, password) harus diisi",
      });
    }

    // Check existing username and email
    const [existingUsername, existingEmail] = await Promise.all([
      db.User.findOne({ where: { username } }),
      db.User.findOne({ where: { email } }),
    ]);

    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, error: "Username sudah digunakan." });
    }

    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, error: "Email sudah terdaftar." });
    }

    // Hash password and create verification token
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const verification_token = uuidv4();

    // Save user to database
    const user = await db.User.create({
      fullname,
      username,
      email,
      password: hash,
      tanggal_daftar: new Date(),
      status: "pending",
      verification_token,
    });

    // Send verification email
    await sendVerificationEmail(user, verification_token);

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Silakan cek email untuk verifikasi.",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username dan password harus diisi",
      });
    }

    // Find user
    const user = await db.User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Username tidak ditemukan.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "Password salah.",
      });
    }

    // Check user status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        error: "Akun belum diverifikasi.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        fullname: user.fullname,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Verifikasi email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send(HTML_RESPONSES.verificationInvalid);
    }

    const user = await db.User.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      return res.status(400).send(HTML_RESPONSES.verificationInvalid);
    }

    // Update user status
    user.status = "active";
    user.verification_token = null;
    await user.save();

    return res.send(HTML_RESPONSES.verificationSuccess);
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).send(HTML_RESPONSES.verificationError);
  }
};

// Get all users
exports.getAll = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password", "verification_token"] },
    });

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["password", "verification_token"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User tidak ditemukan.",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};
