import readline from "readline-sync";
import { savePlayer, loadPlayer, loadPlayerItems } from "./services/database";
import { generateStory } from "./services/ollama_ai";

async function main() {
  let [player] = await loadPlayer();

  if (player) {
    console.log(`Welcome back, ${player.name}!`);
  } else {
    const name = readline.question("Enter your name: ");
    player = { id: "", name, health: 100 };
    await savePlayer(name, player.health);
  }

  console.log("\nStarting your adventure...\n");

  while (player.health > 0) {
    const action = readline
      .question("What do you wanna do? (explore / rest / inventory) > ")
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
      console.log("Inventory:");
      items.forEach((item) => {
        console.log(item.name);
      });
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
