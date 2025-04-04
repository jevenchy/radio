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

![Bot in action](img/bot_embed.png)

- 24/7 streaming in voice channels
- Interactive station switcher (via dropdown)
- Real-time stream display (embed)

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
src/
├── core/           # Bot initialization & player logic
├── embed/          # Radio interface (menu + embed)
├── data/           # Station list
├── utils/          # Logger, helpers
```

## Available Radio Stations

```
1. BBC Radio 1
2. BBC Radio 2
3. BBC Radio London
4. BBC Radio 6 Music
5. Capital FM
6. ABC triple J
7. CBC Radio One
8. Radio Disney - DFW
9. Radio Disney - SA
10. NetRadio
11. KEXP 90.3 FM
12. NPR Radio
13. 108 JAMZ
14. Deutschlandfunk
15. RAI Radio 1
16. RAI Radio 2
17. SBS PopAsia
18. Chillout Antenne
19. Virgin Radio
20. HITS Mandarin
21. Mandarin Station
22. 977 FM
23. Classic FM
24. NCS
25. EDM
```

## Requirements

- Node.js v18+
- FFmpeg (via `ffmpeg-static`)
- Discord bot token with voice permissions