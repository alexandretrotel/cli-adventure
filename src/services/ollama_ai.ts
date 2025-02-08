import axios from "axios";
import "dotenv/config";
import { OLLAMA_API_URL } from "../data/api";
import {
  loadChatHistory,
  loadPlayerLanguage,
  saveChatHistory,
} from "./database";
import ora from "ora";

let chatHistory: { role: string; content: string }[] = [];

export async function generateStory(playerId: string) {
  try {
    const spinner = ora().start();
    spinner.text = "Exploring...";

    const playerLanguage = await loadPlayerLanguage(playerId);
    chatHistory = await loadChatHistory(playerId);

    const systemPrompt = {
      role: "system",
      content: `You are a storyteller in an interactive adventure game, guiding the player through the story. The player's language is ${playerLanguage} so you should respond in that language.`,
    };

    const messages = [systemPrompt, ...chatHistory];

    const response = await axios.post(
      OLLAMA_API_URL,
      {
        model: "llama3.1",
        messages: messages,
        stream: true,
      },
      { responseType: "stream" }
    );

    let fullResponse = "";
    let firstChunkReceived = false;

    response.data.on("data", (chunk: Buffer) => {
      try {
        if (!firstChunkReceived) {
          spinner.stop();
          firstChunkReceived = true;
        }

        const jsonData = JSON.parse(chunk.toString());
        if (jsonData?.message?.content) {
          const newContent = jsonData.message.content;
          fullResponse += newContent;

          process.stdout.write(newContent);
        }
      } catch (error) {
        console.error("Error processing chunk:", error);
      }
    });

    await new Promise<void>((resolve, reject) => {
      response.data.on("end", () => resolve());
      response.data.on("error", (err: Error) => reject(err));
    });

    chatHistory.push({ role: "assistant", content: fullResponse });

    await saveChatHistory(playerId, "assistant", fullResponse);
  } catch (e: any) {
    console.error("Failed to generate story:", e?.message);
    return "You find nothing of interest.";
  }
}
