import fs from "node:fs";
import chalk from "chalk";
import boxen from "boxen";
import figlet from "figlet";
import ora from "ora";
import gradient from "gradient-string";

// ASCII Art Title
const displayTitle = () => {
  console.log("\n");
  console.log(
    gradient.pastel(
      figlet.textSync("ForwardJS Raffle", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    ),
  );
  console.log("\n");
};

// Function to read file and get names
const readNamesFromFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  } catch (error) {
    console.error(chalk.red(`Error reading file: ${error.message}`));
    process.exit(1);
  }
};

// Function to select random winners
const selectWinners = (names, numWinners) => {
  const winners = [];
  const namesCopy = [...names]; // Create a copy to avoid modifying the original array

  // Ensure we don't try to select more winners than available names
  const winnersToSelect = Math.min(numWinners, namesCopy.length);

  for (let i = 0; i < winnersToSelect; i++) {
    const randomIndex = Math.floor(Math.random() * namesCopy.length);
    winners.push(namesCopy[randomIndex]);
    // Remove selected name to avoid duplicates
    namesCopy.splice(randomIndex, 1);
  }

  return winners;
};

// Animated selection process
const animateSelection = async (names, numWinners) => {
  return new Promise((resolve) => {
    const text =
      numWinners === 1
        ? "Selecting a winner"
        : `Selecting ${numWinners} winners`;
    const spinner = ora({
      text: chalk.cyan(text),
      spinner: "dots",
    }).start();

    let counter = 0;
    const totalAnimations = 15;
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      spinner.text = chalk.cyan(`${text}: ${chalk.yellow(randomName)}`);
      counter++;

      if (counter >= totalAnimations) {
        clearInterval(interval);
        spinner.stop();
        resolve();
      }
    }, 200);
  });
};

// Main function
const main = async () => {
  displayTitle();

  // Parse command line arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(
      boxen(
        chalk.red("Error: Please provide a file path.\n") +
          chalk.yellow("Example: node raffle.js names.txt [number-of-winners]"),
        { padding: 1, borderColor: "red", dimBorder: true },
      ),
    );
    process.exit(1);
  }

  const filePath = args[0];
  // Default to 1 winner if not specified
  const numWinners = args[1] ? parseInt(args[1], 10) : 1;

  // Validate number of winners
  if (isNaN(numWinners) || numWinners < 1) {
    console.log(
      boxen(chalk.red("Error: Number of winners must be a positive number."), {
        padding: 1,
        borderColor: "red",
        dimBorder: true,
      }),
    );
    process.exit(1);
  }

  console.log(chalk.blue(`📄 Reading names from: ${chalk.bold(filePath)}`));
  const names = readNamesFromFile(filePath);

  console.log(
    chalk.green(`✅ Found ${chalk.bold(names.length)} participants\n`),
  );

  if (names.length === 0) {
    console.log(
      chalk.red("No names found in the file. Please check your file content."),
    );
    process.exit(1);
  }

  // Show a "press any key to start" prompt
  console.log(chalk.yellow("Press any key to start the raffle..."));

  await new Promise((resolve) => {
    try {
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once("data", () => {
          process.stdin.setRawMode(false);
          resolve();
        });
      } else {
        // Non-interactive terminal, resolve immediately
        console.log(
          chalk.yellow(
            "Non-interactive terminal detected. Starting automatically...",
          ),
        );
        resolve();
      }
    } catch (error) {
      console.log(
        chalk.yellow(
          "Cannot read from standard input. Starting automatically...",
        ),
      );
      resolve();
    }
  });

  console.log(chalk.cyan("\n🎲 The raffle is starting!\n"));

  await animateSelection(names, numWinners);

  const winners = selectWinners(names, numWinners);

  console.log("\n");

  const winnerTitle =
    numWinners === 1
      ? "🎉 WINNER 🎉\n\n"
      : `🎉 WINNERS (${winners.length}) 🎉\n\n`;
  console.log(
    boxen(
      gradient.rainbow(winnerTitle) + chalk.bold.green(winners.join("\n")),
      {
        padding: 2,
        margin: 1,
        borderStyle: "double",
        borderColor: "yellow",
        align: "center",
        width: Math.max(40, winners.join("\n").length + 10),
      },
    ),
  );

  const congratsMessage =
    numWinners === 1
      ? "\nCongratulations to the winner of the JetBrains subscription!\n"
      : `\nCongratulations to the ${winners.length} winners of the JetBrains subscriptions!\n`;
  console.log(chalk.cyan(congratsMessage));
};

// Run the app
main().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
