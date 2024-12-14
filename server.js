import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utilities/db.util.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World, from NLRS Backend.");
});

app.use("/api/v1/auth", authRoutes);

await connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
