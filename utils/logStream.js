import chalk from "chalk";

export const logStream = (service) => (chunk) => {
  const prefix = chalk.blueBright(`[${service}]`);

  if (chunk.type === "stderr") {
    process.stderr.write(prefix + " " + chalk.red(chunk.message));
  } else {
    process.stdout.write(prefix + " " + chalk.white(chunk.message));
  }
};
