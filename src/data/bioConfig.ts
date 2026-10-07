/*
 * MIT License
 *
 * Copyright (c) 2026 Lexedia
 */

export interface SocialLink {
  name: string;
  url: string;
  icon: 'beatleader' | 'scoresaber' | 'beatsaver' | 'twitch' | 'youtube' | 'discord' | 'twitter' | 'github';
  label?: string;
}

export interface BioConfig {
  profile: {
    name: string;
    pronouns: string;
    avatarUrl: string;
    tagline: string;
    statusEmote: string;
    badges: {
      icon: string;
      label: string
    }[];
  };
  about: {
    quote: string;
    introTitle: string;
    introText: string;
    quickFacts: {
      label: string;
      value: string
    }[];
    goals: {
      title: string;
      desc: string;
      icon: string
    }[];
  };
  gear: {
    headset: string;
    controllers: string;
    grip: string;
    reeSabers?: {
      name: string;
      author: string;
      authorUrl?: string;
      fileUrl: string;
      previewUrl?: string;
    };
  };
  favourites: {
    mappers: string[];
    topMaps: {
      title: string;
      artist: string;
      bsr: string;
      diff: string
    }[];
    genres: string[];
  };
  socials: SocialLink[];
}

export const defaultBioConfig: BioConfig = {
  profile: {
    name: 'Lexie ✧',
    pronouns: 'she/her',
    avatarUrl: 'https://raw.githubusercontent.com/Lexedia/beatleader-bio/refs/heads/mistress/assets/pfp.jpg',
    tagline: 'swinging my sabres to lovely rhythms',
    statusEmote: '(✿◠‿◠)',
    badges: [
      {
        icon: 'ꕥ',
        label: 'ovaries = galls',
      },
      {
        icon: '💚',
        label: 'kissing saves lives',
      },
    ],
  },
  about: {
    quote: '“Male pregnancy is real!”',
    introTitle: 'Hello there! (´｡• ᵕ •｡`) ♡',
    introText: 'Welcome to my BeatLeader profile! I\'m an avid rhythm game lover who enjoys slicing cubes, practising accuracy, and having fun with tech maps.',
    quickFacts: [
      {
        label: 'Main Game',
        value: 'Beat Saber (guhh)',
      },
      {
        label: 'Playstyle',
        value: 'Trying not to die :3',
      },
      {
        label: 'Favourite Mapping Style',
        value: 'Tech',
      },
      {
        label: 'Rank Goal',
        value: 'Sub 1\'250 Global',
      },
    ],
    goals: [
      {
        title: 'Have better swings',
        desc: 'Actual good swings, not whatever these are',
        icon: '＞﹏＜',
      },
      {
        title: 'Top 5 Country',
        desc: 'Wont happen lol',
        icon: '꒫',
      },
    ],
  },
  gear: {
    headset: 'PSVR2',
    controllers: 'PSVR2 Sense Controllers',
    grip: 'K-Grip',
    reeSabers: {
      name: '(LSTR-512) Elster',
      author: 'mipity',
      authorUrl: 'https://www.twitch.tv/mipity',
      fileUrl: 'https://github.com/Lexedia/beatleader-bio/raw/refs/heads/mistress/assets/(LSTR-512)%20Elster.reesaber',
      previewUrl: 'https://raw.githubusercontent.com/Lexedia/beatleader-bio/refs/heads/mistress/assets/reesabers.webp',
    },
  },
  favourites: {
    mappers: [
      'Najoko',
      'Zana',
      'HicqLlie',
      'Tranch',
      'ZeCube',
    ],
    genres: [
      'Vocaloid',
      'J-Pop/Rock',
      'Black Metal',
    ],
    topMaps: [
      {
        title: 'Schwarze Wolke',
        artist: 'CÉLINE',
        bsr: '454c6',
        diff: 'Expert+ (One Sabre)',
      },
      {
        title: 'Loveit?',
        artist: 'biz x ZERA (ft. LOLUET)',
        bsr: '48bb4',
        diff: 'Expert+',
      },
    ],
  },
  socials: [
    {
      name: 'BeatLeader',
      url: 'https://beatleader.com/u/lexedia',
      icon: 'beatleader',
    },
    {
      name: 'ScoreSaber',
      url: 'https://scoresaber.com/u/lexedia',
      icon: 'scoresaber',
    },
    {
      name: 'BeatSaver',
      url: 'https://beatsaver.com/profile/username/Lexedia',
      icon: 'beatsaver',
    },
    {
      name: 'Twitch',
      url: 'https://twitch.tv/Lexedia',
      icon: 'twitch',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@Lexedia',
      icon: 'youtube',
    },
    {
      name: 'Discord',
      url: 'https://discordapp.com/users/253554702858452992',
      icon: 'discord',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Lexedia',
      icon: 'github',
    },
  ],
}
