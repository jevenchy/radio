import { guildId, voiceChannelId, embedChannelId } from '../../config/config.js';
import { logStartup } from '../utils/logger.js';
import { initializeBot } from '../core/initializeBot.js';
import { stations } from '../data/stations.js';
import { handleSelectMenu } from '../embed/radioInterface.js';

let currentStation = '1';
let startTime = null;
let embedMessage;

export default async (client) => {
  const guild = guildId
    ? client.guilds.cache.get(guildId)
    : client.guilds.cache.find(g => g.members.me);

  if (!guild) {
    logStartup('Guild not found or bot is not in any server.');
    process.exit(1);
  }

  const vc = guild.channels.cache.get(voiceChannelId);
  const tc = guild.channels.cache.get(embedChannelId);

  if (!vc) {
    logStartup(`Failed to find voice channel in server: ${guild.name}`);
    process.exit(1);
  }

  if (!tc) {
    logStartup(`Failed to find embed/text channel in server: ${guild.name}`);
    process.exit(1);
  }

  logStartup(`Logged in as ${client.user.tag}`);
  logStartup(`Embed/Text channel: ${tc.name} (${tc.id})`);
  logStartup(`Voice channel: ${vc.name} (${vc.id})`);

  const init = await initializeBot({
    client,
    stations,
    setEmbedMessage: msg => embedMessage = msg,
    getCurrentStation: () => currentStation,
    setStartTime: val => (startTime = val),
    voiceChannel: vc,
    textChannel: tc
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
};
