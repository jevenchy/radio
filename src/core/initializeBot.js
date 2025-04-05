import {
  joinVoiceChannel,
  createAudioPlayer
} from '@discordjs/voice';
import { ActionRowBuilder, ActivityType } from 'discord.js';

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
  setStartTime,
  voiceChannel,
  textChannel
}) => {
  const player = createAudioPlayer({ behaviors: { noSubscriber: 'play' } });

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
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
    client.user.setActivity(activity, { type: ActivityType.Listening });

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
    voiceChannel,
    startTime: setStartTime(),
    client
  });

  const message = await textChannel.send({
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(menu)]
  });

  setEmbedMessage(message);

  return { play, player };
};
