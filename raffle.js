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
      })
    )
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

// Function to select random winner
const selectWinner = (names) => {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

// Animated selection process
const animateSelection = async (names) => {
  return new Promise((resolve) => {
    const spinner = ora({
      text: chalk.cyan("Selecting a winner"),
      spinner: "dots",
    }).start();

    let counter = 0;
    const totalAnimations = 15;
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      spinner.text = chalk.cyan(
        `Selecting a winner: ${chalk.yellow(randomName)}`
      );
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

  // Check if file path is provided
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(
      boxen(
        chalk.red("Error: Please provide a file path.\n") +
          chalk.yellow("Example: node raffle.js names.txt"),
        { padding: 1, borderColor: "red", dimBorder: true }
      )
    );
    process.exit(1);
  }

  const filePath = args[0];

  console.log(chalk.blue(`📄 Reading names from: ${chalk.bold(filePath)}`));
  const names = readNamesFromFile(filePath);

  console.log(
    chalk.green(`✅ Found ${chalk.bold(names.length)} participants\n`)
  );

  if (names.length === 0) {
    console.log(
      chalk.red("No names found in the file. Please check your file content.")
    );
    process.exit(1);
  }

  // Show a "press any key to start" prompt
  console.log(chalk.yellow("Press any key to start the raffle..."));

  await new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    });
  });

  console.log(chalk.cyan("\n🎲 The raffle is starting!\n"));

  await animateSelection(names);

  const winner = selectWinner(names);

  console.log("\n");
  console.log(
    boxen(gradient.rainbow("🎉 WINNER 🎉\n\n") + chalk.bold.green(winner), {
      padding: 2,
      margin: 1,
      borderStyle: "double",
      borderColor: "yellow",
      align: "center",
      width: 40,
    })
  );

  console.log(
    chalk.cyan(
      "\nCongratulations to the winner of the JetBrains subscription!\n"
    )
  );
};

// Run the app
main().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
