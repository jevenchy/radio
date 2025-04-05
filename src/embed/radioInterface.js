import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } from 'discord.js';
import { voiceChannelId } from '../../config/config.js';
import { formatDuration } from '../utils/formatDuration.js';
import { detectSource } from '../core/stations.js';

export const buildStationSelectMenu = stations => {
  return new StringSelectMenuBuilder()
    .setCustomId('radio_select')
    .setPlaceholder('Select a station...')
    .addOptions(
      Object.entries(stations).map(([id, s]) =>
        new StringSelectMenuOptionBuilder().setLabel(s.name).setValue(id)
      )
    );
};

export const buildRadioEmbed = ({ stationId, stations, voiceChannel, startTime, client, idle }) => {
  const elapsed = startTime ? formatDuration(Date.now() - startTime) : '00:00:00';
  const bitrate = voiceChannel?.bitrate ? `${voiceChannel.bitrate / 1000} kbps` : 'Unknown';
  const listeners = voiceChannel?.members?.filter(m => !m.user.bot).size ?? 0;
  const source = detectSource(stations[stationId].url);

  return new EmbedBuilder()
    .setColor(0x2f3136)
    .setAuthor({ name: `Radio | ${voiceChannel.name}`, iconURL: client.user.displayAvatarURL() })
    .setDescription(idle
      ? '```Idle: No listeners in voice channel.```'
      : `\`\`\`Now playing: ${stations[stationId].name}\`\`\``)
    .addFields(
      { name: 'Elapsed Time', value: `\`${elapsed}\``, inline: true },
      { name: 'Bitrate', value: `\`${bitrate}\``, inline: true },
      { name: 'Channel', value: `\`${voiceChannel.name}\``, inline: true },
      { name: 'Listeners', value: `\`${listeners}\``, inline: true },
      { name: 'Source', value: `\`${source}\``, inline: true },
      { name: 'Loop', value: '`24/7`', inline: true }
    )
    .setImage('https://media.discordapp.net/attachments/1357016908611715284/1357812086641659924/radio-7377.png')
    .setFooter({ text: 'Radio 24/7' })
    .setTimestamp();
};
