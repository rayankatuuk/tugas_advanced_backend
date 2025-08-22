const db = require("../models");
const movies = require("./moviesData.json");

async function seed() {
  await db.sequelize.sync({ alter: true }); // <-- tambahkan alter: true
  for (const movie of movies) {
    await db.Movie.create(movie);
  }
  console.log("Seeding selesai!");
  process.exit();
}

seed();
