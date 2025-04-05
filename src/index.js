import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { token } from '../config/config.js';
import { logStartup } from './utils/logger.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.events = new Collection();

const eventsPath = path.resolve('./src/events');
const eventFiles = (await fs.readdir(eventsPath)).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const { default: event } = await import(`./events/${file}`);
  const name = file.split('.')[0];
  client.on(name, (...args) => event(client, ...args));
}

try {
  await client.login(token);
} catch {
  logStartup('Discord token is invalid or missing.');
  process.exit(1);
}
