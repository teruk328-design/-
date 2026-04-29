const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const BOT_TOKEN = envFile.match(/DISCORD_BOT_TOKEN=(.*)/)[1].trim().replace(/"/g, '');
const GUILD_ID = envFile.match(/DISCORD_GUILD_ID=(.*)/)[1].trim().replace(/"/g, '');

async function test() {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    const channels = await res.json();
    console.log('Channels in Guild:');
    channels.forEach(c => {
      console.log(`- ${c.name} (${c.id}) [Type: ${c.type}]`);
    });
  } catch (err) {
    console.error(err);
  }
}

test();
