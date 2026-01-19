const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const SetsRoutes = require("./routes/SetsRoutes");
const CardsRoutes = require("./routes/CardsRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/flashcard", userRoutes);
app.use("/flashcard", todoRoutes);
app.use("/flashcard", SetsRoutes);
app.use("/flashcard", CardsRoutes);
app.use("/flashcard", quizRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
