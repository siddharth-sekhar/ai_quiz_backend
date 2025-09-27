import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",  
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7
});


function getText(response) {
  if (!response) return "";
  if (typeof response.content === "string") {
    return response.content; // already plain text
  }
  if (Array.isArray(response.content) && response.content[0]?.text) {
    return response.content[0].text;
  }
  return "";
}

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
    const response = await llm.invoke(prompt);

    const text = getText(response).replace(/```json|```/g, "").trim();
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
    const response = await llm.invoke(prompt);

    const message = getText(response).replace(/```/g, "").trim();
    return { message };
  } catch (err) {
    console.error("Feedback generation error:", err);
    return { error: "Failed to generate feedback" };
  }
}

