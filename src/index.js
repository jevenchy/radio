import { Client, GatewayIntentBits } from 'discord.js';
import { token } from '../config/config.js';
import { stations } from './data/stations.js';
import { handleSelectMenu } from './embed/radioInterface.js';
import { initializeBot } from './core/initializeBot.js';
import { logStartup } from './utils/logger.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let currentStation = '1';
let startTime = null;
let embedMessage;

client.once('ready', async () => {
  logStartup(`Logged in as ${client.user.tag}`);

  const init = await initializeBot({
    client,
    stations,
    setEmbedMessage: msg => embedMessage = msg,
    getCurrentStation: () => currentStation,
    setStartTime: val => (startTime = val)
  });

  if (!init) process.exit(1);

  const { play } = init;

  client.on('interactionCreate', async interaction => {
    await handleSelectMenu({
      interaction,
      stations,
      currentStation,
      play,
      client,
      embedMessage,
      setStation: val => currentStation = val,
      startTime
    });
  });
});

try {
  await client.login(token);
} catch {
  logStartup('Discord token is invalid or missing.');
  process.exit(1);
}
