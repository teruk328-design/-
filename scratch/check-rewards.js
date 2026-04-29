const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const BOT_TOKEN = envFile.match(/DISCORD_BOT_TOKEN=(.*)/)[1].trim().replace(/"/g, '');
const CHANNEL_ID = envFile.match(/DISCORD_FORUM_CHANNEL_ID=(.*)/)[1].trim().replace(/"/g, '');
const GUILD_ID = envFile.match(/DISCORD_GUILD_ID=(.*)/)[1].trim().replace(/"/g, '');

async function test() {
  try {
    const channelRes = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    const channelData = await channelRes.json();
    console.log('Available Tags:', JSON.stringify(channelData.available_tags, null, 2));

    const threadsRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/threads/active`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    const threadsData = await threadsRes.json();
    const forumThreads = (threadsData.threads || []).filter(t => t.parent_id === CHANNEL_ID);

    for (const thread of forumThreads) {
      console.log(`\nThread: ${thread.name} (Tags: ${JSON.stringify(thread.applied_tags)})`);
      const msgRes = await fetch(`https://discord.com/api/v10/channels/${thread.id}/messages/${thread.id}`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        console.log('Content snippet:', msgData.content.substring(0, 200));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

test();
