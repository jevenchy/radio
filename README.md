<h1 align="center">
  <br>
  <a href="https://github.com/jevenchy"><img src="img/bot_avatar.png" width="250" height="250" alt="Radio-bot"></a>
  <br>
  Radio-bot
  <br>
</h1>

<p align="center">24/7 Discord radio bot with real-time stream and station control.</p>

<p align="center">
  <img src="https://img.shields.io/badge/lang-JavaScript-yellow" />
  <img src="https://img.shields.io/badge/version-v1.0.0-blue" />
  <img src="https://img.shields.io/badge/Jevenchy-black" />
</p>

## Features

![Bot in action](img/bot_embed.gif)

- 24/7 streaming in voice channels
- Interactive station switcher (via dropdown)
- Real-time stream display (embed)
- **Automatic reconnect** to the designated voice channel if disconnected
- **Voice channel control**: Ensure the bot only operates in the designated voice channel

## Setup

```bash
npm install
cp env.example .env
```

Edit `.env` with your bot credentials:

```env
DISCORD_TOKEN=your_token_here
GUILD_ID=...
EMBED_CHANNEL_ID=...
VOICE_CHANNEL_ID=...
```

Start the bot:

```bash
npm start
```

## File Structure

```
radio/
├── config/                 # Environment config
├── img/                    # Assets (avatar, embed)
└── src/
    ├── core/               # Streaming logic (stationlist, initialize, player)
    ├── embed/              # Embed builder (menu, interaction)
    ├── events/             # Event listeners
    └── utils/              # Logger, time formatter
```

## Update Available Radio Stations

```
- BBC Radio 1
- BBC Radio 2
- BBC Radio London
- BBC Radio 6 Music
- Capital FM
- ABC triple J
- CBC Radio One
- Radio Disney - DFW
- Radio Disney - SA
- NetRadio
- KEXP 90.3 FM
- NPR Radio
- 108 JAMZ
- Deutschlandfunk
- RAI Radio 1
- RAI Radio 2
- SBS PopAsia
- Chillout Antenne
- Virgin Radio
- HITS Mandarin
- Mandarin Station
- Classic Rock Florida
- 977 Today HITS
- Smooth Radio
- Olímpica Stereo
```

## Requirements

- Node.js v18+ (recommended: v20 via `.nvmrc`)
- FFmpeg (included via `ffmpeg-static`)
- Discord bot token with voice permissions
- Voice encryption dependency: `tweetnacl`

## Update Notes

Major Fixes:
```
- Automatic reconnection: Bot will now reconnect and play the last station if disconnected from the voice channel.
- Stable error handling: If the bot is unable to connect to the voice or text channel, the process will exit with a clear error log.
```