import axios from "axios";
import "dotenv/config";

const OLLAMA_API_URL = "http://localhost:11434/api/chat";

export async function generateStory(prompt: string): Promise<string> {
  const response = await axios.post(OLLAMA_API_URL, {
    model: "llama3.1",
    messages: [{ role: "user", content: prompt }],
  });

  return response.data.message.content;
}
