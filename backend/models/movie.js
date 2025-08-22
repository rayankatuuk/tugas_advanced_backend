module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Movie",
    {
      movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      rating: DataTypes.FLOAT,
      year: DataTypes.INTEGER,
      genre: DataTypes.STRING, // atau genre_id jika relasi
      description: DataTypes.TEXT,
      progress: DataTypes.INTEGER,
      isInWatchlist: DataTypes.BOOLEAN,
      userRating: DataTypes.FLOAT,
      // Foreign key opsional jika ingin relasi ke user
      user_id: DataTypes.INTEGER,
      // Foreign key opsional jika ingin relasi ke genre
      genre_id: DataTypes.INTEGER,
      // Foreign key opsional jika ingin relasi ke series
      series_id: DataTypes.INTEGER,
    },
    { tableName: "movies", timestamps: false }
  );
};
