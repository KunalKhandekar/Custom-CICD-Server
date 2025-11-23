import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const notifyOnError = async ({
  service,
  error,
  code,
  commitMessage,
  commitAuthor,
}) => {
  const text = `
\`\`\`
DEPLOYMENT FAILED
==============================

Service        : ${service}
Status         : Failed
Exit Code      : ${code}

Triggered By   : ${commitAuthor}

Commit Message :
------------------------------
${commitMessage}
------------------------------

Error:
------------------------------
${error}
------------------------------

Timestamp      : ${new Date().toLocaleString()}
\`\`\`
`;

  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text,
    parse_mode: "Markdown",
  });
};

export const notifyOnSuccess = async ({
  service,
  commitMessage,
  commitAuthor,
}) => {
  const text = `
\`\`\`
DEPLOYMENT SUCCESSFUL
==============================

Service        : ${service}
Status         : Success

Triggered By   : ${commitAuthor}

Commit Message :
------------------------------
${commitMessage}
------------------------------

Timestamp      : ${new Date().toLocaleString()}
\`\`\`
`;

  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text,
    parse_mode: "Markdown",
  });
};
