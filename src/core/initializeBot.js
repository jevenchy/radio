import {
  joinVoiceChannel,
  createAudioPlayer
} from '@discordjs/voice';
import { ActionRowBuilder, ActivityType } from 'discord.js';

import { guildId, voiceChannelId, embedChannelId } from '../../config/config.js';
import {
  buildStationSelectMenu,
  createNowPlayingEmbed
} from '../embed/radioInterface.js';
import { playStream } from './player.js';
import { logStartup, log } from '../utils/logger.js';

export const initializeBot = async ({
  client,
  stations,
  setEmbedMessage,
  getCurrentStation,
  setStartTime
}) => {
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

  logStartup(`Embed/Text channel: ${tc.name} (${tc.id})`);
  logStartup(`Voice channel: ${vc.name} (${vc.id})`);

  const player = createAudioPlayer({ behaviors: { noSubscriber: 'play' } });

  const connection = joinVoiceChannel({
    channelId: vc.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false
  });

  connection.subscribe(player);

  const play = () => {
    const stationId = getCurrentStation();
    setStartTime(Date.now());

    playStream({
      player,
      url: stations[stationId].url,
      volume: 0.5
    });

    const activity = `Radio 24/7 - ${stations[stationId].name}`;
    client.user.setActivity(activity, {
      type: ActivityType.Listening
    });

    logStartup(`Set Activity bot to Playing ${activity}`);
    log('now_playing', client, { name: stations[stationId].name });
  };

  player.on('error', err => {
    console.error('Audio error:', err.message);
    setTimeout(() => play(), 5000);
  });

  player.on('idle', () => {
    play();
  });

  play();

  const menu = buildStationSelectMenu(stations);
  const embed = createNowPlayingEmbed({
    stationId: getCurrentStation(),
    stations,
    voiceChannel: vc,
    startTime: setStartTime(),
    client
  });

  const message = await tc.send({
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(menu)]
  });

  setEmbedMessage(message);

  return { play, player };
};
