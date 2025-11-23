import chalk from "chalk";
import { executeScript } from "./executeScript.js";
import { logStream } from "../utils/logStream.js";

export const deploy = async (service, script) => {
  console.log(
    chalk.yellow.bold(
      `\n${
        service.charAt(0).toUpperCase() + service.slice(1)
      } changed → Deploying ${service}...`
    )
  );

  try {
    const { success } = await executeScript(script, [], logStream(service));

    if (success) {
      console.log(chalk.green.bold("✓ Deployment completed!\n"));
    }
  } catch (err) {
    console.error(chalk.red.bold("✗ Deployment failed!\n"));
  }
};
