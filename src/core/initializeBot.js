import { joinVoiceChannel, createAudioPlayer, entersState, VoiceConnectionStatus, AudioPlayerStatus } from '@discordjs/voice';
import { ActionRowBuilder, ActivityType, MessageFlags } from 'discord.js';

import { guildId, voiceChannelId, embedChannelId } from '../../config/config.js';
import { buildRadioEmbed, buildStationSelectMenu } from '../embed/radioInterface.js';
import { playStream } from './player.js';
import { log } from '../utils/logger.js';
import { stations } from './stations.js';

let lastPlayedStation = null;
let startTime = null;
let currentStation = '1';
let embedMessage = null;
let lastListeners = null;
let isReconnecting = false;

export const initializeBot = async client => {
  lastPlayedStation = null;

  const guild = client.guilds.cache.get(guildId);
  const vc = guild?.channels.cache.get(voiceChannelId);
  const tc = guild?.channels.cache.get(embedChannelId);

  const player = createAudioPlayer({ behaviors: { noSubscriber: 'play' } });

  const connection = joinVoiceChannel({
    channelId: vc.id,
    guildId: vc.guild.id,
    adapterCreator: vc.guild.voiceAdapterCreator,
    selfDeaf: false
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 3000);
  connection.subscribe(player);

  const play = async () => {
    const stationId = currentStation;
    if (stationId === lastPlayedStation) return;
    lastPlayedStation = stationId;

    startTime = Date.now();

    playStream({
      player,
      url: stations[stationId].url,
      volume: 0.5
    });

    await new Promise(r => setTimeout(r, 3000));

    try {
      await entersState(player, AudioPlayerStatus.Playing, 3000);
    } catch (err) {
      log(`Failed to start stream: ${err.message}`);
      return;
    }

    const activity = `Radio 24/7 - ${stations[stationId].name}`;
    client.user.setActivity(activity, { type: ActivityType.Listening });
    log(`Set Activity bot to Playing ${activity}`);
    log('now_playing', client, { name: stations[stationId].name });
  };

  const handleStatusEmbed = async () => {
    const listeners = vc.members?.filter(m => !m.user.bot).size || 0;
    const idle = listeners === 0;

    const embed = buildRadioEmbed({
      stationId: currentStation,
      stations,
      voiceChannel: vc,
      startTime,
      client,
      idle
    });

    if (embedMessage) await embedMessage.edit({ embeds: [embed] });
  };

  const handleReconnect = async (oldState, newState) => {
    if (oldState.id !== client.user.id) return;

    const left = oldState.channelId === voiceChannelId && newState.channelId !== voiceChannelId;
    const rejoined = newState.channelId === voiceChannelId;

    if (!left && !rejoined) return;
    if (rejoined) return;

    log('Bot disconnected', client);
    if (isReconnecting) return;

    isReconnecting = true;

    setTimeout(async () => {
      lastPlayedStation = null;
      await initializeBot(client);
      isReconnecting = false;
    }, 3000);
  };

  const handleSelectMenu = async interaction => {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'radio_select') return;

    const userChannel = interaction.member.voice.channelId;

    if (!userChannel) {
      try {
        await interaction.reply({
          content: 'You need to join a voice channel to change the station.',
          flags: MessageFlags.Ephemeral
        });
      } catch {}
      return;
    }

    if (userChannel !== voiceChannelId) {
      try {
        await interaction.reply({
          content: 'You must be in the same voice channel as the bot to change the station.',
          flags: MessageFlags.Ephemeral
        });
      } catch {}
      return;
    }

    const selected = interaction.values[0];
    currentStation = selected;

    try {
      await interaction.reply({
        content: `Now playing: ${stations[selected].name}`,
        flags: MessageFlags.Ephemeral
      });
    } catch {}

    const embed = buildRadioEmbed({
      stationId: selected,
      stations,
      voiceChannel: vc,
      startTime,
      client,
      idle: false
    });

    await embedMessage.edit({ embeds: [embed] });
    await play();
  };

  await play();

  const menu = buildStationSelectMenu(stations);
  const embed = buildRadioEmbed({
    stationId: currentStation,
    stations,
    voiceChannel: vc,
    startTime,
    client,
    idle: false
  });

  if (embedMessage) {
    await embedMessage.edit({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  } else {
    const message = await tc.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
    embedMessage = message;
  }

  player.on('idle', () => play());
  client.on('interactionCreate', handleSelectMenu);

  client.on('voiceStateUpdate', async (oldState, newState) => {
    await handleReconnect(oldState, newState);
    if (isReconnecting) return;

    const listeners = vc.members?.filter(m => !m.user.bot).size || 0;
    if (listeners === lastListeners) return;
    lastListeners = listeners;

    await handleStatusEmbed();
  });
};
