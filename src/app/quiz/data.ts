export type Accumulator = Record<string, { score: number; max: number }>;

export type Question = {
  dim: string;
  multi: boolean;
  text: string;
  hint?: string;
  pillars: Record<string, number>;
  opts: { text: string; score: number; emoji?: string }[];
};

export type Level = {
  max: number;
  title: string;
  desc: string;
};

export type Recommendation = {
  id: string;
  questionIdx: number;
  to: number;
  title: string;
  desc: string;
  action: string;
  link: string;
  effort: number;
  excludeIfSelected?: number[]; // suppress rec if user already selected any of these option indices
  sourceLabel?: string;
  sourceUrl?: string;
};

export const dims = [
  'Communication',
  'Storage & Files',
  'Identity & Access',
  'Device & Software',
  'Payments & Money',
  'Online Presence',
];

export const pillars = [
  'Privacy',
  'Security',
  'Independence',
  'Sovereignty',
  'Transparency',
];

export const pillarDesc: Record<string, string> = {
  Privacy:      'How much companies can read or profile your data',
  Security:     'How exposed you are to hackers and breaches',
  Independence: 'How free you are from vendor lock-in',
  Sovereignty:  'Whose laws govern your data',
  Transparency: 'How auditable and open your tools are',
};

export const levels: Level[] = [
  { max: 20,  title: 'In Denial',        desc: "You're deep in the relationship and everything feels fine. It's comfortable, convenient, and completely controlled by someone else." },
  { max: 40,  title: "It's Complicated", desc: "You know something's off. You've had the thoughts. You're not ready to leave, but you're not fully comfortable either." },
  { max: 60,  title: "It's not me, it's you!", desc: "You've started to see the relationship for what it is, and you're calling it out. A few alternatives are in place. You're not gone yet, but you know exactly who's at fault." },
  { max: 80,  title: 'Seeing Someone Else',  desc: "You're actively exploring alternatives and actually using them. Big Tech is still in your contacts, but it's no longer your main thing." },
  { max: 100, title: 'New Love',         desc: "You've done the work. Your digital life is largely your own. You control your data, your tools, and your presence online." },
];

export const questions: Question[] = [
  { dim: 'Communication', multi: true,
    text: 'Which messaging apps do you use?',
    pillars: { Privacy: 1.0, Security: 0.5, Sovereignty: 0.25, Transparency: 1.0 },
    opts: [
      { text: 'WhatsApp',                                          score: 0, emoji: '💬' },
      { text: 'Telegram',                                          score: 1, emoji: '✈️' },
      { text: 'Signal',                                            score: 2, emoji: '🔒' },
      { text: 'Something more niche: Matrix, Session, Briar...',   score: 3, emoji: '🌐' },
    ]},

  { dim: 'Communication', multi: true,
    text: 'Which email providers do you use?',
    pillars: { Privacy: 1.0, Security: 0.5, Independence: 0.5, Sovereignty: 1.0, Transparency: 0.25 },
    opts: [
      { text: 'Gmail',                                             score: 0 },
      { text: 'Outlook',                                           score: 1 },
      { text: 'Proton Mail or another privacy-focused provider',   score: 2 },
      { text: 'I host my own email',                               score: 3 },
    ]},

  { dim: 'Communication', multi: true,
    text: 'For personal calls, you use...',
    pillars: { Privacy: 1.0, Security: 0.5, Sovereignty: 0.25, Transparency: 1.0 },
    opts: [
      { text: 'WhatsApp video',                                    score: 0, emoji: '📹' },
      { text: 'FaceTime',                                          score: 1, emoji: '📱' },
      { text: 'Signal audio or video',                             score: 2, emoji: '🛡️' },
      { text: 'Jitsi or an open alternative',                      score: 3, emoji: '🎙️' },
    ]},

  { dim: 'Storage & Files', multi: true,
    text: 'Where do your files live?',
    pillars: { Privacy: 1.0, Security: 0.5, Independence: 0.5, Sovereignty: 1.0 },
    opts: [
      { text: 'Google Drive',                                      score: 0, emoji: '☁️' },
      { text: 'iCloud, OneDrive, or Dropbox',                      score: 1, emoji: '📦' },
      { text: 'Proton Drive or an encrypted alternative',          score: 2, emoji: '🔐' },
      { text: 'On my own storage (I manage it myself)',             score: 3, emoji: '💾' },
    ]},

  { dim: 'Storage & Files', multi: false,
    text: 'Your photos are backed up to...',
    pillars: { Privacy: 1.0, Security: 0.5, Independence: 0.5, Sovereignty: 0.5 },
    opts: [
      { text: 'Google Photos, automatically',                      score: 0, emoji: '🖼️' },
      { text: 'iCloud',                                            score: 1, emoji: '☁️' },
      { text: 'An external hard drive I control',                  score: 2, emoji: '💾' },
      { text: 'A self-hosted or encrypted solution',               score: 3, emoji: '🔐' },
    ]},

  { dim: 'Identity & Access', multi: false,
    text: 'How do you manage your passwords?',
    pillars: { Privacy: 0.25, Security: 1.0, Independence: 0.5, Transparency: 1.0 },
    opts: [
      { text: 'My browser remembers them, or I reuse the same ones', score: 0, emoji: '🌐' },
      { text: 'A commercial password manager (1Password, LastPass)', score: 1, emoji: '🔑' },
      { text: 'Bitwarden or another open-source manager',            score: 2, emoji: '🛡️' },
      { text: 'I host my own password vault',                        score: 3, emoji: '🏠' },
    ]},

  { dim: 'Identity & Access', multi: false,
    text: 'When you see "Sign in with Google / Apple / Facebook", you...',
    pillars: { Privacy: 0.5, Security: 1.0, Independence: 1.0, Sovereignty: 0.25 },
    opts: [
      { text: "Use it, it's so much easier",                       score: 0 },
      { text: 'Use it for throwaway accounts',                     score: 1 },
      { text: 'Avoid it but sometimes give in',                    score: 2 },
      { text: 'Never, always a separate account',                  score: 3 },
    ]},

  { dim: 'Device & Software', multi: false,
    text: 'Your phone runs on...',
    pillars: { Privacy: 1.0, Security: 1.0, Independence: 0.5, Sovereignty: 0.5, Transparency: 0.5 },
    opts: [
      { text: 'Standard Android (Samsung, Pixel, etc.)',           score: 0, emoji: '🤖' },
      { text: 'iOS (Apple)',                                        score: 1, emoji: '🍎' },
      { text: 'Android with Google stripped out (GrapheneOS etc.)', score: 2, emoji: '🛡️' },
      { text: 'Something else entirely',                           score: 3, emoji: '❓' },
    ]},

  { dim: 'Device & Software', multi: false,
    text: "Your main computer's operating system is...",
    pillars: { Privacy: 0.5, Security: 0.25, Independence: 1.0, Sovereignty: 0.5, Transparency: 1.0 },
    opts: [
      { text: 'ChromeOS',                                          score: 0, emoji: '🌐' },
      { text: 'Windows',                                           score: 1, emoji: '🪟' },
      { text: 'macOS',                                             score: 2, emoji: '🍎' },
      { text: 'Linux',                                             score: 3, emoji: '🐧' },
    ]},

  { dim: 'Device & Software', multi: false,
    text: "What's your main browser?",
    pillars: { Privacy: 1.0, Security: 0.5, Independence: 0.5, Transparency: 1.0 },
    opts: [
      { text: 'Chrome',                                            score: 0, emoji: '🌐' },
      { text: 'Safari',                                            score: 1, emoji: '🧭' },
      { text: 'Firefox or Brave',                                  score: 2, emoji: '🦊' },
      { text: 'Something even more private',                       score: 3, emoji: '🕵️' },
    ]},

  { dim: 'Device & Software', multi: false,
    text: 'For navigation, you use...',
    pillars: { Privacy: 1.0, Independence: 0.5, Sovereignty: 0.5, Transparency: 0.5 },
    opts: [
      { text: 'Google Maps',                                       score: 0, emoji: '📍' },
      { text: 'Apple Maps',                                        score: 1, emoji: '🗺️' },
      { text: 'Organic Maps',                                      score: 2, emoji: '🌿' },
      { text: 'OsmAnd or something more advanced',                 score: 3, emoji: '🧭' },
    ]},

  { dim: 'Payments & Money', multi: true,
    text: 'When you pay online, you use...',
    hint: 'Think webshops, subscriptions, and in-app purchases',
    pillars: { Privacy: 1.0, Security: 0.5, Sovereignty: 1.0 },
    opts: [
      { text: 'Google Pay or PayPal',                              score: 0, emoji: '💳' },
      { text: 'Apple Pay or my bank card directly',                score: 1, emoji: '📱' },
      { text: 'A European fintech: Revolut, Wise, N26',            score: 2, emoji: '🇪🇺' },
      { text: 'Crypto',                                            score: 3, emoji: '🪙' },
    ]},

  { dim: 'Payments & Money', multi: false,
    text: 'Your financial data is mostly held by...',
    pillars: { Privacy: 0.5, Security: 0.5, Sovereignty: 1.0 },
    opts: [
      { text: 'Multiple US apps and platforms',                    score: 0, emoji: '🇺🇸' },
      { text: 'One traditional bank',                              score: 1, emoji: '🏦' },
      { text: 'Mostly European providers',                         score: 2, emoji: '🇪🇺' },
      { text: 'As few places as possible',                         score: 3, emoji: '🔐' },
    ]},

  { dim: 'Online Presence', multi: false,
    text: "What's your main search engine?",
    pillars: { Privacy: 1.0, Sovereignty: 1.0, Transparency: 0.25 },
    opts: [
      { text: 'Google',                                            score: 0, emoji: '🔍' },
      { text: 'Bing',                                              score: 1, emoji: '🔎' },
      { text: 'DuckDuckGo',                                        score: 2, emoji: '🦆' },
      { text: 'Startpage, Brave Search, or Kagi',                  score: 3, emoji: '🛡️' },
    ]},

  { dim: 'Online Presence', multi: true,
    text: 'Which social platforms are you active on?',
    pillars: { Privacy: 1.0, Independence: 1.0, Sovereignty: 1.0, Transparency: 0.5 },
    opts: [
      { text: 'Facebook',                                          score: 0, emoji: '👤' },
      { text: 'TikTok',                                            score: 0, emoji: '🎵' },
      { text: 'Instagram',                                         score: 0, emoji: '📸' },
      { text: 'YouTube',                                           score: 0, emoji: '▶️' },
      { text: 'X (Twitter) or LinkedIn',                           score: 1, emoji: '🐦' },
      { text: 'BlueSky or Mastodon',                               score: 2, emoji: '🦋' },
      { text: "None, I've stepped back",                           score: 3, emoji: '✌️' },
    ]},

  { dim: 'Online Presence', multi: false,
    text: 'When a cookie banner appears, you...',
    pillars: { Privacy: 1.0, Security: 0.25, Sovereignty: 0.25, Transparency: 0.5 },
    opts: [
      { text: 'Accept all, I just want to get to the page',        score: 0, emoji: '🍪' },
      { text: 'Sometimes decline the marketing ones',              score: 1, emoji: '🤏' },
      { text: 'Always reject what I can',                          score: 2, emoji: '🚫' },
      { text: 'My browser handles it before I even see it',        score: 3, emoji: '⚙️' },
    ]},
];

export const recommendations: Recommendation[] = [
  {
    id:                'msg-signal',
    questionIdx:       0,
    to:                2,
    title:             'Switch to Signal',
    desc:              'End-to-end encrypted by default, non-profit, and open source. Ask your closest contacts to join. Most are surprised how good it is. You can keep WhatsApp installed; Signal runs alongside it.',
    action:            'Download Signal',
    link:              'https://signal.org/download/',
    effort:            1,
    excludeIfSelected: [2, 3], // already has Signal or niche app
    sourceLabel:       'EFF: Surveillance Self-Defense',
    sourceUrl:         'https://ssd.eff.org/module/how-use-signal-ios',
  },
  {
    id:          'browser-brave',
    questionIdx: 9,
    to:          2,
    title:       'Switch to Brave',
    desc:        'Same experience as Chrome, with built-in ad and tracker blocking. No setup needed. Your browsing history stops feeding Google the moment you switch.',
    action:      'Download Brave',
    link:        'https://brave.com/download/',
    effort:      1,
    sourceLabel: 'Trinity College Dublin: Browser Privacy Study',
    sourceUrl:   'https://www.scss.tcd.ie/Doug.Leith/pubs/browser_privacy.pdf',
  },
  {
    id:                'email-proton',
    questionIdx:       1,
    to:                2,
    title:             'Move to Proton Mail',
    desc:              "Swiss-based, end-to-end encrypted, and free to start. Create an account and migrate your subscriptions over time. You don't need to delete Gmail overnight.",
    action:            'Create a Proton account',
    link:              'https://proton.me/mail',
    effort:            2,
    excludeIfSelected: [2, 3], // already has Proton or self-hosted email
    sourceLabel:       'European Alternatives',
    sourceUrl:         'https://european-alternatives.eu/category/email-providers',
  },
  {
    id:          'search-startpage',
    questionIdx: 13,
    to:          3,
    title:       'Switch to Startpage',
    desc:        "Startpage delivers Google's search results without the tracking. Identical quality, zero profile building. One setting change in your browser.",
    action:      'Try Startpage',
    link:        'https://www.startpage.com/',
    effort:      1,
    sourceLabel: 'European Alternatives',
    sourceUrl:   'https://european-alternatives.eu/category/search-engines',
  },
  {
    id:          'maps-organic',
    questionIdx: 10,
    to:          2,
    title:       'Switch to Organic Maps',
    desc:        'Free, open source, works fully offline. No account, no tracking, no ads. Covers cities and hiking trails well. Available on both iPhone and Android.',
    action:      'Get Organic Maps',
    link:        'https://organicmaps.app/',
    effort:      1,
    sourceLabel: 'AP News: Google location tracking',
    sourceUrl:   'https://apnews.com/article/north-america-science-technology-business-google-828aefab64d4411bac257a07c1af0ecb',
  },
  {
    id:          'cookies-com',
    questionIdx: 15,
    to:          3,
    title:       'Install Consent-O-Matic',
    desc:        'Automatically rejects non-essential cookies on every site you visit. Open source, built by university researchers. Works in Brave and Firefox.',
    action:      'Install the extension',
    link:        'https://chromewebstore.google.com/detail/consent-o-matic/mdjildafknihdffpkfmmpnpoiajfjnjd',
    effort:      1,
    sourceLabel: 'Matte et al. (2020): Do Cookie Banners Respect my Choice?',
    sourceUrl:   'https://arxiv.org/abs/2001.02479',
  },
];
