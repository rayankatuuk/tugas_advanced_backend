import { useState } from "react";
import { AuthCard, AuthForm } from "../components";
import { login } from "../services/auth.service";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Panggil fungsi login dari auth.service.js
      const user = await login(formData.username, formData.password);
      // Jika berhasil, token sudah disimpan di localStorage oleh auth.service.js
      alert("Login berhasil! Anda akan dialihkan.");
      window.location.href = "/";
    } catch (err) {
      alert("Login gagal! Username atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginFields = [
    {
      name: "username",
      type: "text",
      label: "Username",
      placeholder: "user1",
      required: true,
    },
    {
      name: "password",
      type: "password",
      label: "Kata Sandi",
      placeholder: "pass123",
      required: true,
    },
  ];

  return (
    <AuthCard title="Masuk" subtitle="Selamat datang kembali!">
      <AuthForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Masuk"
        alternateLinkText="Belum punya akun?"
        alternateLinkPath="/register"
        alternateLinkLabel="Daftar"
        showForgotPassword={true}
        showGoogleAuth={true}
        googleAuthText="Masuk dengan Google"
        fields={loginFields}
      />
    </AuthCard>
  );
};

export default LoginPage;
