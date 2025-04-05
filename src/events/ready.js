import { guildId, voiceChannelId, embedChannelId } from '../../config/config.js';
import { initializeBot } from '../core/initializeBot.js';
import { logStartup } from '../utils/logger.js';

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
    process.exit(2);
  }

  if (!tc) {
    logStartup(`Failed to find embed/text channel in server: ${guild.name}`);
    process.exit(3);
  }

  logStartup(`Logged in as ${client.user.tag}`);
  logStartup(`Embed/Text channel: ${tc.name} (${tc.id})`);
  logStartup(`Voice channel: ${vc.name} (${vc.id})`);

  await initializeBot(client);
};