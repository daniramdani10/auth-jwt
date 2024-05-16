const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/Database.js");
const router = require("./routes/index.js");

dotenv.config();
const app = express();

try {
  db.authenticate();
  console.log("Database connected...");
} catch (error) {
  console.error("Unable to connect to the database: ", error);
}

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(3000, () => console.log("Server is running on port 3000"));
