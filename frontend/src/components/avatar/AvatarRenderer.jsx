import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SKIN_TONES, HAIR_COLORS } from '../../utils/avatarData';

/**
 * Pure-React High-Fidelity SVG Avatar Character Engine
 * Supports modular composition of base, skin tone, hairstyles,
 * hair colors, outfits, accessories, house trims, and natural blinking.
 */
export default function AvatarRenderer({
  base = 'female',
  skinTone = 'porcelain',
  hairstyle = 'twin-tails',
  hairColor = 'pastel-rose',
  outfit = 'academy-uniform',
  hairAccessory = 'silk-bow',
  headItem = 'none',
  handItem = 'apprentice-wand',
  house = 'blossom',
  size = 280,
  isAnimated = true
}) {
  // Natural blinking effect
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!isAnimated) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 4200);
    return () => clearInterval(interval);
  }, [isAnimated]);

  // Resolve color values
  const skin = SKIN_TONES.find((s) => s.id === skinTone) || SKIN_TONES[0];
  const hair = HAIR_COLORS.find((h) => h.id === hairColor) || HAIR_COLORS[4];

  // Resolve house styling (Blossom, Bubbles, Buttercup)
  const normalizedHouse = typeof house === 'object' && house?.id ? house.id : String(house || 'blossom').toLowerCase();
  const houseColor = normalizedHouse.includes('bubbles')
    ? '#06b6d4'
    : normalizedHouse.includes('buttercup')
      ? '#f59e0b'
      : '#ec4899';

  const houseSecondary = normalizedHouse.includes('bubbles')
    ? '#38bdf8'
    : normalizedHouse.includes('buttercup')
      ? '#ef4444'
      : '#c084fc';

  const isFemale = base === 'female';

  return (
    <motion.div
      className="relative flex items-center justify-center select-none"
      animate={
        isAnimated
          ? {
              y: [0, -8, 0],
              transition: {
                repeat: Infinity,
                duration: 3.6,
                ease: 'easeInOut'
              }
            }
          : {}
      }
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
      >
        <defs>
          {/* Dynamic Hair Gradient */}
          <linearGradient id="avatarHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hair.gradient[0]} />
            <stop offset="50%" stopColor={hair.gradient[1]} />
            <stop offset="100%" stopColor={hair.gradient[2]} />
          </linearGradient>

          {/* House Trim Accent Gradient */}
          <linearGradient id="avatarHouseTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={houseColor} />
            <stop offset="100%" stopColor={houseSecondary} />
          </linearGradient>

          {/* Outfit Gradients */}
          <linearGradient id="outfitAcademy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="outfitAdventurer" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#291102" />
          </linearGradient>

          <linearGradient id="outfitScholar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="50%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="outfitBattleplate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="outfitRoyal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#581c87" />
            <stop offset="50%" stopColor="#3b0764" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="avatarMagicalGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================================================================= */}
        {/* 1. HOUSE AURA & BACK HALO                                         */}
        {/* ================================================================= */}
        <g opacity="0.3" filter="url(#avatarMagicalGlow)">
          <circle cx="100" cy="95" r="54" fill={houseColor} opacity="0.25" />
          <ellipse cx="100" cy="38" rx="36" ry="9" fill="none" stroke={houseColor} strokeWidth="2.5" />
        </g>

        {/* ================================================================= */}
        {/* 2. BACK HAIR LAYER                                                */}
        {/* ================================================================= */}
        {isFemale ? (
          // FEMALE BACK HAIRSTYLES
          <>
            {hairstyle === 'twin-tails' && (
              <g fill="url(#avatarHairGrad)">
                {/* Left Twin Tail */}
                <path d="M 58 78 C 30 90, 20 135, 42 165 C 50 175, 62 145, 54 110 Z" />
                {/* Right Twin Tail */}
                <path d="M 142 78 C 170 90, 180 135, 158 165 C 150 175, 138 145, 146 110 Z" />
                {/* Back Bulk */}
                <path d="M 52 70 C 48 115, 68 135, 100 135 C 132 135, 152 115, 148 70 Z" />
              </g>
            )}

            {hairstyle === 'long-flowing' && (
              <path
                d="M 50 70 C 35 110, 40 160, 60 180 C 70 185, 75 160, 78 140 C 90 145, 110 145, 122 140 C 125 160, 130 185, 140 180 C 160 160, 165 110, 150 70 Z"
                fill="url(#avatarHairGrad)"
              />
            )}

            {hairstyle === 'bob-bangs' && (
              <path
                d="M 54 68 C 48 105, 55 130, 80 135 C 100 138, 120 138, 146 130 C 152 105, 146 68, 146 68 Z"
                fill="url(#avatarHairGrad)"
              />
            )}

            {hairstyle === 'high-ponytail' && (
              <g fill="url(#avatarHairGrad)">
                {/* Back head bulk */}
                <circle cx="100" cy="80" r="42" />
                {/* High Ponytail arching right */}
                <path d="M 115 50 C 150 45, 185 85, 165 145 C 155 155, 145 130, 142 100 C 130 75, 115 65, 115 50 Z" />
              </g>
            )}

            {hairstyle === 'mystic-waves' && (
              <path
                d="M 46 65 C 25 105, 30 155, 50 185 C 65 195, 70 160, 80 140 C 95 148, 105 148, 120 140 C 130 160, 135 195, 150 185 C 170 155, 175 105, 154 65 Z"
                fill="url(#avatarHairGrad)"
              />
            )}
          </>
        ) : (
          // MALE BACK HAIRSTYLES
          <>
            {hairstyle === 'spiky-hero' && (
              <g fill="url(#avatarHairGrad)">
                <path d="M 50 75 L 35 60 L 52 50 L 42 32 L 68 35 L 75 18 L 98 28 L 105 12 L 125 28 L 140 22 L 145 42 L 165 48 L 150 68 L 165 82 L 146 88 C 146 115, 130 130, 100 130 C 70 130, 54 115, 50 75 Z" />
              </g>
            )}

            {hairstyle === 'short-tousled' && (
              <path
                d="M 52 70 C 45 55, 52 35, 75 28 C 90 22, 115 22, 130 30 C 150 38, 155 58, 148 75 C 146 105, 132 125, 100 125 C 68 125, 54 105, 52 70 Z"
                fill="url(#avatarHairGrad)"
              />
            )}

            {hairstyle === 'sleek-part' && (
              <path
                d="M 55 68 C 50 50, 60 32, 85 28 C 110 24, 138 32, 145 55 C 148 75, 144 112, 100 118 C 56 112, 52 75, 55 68 Z"
                fill="url(#avatarHairGrad)"
              />
            )}

            {hairstyle === 'samurai-topknot' && (
              <g fill="url(#avatarHairGrad)">
                {/* Top Knot Bun */}
                <circle cx="100" cy="22" r="14" />
                <path d="M 94 28 L 106 28 L 100 10 Z" />
                {/* Back hair */}
                <path d="M 58 68 C 52 50, 65 35, 100 35 C 135 35, 148 50, 142 68 C 140 105, 130 120, 100 120 C 70 120, 60 105, 58 68 Z" />
              </g>
            )}

            {hairstyle === 'wild-anime' && (
              <path
                d="M 40 85 L 25 70 L 42 55 L 30 35 L 58 35 L 68 15 L 95 24 L 110 8 L 132 25 L 152 18 L 155 42 L 175 52 L 160 75 L 178 95 L 150 105 C 145 135, 125 145, 100 145 C 75 145, 55 135, 50 105 Z"
                fill="url(#avatarHairGrad)"
              />
            )}
          </>
        )}

        {/* ================================================================= */}
        {/* 3. BODY & OUTFIT BASE                                             */}
        {/* ================================================================= */}
        {/* Neck */}
        <path d="M 90 108 L 90 125 L 110 125 L 110 108 Z" fill={skin.color} />

        {/* Outfit Torso */}
        {outfit === 'academy-uniform' && (
          <g>
            {/* Dark Coat / Vest */}
            <path
              d="M 66 122 C 58 150, 52 178, 100 180 C 148 178, 142 150, 134 122 Z"
              fill="url(#outfitAcademy)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* White Shirt / Blouse Inset */}
            <polygon points="86,122 100,150 114,122" fill="#f8fafc" />
            {/* House Color Tie / Cravat */}
            <polygon points="96,124 104,124 100,146" fill="url(#avatarHouseTrim)" />
            {/* Gold Lapel Trims */}
            <path d="M 72 124 L 90 148" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
            <path d="M 128 124 L 110 148" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
            {/* House Emblem Pin */}
            <circle cx="82" cy="144" r="4.5" fill="url(#avatarHouseTrim)" stroke="#facc15" strokeWidth="1" />
          </g>
        )}

        {outfit === 'novice-adventurer' && (
          <g>
            {/* Adventurer Leather Tunic */}
            <path
              d="M 66 122 C 58 150, 54 178, 100 180 C 146 178, 142 150, 134 122 Z"
              fill="url(#outfitAdventurer)"
              stroke="#1c1917"
              strokeWidth="2"
            />
            {/* Cloth collar */}
            <polygon points="84,122 100,142 116,122" fill="#e7e5e4" />
            {/* Cross-body belt with House Buckle */}
            <line x1="72" y1="128" x2="128" y2="175" stroke="#292524" strokeWidth="4" />
            <rect x="95" y="146" width="10" height="10" rx="2" fill="url(#avatarHouseTrim)" stroke="#facc15" strokeWidth="1.5" />
          </g>
        )}

        {outfit === 'scholar-robes' && (
          <g>
            {/* Silken Flowing Robe */}
            <path
              d="M 62 122 C 48 152, 45 182, 100 184 C 155 182, 152 152, 138 122 Z"
              fill="url(#outfitScholar)"
              stroke="#1e1b4b"
              strokeWidth="2"
            />
            {/* Star chart sash */}
            <path d="M 88 122 Q 100 148 112 122" fill="none" stroke="url(#avatarHouseTrim)" strokeWidth="3" />
            <circle cx="100" cy="140" r="3.5" fill="#facc15" />
            <line x1="80" y1="172" x2="120" y2="172" stroke="#facc15" strokeWidth="1.5" />
          </g>
        )}

        {outfit === 'arcane-battleplate' && (
          <g>
            {/* Mithril Armor Torso */}
            <path
              d="M 64 122 C 58 150, 55 178, 100 180 C 145 178, 142 150, 136 122 Z"
              fill="url(#outfitBattleplate)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Pauldrons (Shoulder guards) */}
            <ellipse cx="68" cy="128" rx="9" ry="6" fill="#64748b" stroke="#facc15" strokeWidth="1.5" />
            <ellipse cx="132" cy="128" rx="9" ry="6" fill="#64748b" stroke="#facc15" strokeWidth="1.5" />
            {/* Glowing Chest Crest */}
            <polygon points="100,136 108,148 100,160 92,148" fill="url(#avatarHouseTrim)" filter="url(#avatarMagicalGlow)" />
          </g>
        )}

        {outfit === 'royal-regalia' && (
          <g>
            {/* Imperial Velvet Robe */}
            <path
              d="M 62 120 C 50 152, 46 182, 100 185 C 154 182, 150 152, 138 120 Z"
              fill="url(#outfitRoyal)"
              stroke="#3b0764"
              strokeWidth="2"
            />
            {/* Ornate Gold Mantle */}
            <path d="M 72 122 Q 100 146 128 122 Q 100 134 72 122 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="100" cy="132" r="4.5" fill="url(#avatarHouseTrim)" />
          </g>
        )}

        {/* Cute Adventurer Boots */}
        <ellipse cx="88" cy="180" rx="8" ry="5" fill="#0f172a" />
        <ellipse cx="112" cy="180" rx="8" ry="5" fill="#0f172a" />

        {/* ================================================================= */}
        {/* 4. CHIBI HEAD & FACE                                              */}
        {/* ================================================================= */}
        {/* Head Shape */}
        <path
          d="M 58 72 C 54 104, 76 118, 100 118 C 124 118, 146 104, 142 72 C 142 42, 58 42, 58 72 Z"
          fill={skin.color}
          stroke={skin.border}
          strokeWidth="1.5"
        />

        {/* Soft Blushing Cheeks */}
        <ellipse cx="72" cy="94" rx="6.5" ry="4" fill="#fb7185" opacity="0.65" />
        <ellipse cx="128" cy="94" rx="6.5" ry="4" fill="#fb7185" opacity="0.65" />

        {/* ================================================================= */}
        {/* 5. EXPRESSIVE ANIME EYES & MOUTH                                  */}
        {/* ================================================================= */}
        {isBlinking ? (
          // Blinking: Cute curved closed lash lines
          <g>
            <path d="M 72 82 Q 80 88 88 82" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 112 82 Q 120 88 128 82" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
          </g>
        ) : (
          // Open Sparkling Anime Eyes
          <g>
            {/* Left Eye */}
            <g>
              <ellipse cx="80" cy="80" rx="8.5" ry="11.5" fill="#1e1b4b" />
              <ellipse cx="80" cy="83" rx="6.5" ry="7.5" fill={houseSecondary} />
              <circle cx="78" cy="76" r="3.2" fill="#ffffff" />
              <circle cx="83" cy="85" r="1.6" fill="#ffffff" />
            </g>

            {/* Right Eye */}
            <g>
              <ellipse cx="120" cy="80" rx="8.5" ry="11.5" fill="#1e1b4b" />
              <ellipse cx="120" cy="83" rx="6.5" ry="7.5" fill={houseSecondary} />
              <circle cx="118" cy="76" r="3.2" fill="#ffffff" />
              <circle cx="123" cy="85" r="1.6" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* Cute Small Anime Mouth */}
        <path d="M 97 98 Q 100 102 103 98" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />

        {/* ================================================================= */}
        {/* 6. FRONT HAIR (BANGS & SIDELOCKS)                                 */}
        {/* ================================================================= */}
        {isFemale ? (
          <g fill="url(#avatarHairGrad)">
            {/* Front Bangs */}
            <path
              d="M 56 65 C 60 40, 140 40, 144 65 C 142 86, 134 84, 126 70 C 116 80, 106 74, 100 65 C 94 74, 84 80, 74 70 C 66 84, 58 86, 56 65 Z"
            />
            {/* Ahoge Antenna Cowlick */}
            <path
              d="M 100 42 Q 115 24 105 16 Q 96 22 98 42"
              fill="none"
              stroke={hair.gradient[1]}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g fill="url(#avatarHairGrad)">
            {/* Male Spiky Anime Front Bangs */}
            <path
              d="M 55 64 L 64 80 L 72 65 L 82 82 L 92 64 L 102 85 L 112 66 L 122 84 L 132 66 L 142 78 L 145 60 C 145 35, 55 35, 55 64 Z"
            />
            {/* Hero stray lock */}
            <path
              d="M 100 40 Q 112 28 106 18 Q 96 24 98 40"
              fill="none"
              stroke={hair.gradient[1]}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* ================================================================= */}
        {/* 7. ACCESSORIES: HAIR / HEAD ITEMS                                 */}
        {/* ================================================================= */}
        {/* Silk Bow (Hair Accessory) */}
        {hairAccessory === 'silk-bow' && (
          <g filter="url(#avatarMagicalGlow)">
            <ellipse cx="64" cy="56" rx="8" ry="6" fill="url(#avatarHouseTrim)" transform="rotate(-20 64 56)" />
            <ellipse cx="76" cy="52" rx="8" ry="6" fill="url(#avatarHouseTrim)" transform="rotate(20 76 52)" />
            <circle cx="70" cy="54" r="3.5" fill="#facc15" />
          </g>
        )}

        {/* Moonflower Blossom Pin (Hair Accessory) */}
        {hairAccessory === 'blossom-clip' && (
          <g filter="url(#avatarMagicalGlow)">
            <circle cx="132" cy="60" r="5" fill="#fbcfe8" />
            <circle cx="127" cy="55" r="4" fill="#f472b6" />
            <circle cx="137" cy="55" r="4" fill="#f472b6" />
            <circle cx="132" cy="50" r="4" fill="#ec4899" />
            <circle cx="132" cy="55" r="2.5" fill="#facc15" />
          </g>
        )}

        {/* Runic Headband (Hair Accessory) */}
        {hairAccessory === 'runic-headband' && (
          <g>
            <path d="M 64 56 Q 100 48 136 56" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="51" r="3.5" fill="url(#avatarHouseTrim)" filter="url(#avatarMagicalGlow)" />
          </g>
        )}

        {/* Scholar Beret (Head Item) */}
        {headItem === 'scholar-beret' && (
          <g>
            <ellipse cx="100" cy="42" rx="38" ry="14" fill="#1e1b4b" stroke="#facc15" strokeWidth="1.5" transform="rotate(-6 100 42)" />
            <path d="M 124 38 Q 138 28 144 36" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Wizard Hat (Head Item) */}
        {headItem === 'wizard-hat' && (
          <g>
            <ellipse cx="100" cy="45" rx="46" ry="12" fill="#312e81" stroke="#a855f7" strokeWidth="1.5" />
            <polygon points="76,45 100,6 124,45" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
            {/* Hat Band & Star */}
            <ellipse cx="100" cy="43" rx="26" ry="6" fill="none" stroke="url(#avatarHouseTrim)" strokeWidth="3" />
            <polygon points="100,38 102,42 106,42 103,44 104,48 100,45 96,48 97,44 94,42 98,42" fill="#facc15" />
          </g>
        )}

        {/* Celestial Circlet (Head Item) */}
        {headItem === 'celestial-circlet' && (
          <g filter="url(#avatarMagicalGlow)">
            <path d="M 66 52 Q 100 42 134 52" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <polygon points="100,32 104,44 96,44" fill="#facc15" />
            <circle cx="100" cy="38" r="3" fill="url(#avatarHouseTrim)" />
          </g>
        )}

        {/* ================================================================= */}
        {/* 8. HANDS & HAND ITEMS                                             */}
        {/* ================================================================= */}
        {/* Left Hand (resting) */}
        <circle cx="70" cy="150" r="4.5" fill={skin.color} />

        {/* Right Hand & Held Item */}
        <g>
          {handItem === 'apprentice-wand' && (
            <g>
              {/* Wand shaft */}
              <line x1="130" y1="154" x2="162" y2="124" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
              {/* Wand glowing tip */}
              <circle cx="162" cy="124" r="5" fill="#facc15" filter="url(#avatarMagicalGlow)" />
              <circle cx="162" cy="124" r="2.5" fill="#ffffff" />
            </g>
          )}

          {handItem === 'arcane-grimoire' && (
            <g>
              {/* Spellbook */}
              <rect x="124" y="132" width="26" height="20" rx="3" fill="#4338ca" stroke="#facc15" strokeWidth="1.5" />
              <line x1="137" y1="132" x2="137" y2="152" stroke="#facc15" strokeWidth="1.5" />
              <polygon points="137,136 142,142 132,142" fill="url(#avatarHouseTrim)" />
            </g>
          )}

          {handItem === 'crystal-staff' && (
            <g>
              {/* Scepter shaft */}
              <line x1="134" y1="180" x2="150" y2="95" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              {/* Floating crystal head */}
              <polygon points="150,80 156,92 150,104 144,92" fill="url(#avatarHouseTrim)" stroke="#ffffff" strokeWidth="1" filter="url(#avatarMagicalGlow)" />
            </g>
          )}

          {/* Right Hand holding */}
          <circle cx="130" cy="150" r="4.5" fill={skin.color} />
        </g>
      </svg>
    </motion.div>
  );
}
