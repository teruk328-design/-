const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const BOT_TOKEN = envFile.match(/DISCORD_BOT_TOKEN=(.*)/)[1].trim().replace(/"/g, '');

async function test() {
  const msgId = '1498844058666270842';
  const threadId = '1497872975733588088';
  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${threadId}/messages/${msgId}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    const msg = await res.json();
    console.log('Message Content:', JSON.stringify(msg.content));
    console.log('Full Message:', JSON.stringify(msg, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
