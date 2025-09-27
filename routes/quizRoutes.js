import express from "express";
import { generateQuiz, generateFeedback } from "../services/aiService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;
    console.log("Generating quiz for topic:", topic);
    const quiz = await generateQuiz(topic);
    console.log("Quiz generated successfully:", quiz);
    res.json(quiz);
  } catch (err) {
    console.error("Route error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});


router.post("/feedback", async (req, res) => {
  try {
    const { score, total, topic } = req.body;
    const feedback = await generateFeedback(score, total, topic);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

export default router;
