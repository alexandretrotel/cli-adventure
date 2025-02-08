import axios from "axios";
import "dotenv/config";

const OLLAMA_API_URL = "http://localhost:11434/api/chat";

export async function generateStory(prompt: string): Promise<string> {
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: "llama3.1",
      messages: [{ role: "user", content: prompt }],
    });

    return response.data.message.content;
  } catch (e: any) {
    console.error("Failed to generate story:", e?.message);
    return "You find nothing of interest.";
  }
}
