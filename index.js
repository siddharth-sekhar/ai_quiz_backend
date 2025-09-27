import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    /\.railway\.app$/,
    /\.up\.railway\.app$/
  ],
  credentials: true
}));

app.use(express.json());

// Health check routes
app.get("/", (req, res) => {
  res.json({ message: "AI Quiz Backend is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/quiz", quizRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
