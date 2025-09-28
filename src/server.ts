import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/dbConnect";
import router from "./routes/authRoutes";

dotenv.config();
const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());

// Connect to the database
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", router);

app.listen(port, () => {
  console.log(`Auth-service listening on port ${port}`);
});
