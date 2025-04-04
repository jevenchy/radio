import { createAudioResource, StreamType, demuxProbe } from '@discordjs/voice';
import prism from 'prism-media';
import ffmpegPath from 'ffmpeg-static';

export const playStream = ({ player, url, volume = 0.5 }) => {
  const ffmpeg = new prism.FFmpeg({
    args: [
      '-analyzeduration', '0',
      '-loglevel', '0',
      '-i', url,
      '-f', 's16le',
      '-ar', '48000',
      '-ac', '2'
    ],
    shell: false,
    executable: ffmpegPath
  });

  const resource = createAudioResource(ffmpeg, {
    inputType: StreamType.Raw,
    inlineVolume: true
  });

  resource.volume.setVolume(volume);
  player.play(resource);
};
