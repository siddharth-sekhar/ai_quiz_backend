import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Generate Quiz
export async function generateQuiz(topic) {
  const prompt = `
You are a quiz generator. Create 5 multiple-choice questions on the topic "${topic}".
Each question should have exactly 4 options.
Return ONLY JSON in this format:

{
  "questions": [
    {
      "question": "string",
      "options": ["opt1", "opt2", "opt3", "opt4"],
      "correctAnswerIndex": 0
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("Quiz generation error:", err);
    return { error: "Failed to generate quiz" };
  }
}

// Generate Feedback
export async function generateFeedback(score, total, topic) {
  const accuracy = ((score / total) * 100).toFixed(1);

  const prompt = `
You are a quiz coach. The user took a quiz on "${topic}".
They scored ${score}/${total} (${accuracy}%).
Give a short motivational feedback message in plain text (not JSON).
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const message = response.text().replace(/```/g, "").trim();
    return { message };
  } catch (err) {
    console.error("Feedback generation error:", err);
    return { error: "Failed to generate feedback" };
  }
}

