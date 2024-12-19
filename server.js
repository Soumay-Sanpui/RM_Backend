import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utilities/db.util.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import dishRoutes from "./routes/dish.routes.js";
// import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World, from NLRS Backend.");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dish", dishRoutes);
// app.use("/api/v1/user", userRoutes);
app.use("/api/v1/cart", cartRoutes);

await connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
