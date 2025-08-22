import { useState, useRef } from "react";
import { useMovies } from "../context/MovieContext";
import axios from "axios";

const MovieManager = () => {
  const {
    addMovieWithIdCheck,
    updateMovie,
    deleteMovie,
    movies,
    getMovieById,
  } = useMovies();

  const [showDemo, setShowDemo] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [movieTitle, setMovieTitle] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  // State baru untuk menangani upload gambar
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const imageFiles = [
    "Trending-1.png",
    "Trending-2.png",
    "Trending-3.png",
    "Trending-4.png",
    "Trending-5.png",
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    return `/assets/image/${imageFiles[randomIndex]}`;
  };

  // Fungsi untuk mendapatkan header otorisasi (jika ada)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fungsi baru untuk menangani upload file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi tipe file
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      alert(
        "❌ Format file tidak didukung. Harap upload gambar (JPEG, PNG, GIF, WEBP)."
      );
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Ukuran file terlalu besar. Maksimum 5MB.");
      return;
    }

    // Buat form data untuk upload
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Upload file ke server - Perbaiki URL endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/upload`, // Ini benar
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        }
      );

      // Set URL gambar yang berhasil diupload
      setUploadedImage(response.data.data.path);
      alert("✅ Gambar berhasil diupload!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        `❌ Gagal mengupload file: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };
  // CREATE (dimodifikasi untuk menggunakan uploaded image)
  const handleAddMovie = async () => {
    if (!movieTitle.trim()) {
      alert("Judul film tidak boleh kosong!");
      return;
    }
    const newMovie = {
      title: movieTitle,
      image: uploadedImage || getRandomImage(), // Gunakan uploaded image jika ada
      rating: 4.5,
      year: 2024,
      genre: "Action",
      description:
        "Movie yang ditambahkan menggunakan operasi CREATE pada array object.",
      hasNewEpisode: false,
      isTop10: false,
    };

    const addedMovie = await addMovieWithIdCheck(newMovie);
    if (addedMovie) {
      alert(
        `✅ CREATE: Movie "${addedMovie.title}" berhasil ditambahkan dengan ID: ${addedMovie.movie_id}`
      );
      setMovieTitle("");
      setUploadedImage(null); // Reset uploaded image
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } else {
      alert("❌ Gagal menambah film (mungkin duplikat id/judul)");
    }
  };

  // UPDATE
  const handleUpdateMovie = async (movieId) => {
    if (!updateTitle.trim()) {
      alert("Judul film baru tidak boleh kosong!");
      return;
    }
    const updates = {
      title: updateTitle,
      rating: 5.0,
      description:
        "Movie ini telah diupdate menggunakan operasi UPDATE pada array object.",
    };

    const movie = getMovieById(String(movieId));
    if (!movie) {
      alert("❌ Movie tidak ditemukan!");
      return;
    }

    const result = await updateMovie(movieId, updates);
    if (result) {
      alert(`✅ UPDATE: Movie dengan ID ${movieId} berhasil diupdate!`);
      setUpdateTitle("");
    }
  };

  // DELETE
  const handleDeleteMovie = async (movieId) => {
    const movie = getMovieById(String(movieId));
    const id = Number(movieId);

    // Tambahkan pengecekan untuk film data awal (ID 1-14)
    if (id >= 1 && id <= 14) {
      alert("❌ Film dengan ID 1-14 adalah data awal dan tidak dapat dihapus!");
      return;
    }

    if (movie && window.confirm(`Hapus movie "${movie.title}"?`)) {
      try {
        await deleteMovie(movieId);
        alert(`✅ DELETE: Movie "${movie.title}" berhasil dihapus dari array!`);
        setSelectedMovieId(null);
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          "Terjadi kesalahan saat menghapus movie.";
        alert(`❌ Gagal menghapus movie: ${errorMsg}`);
      }
    }
  };

  // READ
  const handleReadMovie = (movieId) => {
    const movie = getMovieById(String(movieId));
    if (movie) {
      alert(
        `✅ READ: Movie ditemukan!\nID: ${movie.movie_id}\nTitle: ${movie.title}\nRating: ${movie.rating}\nGenre: ${movie.genre}`
      );
    } else {
      alert("❌ Movie tidak ditemukan!");
    }
  };

  if (!showDemo) {
    return (
      <div className="px-4 py-6 sm:px-10">
        <button
          onClick={() => setShowDemo(true)}
          className="w-full px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          🎬 Film Manager via API
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-10 bg-gray-900 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>🛠️</div>
        <h2 className="text-xl font-bold text-white">Film Manager via API</h2>
        <button
          onClick={() => setShowDemo(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      {/* Input judul film */}
      {!selectedMovieId && (
        <div className="mb-4 flex flex-col justify-center items-center">
          <label className="block text-sm font-medium mb-2 text-white">
            Judul Film
          </label>
          <input
            type="text"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            className="w-full max-w-md px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white text-center"
            placeholder="Masukkan judul film..."
          />
        </div>
      )}
      {/* Input untuk upload gambar - Fitur baru */}
      {!selectedMovieId && (
        <div className="mb-4 flex flex-col justify-center items-center">
          <label className="text-sm font-medium mb-2 text-white">
            Upload Gambar Film (opsional)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="w-full max-w-md px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-white text-center"
          />
          {uploadedImage && (
            <div className="mt-2">
              <img
                src={`${
                  import.meta.env.VITE_REACT_APP_API_ORIGIN
                }${uploadedImage}`}
                alt="Preview"
                className="h-24 object-cover rounded"
              />
            </div>
          )}
        </div>
      )}
      {/* Input judul baru untuk update */}
      {selectedMovieId && (
        <div className="mb-4 flex flex-col justify-center items-center">
          <label className="text-sm font-medium mb-2 text-white">
            Update Judul Film
          </label>
          <input
            type="text"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            className="w-full max-w-md px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-yellow-500 text-white text-center"
            placeholder="Masukkan judul baru untuk update..."
          />
        </div>
      )}
      {/* CRUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* CREATE */}
        <button
          onClick={handleAddMovie}
          disabled={!!selectedMovieId}
          className={`p-4 rounded-lg text-center transition-colors ${
            !selectedMovieId
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          <div className="text-2xl mb-2">➕</div>
          <div className="font-semibold">CREATE</div>
          <div className="text-sm text-green-200">Tambah Film</div>
        </button>

        {/* READ */}
        <button
          onClick={() => selectedMovieId && handleReadMovie(selectedMovieId)}
          disabled={!selectedMovieId}
          className={`p-4 rounded-lg text-center transition-colors ${
            selectedMovieId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          <div className="text-2xl mb-2">📖</div>
          <div className="font-semibold">READ</div>
          <div className="text-sm text-blue-200">Baca Film</div>
        </button>

        {/* UPDATE */}
        <button
          onClick={() => selectedMovieId && handleUpdateMovie(selectedMovieId)}
          disabled={!selectedMovieId}
          className={`p-4 rounded-lg text-center transition-colors ${
            selectedMovieId
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          <div className="text-2xl mb-2">✏️</div>
          <div className="font-semibold">UPDATE</div>
          <div className="text-sm text-yellow-200">Edit Film</div>
        </button>

        {/* DELETE */}
        <button
          onClick={() => selectedMovieId && handleDeleteMovie(selectedMovieId)}
          disabled={!selectedMovieId}
          className={`p-4 rounded-lg text-center transition-colors ${
            selectedMovieId
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          <div className="text-2xl mb-2">🗑️</div>
          <div className="font-semibold">DELETE</div>
          <div className="text-sm text-red-200">Hapus Film</div>
        </button>
      </div>
      {/* Pemilihan Film */}
      <div className="mb-4 flex flex-col items-center">
        <label className="block text-sm font-medium mb-2 text-center">
          Pilih Film untuk operasi READ, UPDATE, DELETE:
        </label>
        <select
          value={selectedMovieId || ""}
          onChange={(e) => setSelectedMovieId(e.target.value || null)}
          className="w-full max-w-md px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-center"
        >
          <option value="">-- Pilih Movie --</option>
          {movies.map((movie, index) => (
            <option key={movie.movie_id ?? index} value={movie.movie_id}>
              {movie.title} (ID: {movie.movie_id})
              {movie.movie_id >= 1 && movie.movie_id <= 14 ? " 🔒" : ""}
            </option>
          ))}
        </select>
        {selectedMovieId &&
          Number(selectedMovieId) >= 1 &&
          Number(selectedMovieId) <= 14 && (
            <div className="mt-2 text-xs text-amber-400">
              ⚠️ Film ini adalah data awal (ID 1-14). Hanya dapat dibaca dan
              diupdate, tidak dapat dihapus.
            </div>
          )}
      </div>
      {/* Data Film */}
      <div className="bg-gray-800 p-4 rounded-lg flex justify-center items-center flex-col">
        <h3 className="font-semibold mb-2">📊 Data Film:</h3>
        <div className="text-sm text-gray-300">
          Total Film :{" "}
          <span className="text-white font-semibold">{movies.length}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2 max-h-40 overflow-y-auto w-full flex flex-col text-center">
          {movies.map((movie, index) => (
            <div key={movie.movie_id ?? index} className="mb-1">
              [{index}] ID: {movie.movie_id} - {movie.title} - ⭐{movie.rating}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieManager;
