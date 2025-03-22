import "dotenv/config";
import {
  loadChatHistory,
  loadPlayerLanguage,
  saveChatHistory,
} from "./database.js";
import ora from "ora";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";
import { settings } from "../data/settings.js";

let chatHistory: { role: string; content: string }[] = [];
const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: "http://localhost:1234/v1",
});
const model = lmstudio(settings.model);

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

    const result = streamText({
      model,
      prompt: messages?.map((m) => m.content).join("\n"),
    });

    let fullResponse = "";
    let firstChunkReceived = false;

    for await (const textPart of result.textStream) {
      if (!firstChunkReceived) {
        spinner.stop();
        firstChunkReceived = true;
      }

      fullResponse += textPart;
      process.stdout.write(textPart);
    }

    chatHistory.push({ role: "assistant", content: fullResponse });

    await saveChatHistory(playerId, "assistant", fullResponse);
  } catch (e: unknown) {
    console.error("Failed to generate story:", e);
    return "You find nothing of interest.";
  }
}
