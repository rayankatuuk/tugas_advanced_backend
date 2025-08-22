// Model Genre sesuai ERD
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Genre",
    {
      genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_genre: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
    },
    { tableName: "genres", timestamps: false }
  );
};
