/**
 * Avatar Customization Data Engine & Presets
 * 
 * Defines bases, skin tones, hairstyles, hair colors, outfits,
 * accessories, level unlock requirements, and persistence helpers.
 */

export const BASES = [
  {
    id: 'female',
    name: 'Female',
    title: 'Mystic Maiden',
    defaultName: 'Emily',
    description: 'Charming and sharp-witted initiate with graceful agility.'
  },
  {
    id: 'male',
    name: 'Male',
    title: 'Arcane Champion',
    defaultName: 'Ren',
    description: 'Brave and resolute initiate with staunch determination.'
  }
];

export const SKIN_TONES = [
  { id: 'porcelain', name: 'Porcelain Ivory', color: '#ffedd5', border: '#fed7aa' },
  { id: 'warm-peach', name: 'Warm Peach', color: '#fed7aa', border: '#fcd34d' },
  { id: 'sunkissed', name: 'Sun-Kissed Bronze', color: '#f5c285', border: '#d97706' },
  { id: 'deep-espresso', name: 'Rich Espresso', color: '#92400e', border: '#78350f' },
  { id: 'moonglow', name: 'Astral Moonglow', color: '#e0e7ff', border: '#818cf8' }
];

export const HAIR_COLORS = [
  {
    id: 'dark-brown',
    name: 'Chestnut Brown',
    swatch: '#451a03',
    gradient: ['#78350f', '#451a03', '#291102']
  },
  {
    id: 'midnight-black',
    name: 'Midnight Raven',
    swatch: '#18181b',
    gradient: ['#3f3f46', '#18181b', '#09090b']
  },
  {
    id: 'auburn-crimson',
    name: 'Crimson Ember',
    swatch: '#dc2626',
    gradient: ['#f87171', '#dc2626', '#7f1d1d']
  },
  {
    id: 'golden-blonde',
    name: 'Honey Blonde',
    swatch: '#eab308',
    gradient: ['#fef08a', '#eab308', '#b45309']
  },
  {
    id: 'pastel-rose',
    name: 'Blossom Lavender',
    swatch: '#ec4899',
    gradient: ['#f472b6', '#ec4899', '#a855f7']
  },
  {
    id: 'astral-cyan',
    name: 'Mystic Cyan',
    swatch: '#06b6d4',
    gradient: ['#67e8f9', '#06b6d4', '#0369a1']
  }
];

export const HAIRSTYLES = {
  female: [
    { id: 'twin-tails', name: 'Celestial Twin-Tails', free: true, desc: 'Playful twin-tails with twin ribbon curls.' },
    { id: 'long-flowing', name: 'Flowing Locks', free: true, desc: 'Gentle cascading waves that drift behind you.' },
    { id: 'bob-bangs', name: 'Academy Bob', free: true, desc: 'Neat, precise bob cut favored by strategists.' },
    { id: 'high-ponytail', name: 'High Battle Ponytail', free: false, requiredLevel: 10, desc: 'Dynamic warrior ponytail bound for agility.' },
    { id: 'mystic-waves', name: 'Arcane Empress Waves', free: false, requiredLevel: 20, desc: 'Enchanted curls shimmering with astral power.' }
  ],
  male: [
    { id: 'spiky-hero', name: 'Spiky Adventurer', free: true, desc: 'Dynamic anime spikes ready for any challenge.' },
    { id: 'short-tousled', name: 'Tousled Scholar', free: true, desc: 'Relaxed tousled cut that fits under hoods or hats.' },
    { id: 'sleek-part', name: 'Sleek Side-Part', free: true, desc: 'Refined side-part favored by academy tacticians.' },
    { id: 'samurai-topknot', name: 'Samurai Topknot', free: false, requiredLevel: 10, desc: 'Traditional warrior knot expressing discipline.' },
    { id: 'wild-anime', name: 'Wild Arcane Mane', free: false, requiredLevel: 20, desc: 'Untamed surge of hair imbued with lightning.' }
  ]
};

export const OUTFITS = [
  {
    id: 'academy-uniform',
    name: 'Academy Uniform',
    subtitle: 'Initiate Attire',
    free: true,
    desc: 'Classic academy tunic with gilded trim and embroidered house insignia.',
    previewIcon: '🎓'
  },
  {
    id: 'novice-adventurer',
    name: 'Explorer Tunic',
    subtitle: 'Wilderness Gear',
    free: true,
    desc: 'Lightweight linen tunic with leather strapping and adventurer belt pouches.',
    previewIcon: '🧭'
  },
  {
    id: 'scholar-robes',
    name: 'House Scholar Robes',
    subtitle: 'Enchanted Vestments',
    free: false,
    requiredLevel: 5,
    desc: 'Silken flowing vestments inscribed with glowing constellation charts.',
    previewIcon: '📜'
  },
  {
    id: 'arcane-battleplate',
    name: 'Runic Battleplate',
    subtitle: 'Mithril Armor',
    free: false,
    requiredLevel: 10,
    desc: 'Tempered lightweight armor plates with pulsing protective runes.',
    previewIcon: '🛡️'
  },
  {
    id: 'royal-regalia',
    name: 'Grand Guildmaster Regalia',
    subtitle: 'Legendary Robes',
    free: false,
    requiredLevel: 20,
    desc: 'Majestic ceremonial court robes with ornate gold pauldrons.',
    previewIcon: '👑'
  }
];

export const ACCESSORIES = {
  hair: [
    { id: 'none', name: 'None', free: true },
    { id: 'silk-bow', name: 'Silk Ribbon Bow', free: true, desc: 'Satiny ribbon dyed in your house colors.' },
    { id: 'blossom-clip', name: 'Moonflower Hairpin', free: true, desc: 'Enchanted crystalline floral pin.' },
    { id: 'runic-headband', name: 'Gold Runic Headband', free: false, requiredLevel: 10, desc: 'Focuses mental willpower in battle.' }
  ],
  head: [
    { id: 'none', name: 'None', free: true },
    { id: 'scholar-beret', name: "Scholar's Beret", free: true, desc: 'Velvet beret adorned with a miniature feather.' },
    { id: 'wizard-hat', name: "Astrologer's Wizard Hat", free: false, requiredLevel: 5, desc: 'Conical wizard hat adorned with stars.' },
    { id: 'celestial-circlet', name: 'Celestial Crown', free: false, requiredLevel: 15, desc: 'Gilded crown casting a halo of starlight.' }
  ],
  hand: [
    { id: 'none', name: 'None', free: true },
    { id: 'apprentice-wand', name: 'Novice Wand', free: true, desc: 'Spruce wood wand with a glowing catalyst core.' },
    { id: 'arcane-grimoire', name: 'Arcane Grimoire', free: false, requiredLevel: 5, desc: 'Tome bound in dragonhide with ancient scripts.' },
    { id: 'crystal-staff', name: 'Astral Scepter', free: false, requiredLevel: 15, desc: 'Channeled conduit topping an ethereal crystal.' }
  ]
};

export const DEFAULT_AVATAR_FEMALE = {
  base: 'female',
  name: 'Emily',
  skinTone: 'porcelain',
  hairstyle: 'twin-tails',
  hairColor: 'pastel-rose',
  outfit: 'academy-uniform',
  hairAccessory: 'silk-bow',
  headItem: 'none',
  handItem: 'apprentice-wand'
};

export const DEFAULT_AVATAR_MALE = {
  base: 'male',
  name: 'Ren',
  skinTone: 'porcelain',
  hairstyle: 'spiky-hero',
  hairColor: 'dark-brown',
  outfit: 'academy-uniform',
  hairAccessory: 'none',
  headItem: 'none',
  handItem: 'apprentice-wand'
};

/**
 * Loads existing avatar or returns default
 */
export function getStoredAvatar() {
  try {
    const raw = localStorage.getItem('powerpuff_rpg_avatar');
    if (raw) return JSON.parse(raw);
    
    // Check inside character object
    const charRaw = localStorage.getItem('powerpuff_rpg_character');
    if (charRaw) {
      const charObj = JSON.parse(charRaw);
      if (charObj.avatar) return charObj.avatar;
    }
  } catch {}
  return DEFAULT_AVATAR_FEMALE;
}

/**
 * Persists avatar across localStorage targets
 */
export function persistAvatar(avatarData) {
  try {
    localStorage.setItem('powerpuff_rpg_avatar', JSON.stringify(avatarData));
    
    // Update character object
    const charRaw = localStorage.getItem('powerpuff_rpg_character');
    const charObj = charRaw ? JSON.parse(charRaw) : {};
    charObj.avatar = avatarData;
    charObj.characterName = avatarData.name;
    localStorage.setItem('powerpuff_rpg_character', JSON.stringify(charObj));

    // Update power_puff_user if exists
    const userRaw = localStorage.getItem('power_puff_user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      user.avatar = avatarData;
      user.username = avatarData.name || user.username;
      localStorage.setItem('power_puff_user', JSON.stringify(user));
    }
    return true;
  } catch (e) {
    console.error('Failed to persist avatar data:', e);
    return false;
  }
}
