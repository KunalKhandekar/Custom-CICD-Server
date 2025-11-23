import { spawn } from "child_process";
import fs from "fs";

export const executeScript = (path, args = [], onStream = () => {}) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path))
      return reject({ success: false, error: "Script not found" });

    const child = spawn("bash", [path, ...args], {
      env: { ...process.env },
    });

    let out = "",
      err = "";

    child.stdout.on("data", (d) => {
      const text = d.toString();
      out += text;
      onStream({ type: "stdout", message: text });
    });

    child.stderr.on("data", (d) => {
      const text = d.toString();
      err += text;
      onStream({ type: "stderr", message: text });
    });

    child.on("close", (code) => {
      if (code === 0) {
        return resolve({ success: true, output: out });
      }
      return reject({ success: false, output: out, error: err, code });
    });

    child.on("error", (error) => {
      reject({ success: false, error });
    });
  });
};
