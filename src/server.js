import express from "express";
import dotenv from "dotenv";
import userRoutes from "../src/routes/userRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
