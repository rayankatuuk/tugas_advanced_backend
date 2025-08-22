// Load environment variables dari .env
require("dotenv").config();

// Import app Express dari file app.js
const app = require("./app");

// Import semua model dan koneksi Sequelize dari folder models
const db = require("./models");

const PORT = process.env.PORT || 3001;

// Sinkronisasi database dan jalankan server
db.sequelize
  .sync({ force: false }) // force: false agar tidak drop table setiap restart
  .then(() => {
    console.log("Database connected and synchronized.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
