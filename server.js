import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import auth from "./routes/Route.js";
import login from "./routes/Route.js";
import update from "./routes/Route.js";

dotenv.config();

await connectDB();

const PORT = process.env.PORT || 5000;

const app = new express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/api/", auth);
app.use("/api/", login);
app.use("/api/", update);

// calling routes

app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}!!!`)
);
