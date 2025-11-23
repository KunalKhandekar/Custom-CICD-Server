import { spawn } from "child_process"

export const executeScript = (path) => {
  const process = spawn("bash", [path]);

  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  process.stderr.on("data", (data) => {
    console.error("ERR:", data.toString());
  });

  process.on("close", (code) => {
    if (code) {
      console.log("ERR");
    }
    console.log(`Exited with code ${code}`);
  });
};
