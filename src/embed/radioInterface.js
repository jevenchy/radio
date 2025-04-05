import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  EmbedBuilder
} from 'discord.js';

import { voiceChannelId } from '../../config/config.js';
import { formatDuration } from '../utils/formatDuration.js';
import { detectSource } from '../core/stations.js';
import { log } from '../utils/logger.js';

export const buildStationSelectMenu = (stations) => {
  return new StringSelectMenuBuilder()
    .setCustomId('radio_select')
    .setPlaceholder('Select a station...')
    .addOptions(
      Object.entries(stations).map(([id, station]) =>
        new StringSelectMenuOptionBuilder().setLabel(station.name).setValue(id)
      )
    );
};

export const handleSelectMenu = async ({
  interaction,
  stations,
  currentStation,
  play,
  client,
  embedMessage,
  setStation,
  startTime
}) => {
  if (!interaction.isStringSelectMenu() || interaction.customId !== 'radio_select') return;

  const userChannel = interaction.member.voice.channelId;

  if (!userChannel) {
    return interaction.reply({
      content: 'You need to join a voice channel to change the station.',
      flags: MessageFlags.Ephemeral
    });
  }

  if (userChannel !== voiceChannelId) {
    return interaction.reply({
      content: 'You must be in the same voice channel as the bot to change the station.',
      flags: MessageFlags.Ephemeral
    });
  }

  const selected = interaction.values[0];
  setStation(selected);
  play();

  const vc = interaction.guild.channels.cache.get(voiceChannelId);
  const updated = createNowPlayingEmbed({
    stationId: selected,
    stations,
    voiceChannel: vc,
    startTime,
    client
  });

  await embedMessage.edit({ embeds: [updated] });

  await interaction.reply({
    content: `Now playing: ${stations[selected].name}`,
    flags: MessageFlags.Ephemeral
  });
};

export const createNowPlayingEmbed = ({ stationId, stations, voiceChannel, startTime, client }) => {
  const elapsed = startTime ? formatDuration(Date.now() - startTime) : '00:00:00';
  const bitrate = voiceChannel?.bitrate ? `${voiceChannel.bitrate / 1000} kbps` : 'Unknown';
  const listeners = voiceChannel?.members?.size ?? 0;
  const source = detectSource(stations[stationId].url);

  return new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: `Radio | ${voiceChannel.name}`, iconURL: client.user.displayAvatarURL() })
    .setDescription(`**Now playing**\n\`\`\`${stations[stationId].name}\`\`\``)
    .addFields(
      { name: 'Elapsed Time', value: `\`${elapsed}\``, inline: true },
      { name: 'Bitrate', value: `\`${bitrate}\``, inline: true },
      { name: 'Channel', value: `\`${voiceChannel.name}\``, inline: true },
      { name: 'Listeners', value: `\`${listeners}\``, inline: true },
      { name: 'Source', value: `\`${source}\``, inline: true },
      { name: 'Loop', value: '`24/7`', inline: true }
    )
    .setImage('https://media.discordapp.net/attachments/1357016908611715284/1357812086641659924/radio-7377.png')
    .setFooter({ text: '🎧 Radio 24/7' })
    .setTimestamp();
};
