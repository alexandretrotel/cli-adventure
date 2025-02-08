import readline from "readline-sync";
import { savePlayer, loadPlayer } from "./database";
import { generateStory } from "./ollama_ai";

async function main() {
  let player = loadPlayer();

  if (player) {
    console.log(`Welcome back, ${player.name}!`);
  } else {
    const name = readline.question("Enter your name: ");
    player = { name, health: 100, inventory: [] };
    savePlayer(name, player.health, player.inventory);
  }

  console.log("\nStarting your adventure...\n");

  while (player.health > 0) {
    const action = readline
      .question("What do you do? (explore / rest / inventory) > ")
      .toLowerCase();

    if (action === "explore") {
      const story = await generateStory(
        `${player.name} explores an ancient ruin. What happens next?`
      );
      console.log("\n" + story + "\n");
    } else if (action === "rest") {
      player.health = Math.min(100, player.health + 10);
      console.log("You rest and regain some health.");
    } else if (action === "inventory") {
      console.log(
        "Inventory:",
        player.inventory.length ? player.inventory.join(", ") : "Empty"
      );
    } else {
      console.log("Invalid action.");
    }

    savePlayer(player.name, player.health, player.inventory);
  }
}

main();
