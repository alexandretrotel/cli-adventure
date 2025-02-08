import readline from "readline-sync";
import {
  savePlayer,
  loadPlayer,
  loadPlayerItems,
  createPlayer,
} from "./services/database";
import { generateStory } from "./services/ollama_ai";

async function main() {
  let [player] = await loadPlayer();

  if (player) {
    console.log(`Welcome back, ${player.name}!`);
  } else {
    const name = readline.question("Enter your name: ");
    await createPlayer(name);
  }

  console.log("\nStarting your adventure...\n");

  while (player.health > 0) {
    const action = readline
      .question("What do you wanna do? (explore / rest / inventory / quit) > ")
      .toLowerCase();

    if (action === "explore") {
      const story = await generateStory(`${player.name} is exploring...`);
      console.log("\n" + story + "\n");
    } else if (action === "rest") {
      player.health = Math.min(100, player.health + 10);
      console.log("You rest and regain some health.");
      console.log("Health:", player.health);
    } else if (action === "inventory") {
      const items = await loadPlayerItems(player.id);
      if (items.length === 0) {
        console.log("You have no items.");
        continue;
      }

      console.log("Inventory:");
      items.forEach((item) => {
        console.log(item.name);
      });
    } else if (action === "quit") {
      console.log("Goodbye!");
      await savePlayer(player.name, player.health);
      break;
    } else {
      console.log("Invalid action.");
    }

    try {
      await savePlayer(player.name, player.health);
    } catch (e) {
      console.error("Failed to save player:", e);
    }
  }
}

main();
