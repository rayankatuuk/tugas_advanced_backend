// Model Series_Film sesuai ERD
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Series_Film",
    {
      series_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      judul: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
      jumlah_episode: DataTypes.INTEGER,
      tanggal_rilis: DataTypes.DATE,
      rating: DataTypes.DECIMAL,
      genre_id: DataTypes.INTEGER,
    },
    { tableName: "series_films", timestamps: false }
  );
};
