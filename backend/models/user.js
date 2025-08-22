// Model User sesuai ERD
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      tanggal_daftar: DataTypes.DATE,
      status: DataTypes.STRING,
      verification_token: DataTypes.STRING,
    },
    { tableName: "users", timestamps: false }
  );
};
