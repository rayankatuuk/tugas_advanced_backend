// Model Episode_Movie sesuai ERD dan kebutuhan frontend
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Episode_Movie",
    {
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING, // Judul film
      image: DataTypes.STRING, // Path gambar/poster
      rating: DataTypes.FLOAT, // Rating film
      year: DataTypes.INTEGER, // Tahun rilis
      genre: DataTypes.STRING, // Genre film (atau genre_id jika relasi)
      description: DataTypes.TEXT, // Deskripsi film
      progress: DataTypes.INTEGER, // Progress menonton (persen)
      isInWatchlist: DataTypes.BOOLEAN, // Status watchlist
      userRating: DataTypes.FLOAT, // Rating dari user
      // Foreign key opsional jika ingin relasi ke user
      user_id: DataTypes.INTEGER,
      // Foreign key opsional jika ingin relasi ke genre
      genre_id: DataTypes.INTEGER,
      // Foreign key opsional jika ingin relasi ke series
      series_id: DataTypes.INTEGER,
    },
    { tableName: "episode_movies", timestamps: false }
  );
};
