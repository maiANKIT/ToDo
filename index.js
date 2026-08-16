const express = require("express");
const app = express();
const helmet = require("helmet"); // <-- 1. Helmet import kiya

require("dotenv").config();

const PORT = process.env.PORT || 4000;

//Helmet
app.use(helmet());

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://to-4p5u1omkm-maiankits-projects.vercel.app",
      "https://to-do-eight-plum.vercel.app",
    ],
    credentials: true,
  })
);

const todoRoutes = require("./routes/todos");
const userRoutes = require("./routes/user");
const workspaceRoutes = require("./routes/workspace");

app.use("/api/v1/todo", todoRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/workspace", workspaceRoutes);

const { connect } = require("./config/database");
connect();

app.get("/", (req, res) => {
  res.send("backend working");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});