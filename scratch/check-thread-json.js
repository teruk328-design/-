const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const BOT_TOKEN = envFile.match(/DISCORD_BOT_TOKEN=(.*)/)[1].trim().replace(/"/g, '');
const CHANNEL_ID = envFile.match(/DISCORD_FORUM_CHANNEL_ID=(.*)/)[1].trim().replace(/"/g, '');
const GUILD_ID = envFile.match(/DISCORD_GUILD_ID=(.*)/)[1].trim().replace(/"/g, '');

async function test() {
  try {
    const threadsRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/threads/active`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    const threadsData = await threadsRes.json();
    const forumThreads = (threadsData.threads || []).filter(t => t.parent_id === CHANNEL_ID);

    console.log('Thread Object Sample:', JSON.stringify(forumThreads[0], null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
