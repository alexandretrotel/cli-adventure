import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import {
  savePlayer,
  loadPlayer,
  loadPlayerItems,
  createPlayer,
  lastPlayer,
  loadPlayerLanguage,
  savePlayerLanguage,
} from "./services/database";
import { generateStory } from "./services/ollama_ai";

async function main() {
  const player = await lastPlayer();

  // start game and greet the player
  if (player) {
    console.log(chalk.green(`\nWelcome back, ${player.name}!`));
  } else {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter your name:",
      },
    ]);
    await createPlayer(name);
  }

  const playerLanguage = await loadPlayerLanguage(player.id);

  if (!playerLanguage) {
    console.log(chalk.yellow("Select the language for AI responses:"));
    const { language } = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: "Select the language for AI responses:",
        choices: ["English", "French", "Spanish", "German"],
      },
    ]);
    await savePlayerLanguage(player.id, language);
  }

  const { health } = await loadPlayer(player.id);

  console.log(chalk.blue("\nStarting your adventure...\n"));

  while (health > 0) {
    // prompt for the next action
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do next?",
        choices: ["Explore", "Rest", "Inventory", "Quit"],
      },
    ]);

    switch (action.toLowerCase()) {
      case "explore":
        await generateStory(player.id);
        console.log(chalk.green("\nAdventure continues...\n"));
        break;

      case "rest":
        if (health === 100) {
          console.log(chalk.yellow("You are already at full health."));
        } else {
          const newHealth = Math.min(100, health + 10);
          console.log(
            chalk.cyan(
              `You rest and regain some health. Current health: ${newHealth}`
            )
          );
        }
        break;

      case "inventory":
        const items = await loadPlayerItems(player.id);
        if (items.length === 0) {
          console.log(chalk.red("Your inventory is empty."));
        } else {
          console.log(chalk.magenta("\nInventory:"));
          items.forEach((item, index) => {
            console.log(
              chalk.yellow(`${index + 1}. ${item.name} - ${item.description}`)
            );
          });
        }
        break;

      case "quit":
        console.log(
          chalk.bgRed("\nGoodbye, brave adventurer! Your journey ends here.")
        );
        await savePlayer(player.name, player.health);
        console.log(chalk.green("Your progress has been saved.\n"));
        return;

      default:
        console.log(chalk.red("Invalid action. Please choose a valid option."));
    }

    // save player progress after each action
    try {
      await savePlayer(player.name, player.health);
    } catch (e) {
      console.error(chalk.red("Failed to save player progress:", e));
    }

    // show current health after each action
    console.log(chalk.blue(`Current Health: ${health}`));
  }

  console.log(chalk.red("\nYour health reached 0! Game Over."));
}

main();
