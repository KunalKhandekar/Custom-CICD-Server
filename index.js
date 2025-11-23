import express from "express";
import { verifySignature } from "./middlewares/verifySignature.js";
import { deploy } from "./utils/deploy.js";
import chalk from "chalk";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post("/webhook/tigger-deployment", verifySignature, async (req, res) => {
  res.status(200).send("OK");
  const commits = req.body.commits;

  let clientChanged = false;
  let serverChanged = false;

  for (const commit of commits) {
    const files = [...commit.added, ...commit.modified, ...commit.removed];

    for (const file of files) {
      if (file.startsWith("Client/")) clientChanged = true;
      if (file.startsWith("Server/")) serverChanged = true;
      if (clientChanged && serverChanged) break;
    }
    if (clientChanged && serverChanged) break;
  }

  if (!clientChanged && !serverChanged) {
    console.log(chalk.gray("No deployable changes detected."));
    return;
  }

  if (clientChanged) {
    await deploy("client", "deploy-client.sh");
  }

  if (serverChanged) {
    await deploy("server", "deploy-server.sh");
  }
});

app.listen(PORT, () => console.log(`CI/CD Server is running on PORT ${PORT}`));
