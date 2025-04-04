export const stations = {
  "1": { name: "BBC Radio 1", url: "https://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/hls/nonuk/audio_syndication_low_sbr_v1/cfs/bbc_radio_one.m3u8" },
  "2": { name: "BBC Radio 2", url: "https://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/hls/nonuk/audio_syndication_low_sbr_v1/cfs/bbc_radio_two.m3u8" },
  "3": { name: "BBC Radio London", url: "https://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/hls/nonuk/audio_syndication_low_sbr_v1/aks/bbc_london.m3u8" },
  "4": { name: "BBC Radio 6 Music", url: "https://a.files.bbci.co.uk/ms6/live/3441A116-B12E-4D2F-ACA8-C1984642FA4B/audio/simulcast/dash/nonuk/pc_hd_abr_v2/cfs/bbc_6music.mpd" },
  "5": { name: "Capital FM", url: "https://media-ssl.musicradio.com/Capital" },
  "6": { name: "ABC triple J", url: "https://mediaserviceslive.akamaized.net/hls/live/2038308/triplejnsw/index.m3u8" },
  "7": { name: "CBC Radio One", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/CBLAFM_CBC.mp3?dist=onlineradiobox" },
  "8": { name: "Radio Disney - DFW", url: "https://s5.radio.co/s9a4d5865b/listen" },
  "9": { name: "Radio Disney - SA", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/DISNEY_CHI_SA.mp3?dist=onlineradiobox" },
  "10": { name: "NetRadio", url: "https://streaming.classynetradio.com/radio/8000/classySD" },
  "11": { name: "KEXP 90.3 FM", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3" },
  "12": { name: "NPR Radio", url: "https://npr-ice.streamguys1.com/live.mp3" },
  "13": { name: "108 JAMZ", url: "http://jbmedia-edge1.cdnstream.com/hot108" },
  "14": { name: "Deutschlandfunk", url: "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3?aggregator=onlineradiobox-com" },
  "15": { name: "RAI Radio 1", url: "https://radiounoest-live.akamaized.net/hls/live/2032586/radiounoest/radiounoest/playlist.m3u8" },
  "16": { name: "RAI Radio 2", url: "https://icestreaming.rai.it/2.mp3" },
  "17": { name: "SBS PopAsia", url: "https://sbs-ice.streamguys1.com/sbs-popasia" },
  "18": { name: "Chillout Antenne", url: "https://mp3channels.webradio.antenne.de/chillout" },
  "19": { name: "Virgin Radio", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/CKFMFMAAC_SC?dist=onlineradiobox" },
  "20": { name: "HITS Mandarin", url: "https://streaming.live365.com/a57743" },
  "21": { name: "Mandarin Station", url: "https://stream01-ssl.arenastreaming.com:8043/stream" },
  "22": { name: "977 FM", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/977_HITSAAC_SC?dist=onlineradiobox" },
  "23": { name: "Classic FM", url: "http://media-ice.musicradio.com/ClassicFMMP3" },
  "24": { name: "NCS", url: "http://stream.laut.fm/ncsradio" },
  "25": { name: "EDM", url: "http://stream.laut.fm/edm" },
};

export const detectSource = (url) => {
  if (!url || typeof url !== 'string') return 'Unknown';

  const sources = {
    'bbci.co.uk': 'BBC',
    'musicradio.com': 'Musicradio',
    'streamtheworld.com': 'StreamTheWorld',
    'radio.co': 'Radio.co',
    'classynetradio.com': 'NetRadio',
    'streamguys1.com': 'StreamGuys',
    'cdnstream.com': 'CDNStream',
    'dlf.de': 'DLF',
    'rai.it': 'RAI',
    'classynetradio.com': 'Classynet',
    'streamguys1.com': 'StreamGuys',
    'webradio.antenne.de': 'Antenne',
    'live365.com': 'Live365',
    'arenastreaming.com': 'Arenastream',
    'laut.fm': 'Laut.fm',
    'akamaized.net': 'Akamaized'
  };

  const matched = Object.entries(sources).find(([key]) => url.includes(key));
  return matched ? matched[1] : 'Unknown';
};
