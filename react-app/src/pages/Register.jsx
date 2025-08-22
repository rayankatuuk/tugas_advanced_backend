import { useState } from "react";
import { AuthCard, AuthForm } from "../components";
import axios from "axios";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/users/register`,
        {
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      setIsLoading(false);
      alert("Registrasi berhasil! Silahkan login.");
      window.location.href = "/login";
    } catch (err) {
      setIsLoading(false);
      alert("Registrasi gagal! Username mungkin sudah digunakan.");
    }
  };

  // Konfigurasi field untuk form register
  const registerFields = [
    {
      name: "fullname",
      type: "text",
      label: "Fullname",
      placeholder: "Masukkan nama lengkap",
      required: true,
    },
    {
      name: "username",
      type: "text",
      label: "Username",
      placeholder: "Pilih username",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Masukkan email",
      required: true,
    },
    {
      name: "password",
      type: "password",
      label: "Kata Sandi",
      placeholder: "Masukkan kata sandi",
      required: true,
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Konfirmasi Kata Sandi",
      placeholder: "Konfirmasi kata sandi",
      required: true,
    },
  ];

  return (
    <AuthCard title="Daftar" subtitle="Selamat datang!!">
      <AuthForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Daftar"
        alternateLinkText="Sudah punya akun?"
        alternateLinkPath="/login"
        alternateLinkLabel="Masuk"
        showForgotPassword={false}
        showGoogleAuth={true}
        googleAuthText="Daftar dengan Google"
        fields={registerFields}
      />
    </AuthCard>
  );
};

export default Register;
