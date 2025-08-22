// Inisialisasi Sequelize dan import semua model
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Koneksi ke database Supabase/Postgres
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, // pastikan di .env pakai DB_PASSWORD
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import semua model
db.User = require("./user")(sequelize, DataTypes);
db.Genre = require("./genre")(sequelize, DataTypes);
db.Series_Film = require("./series_film")(sequelize, DataTypes);
db.Episode_Movie = require("./episode_movie")(sequelize, DataTypes);
db.Movie = require("./movie")(sequelize, DataTypes);

// Definisikan relasi antar tabel sesuai ERD
db.Series_Film.belongsTo(db.Genre, { foreignKey: "genre_id" }); // Series punya satu genre
db.Episode_Movie.belongsTo(db.Series_Film, { foreignKey: "series_id" }); // Episode/Movie punya satu series
db.Episode_Movie.belongsTo(db.Genre, { foreignKey: "genre_id" }); // Episode/Movie punya satu genre
db.Episode_Movie.belongsTo(db.User, { foreignKey: "user_id" }); // Episode/Movie bisa dikaitkan ke user

// Relasi untuk Movie
db.Movie.belongsTo(db.User, { foreignKey: "user_id" }); // Movie bisa dikaitkan ke user
db.Movie.belongsTo(db.Genre, { foreignKey: "genre_id" }); // Movie punya satu genre
db.Movie.belongsTo(db.Series_Film, { foreignKey: "series_id" }); // Movie bisa dikaitkan ke series

// Relasi sebaliknya
db.User.hasMany(db.Episode_Movie, { foreignKey: "user_id" });
db.Genre.hasMany(db.Series_Film, { foreignKey: "genre_id" });
db.Series_Film.hasMany(db.Episode_Movie, { foreignKey: "series_id" });
db.Genre.hasMany(db.Episode_Movie, { foreignKey: "genre_id" });

db.User.hasMany(db.Movie, { foreignKey: "user_id" });
db.Genre.hasMany(db.Movie, { foreignKey: "genre_id" });
db.Series_Film.hasMany(db.Movie, { foreignKey: "series_id" });

module.exports = db;
