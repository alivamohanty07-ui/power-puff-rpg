import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ThemeEnvironment: Full-Page Illustrated RPG Sceneries
 * 
 * 100% Pure React SVG Vector Graphics with zero external URLs.
 * 
 * 1. THEMED FULL-VIEWPORT SCENERIES:
 *    - "dark-dungeon": Gothic Castle Hall (towering vaulted stone arches, brick masonry walls,
 *      iron torch sconces casting warm light, silhouette battlements, portcullis, purple mist).
 *    - "cyberpunk-neon": Cyber Citadel Skyline (layered skyscraper silhouettes, glowing window grids,
 *      angled holographic billboards, perspective highway grid, sweeping neon searchlights).
 *    - "cozy-pink" / "cozy-pinkish": Enchanted Fantasy Kingdom (rolling pastel hills, whimsical castle
 *      spires with conical pink roofs, blooming sakura trees with twisted trunks, drifting petals).
 *    - "billionaire-gold": Gilded Penthouse Palace (art-deco marble columns, gold-trimmed arches,
 *      crystal chandeliers, panoramic city night vista, cascading gold coin glints).
 * 
 * 2. STAT ATTRIBUTE OVERLAYS (WHEN STAT CARDS ARE SELECTED/INSPECTED):
 *    - "intellect": Arcane Grand Library (towering multi-tier bookshelves, illuminated scrolls, astrolabe).
 *    - "strength": Dwarven Mountain Forge (volcanic rock walls, glowing molten lava falls, giant anvil).
 *    - "vitality": Sacred Healing Glade (giant ancient tree roots, glowing emerald canopies, forest stream).
 *    - "mind": Celestial Void Temple (floating stone pagodas, reflecting pool, radiant chakra mandalas).
 * 
 * 3. VISIBILITY & READABILITY ARCHITECTURE:
 *    - Fixed full-screen backdrop with dynamic center vignette mask ensuring 100% text legibility.
 *    - Smooth cross-fade transitions via Framer Motion AnimatePresence.
 */

// =========================================================================
// 1. GOTHIC CASTLE HALL ("dark-dungeon")
// =========================================================================
function DarkDungeonScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dungeonSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#080314" />
          <stop offset="40%" stopColor="#17092c" />
          <stop offset="100%" stopColor="#04020a" />
        </linearGradient>

        <linearGradient id="dungeonPillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0c0717" />
          <stop offset="25%" stopColor="#251240" />
          <stop offset="50%" stopColor="#3b1b61" />
          <stop offset="75%" stopColor="#1a0c30" />
          <stop offset="100%" stopColor="#07030e" />
        </linearGradient>

        <radialGradient id="torchGlowLeft" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#7c2d12" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="torchGlowRight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#7c2d12" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="flameColor" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="90%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        <pattern id="stoneBrickPattern" width="120" height="60" patternUnits="userSpaceOnUse">
          <rect width="120" height="60" fill="#110a20" />
          <rect x="2" y="2" width="56" height="26" fill="#180e2d" stroke="#2c1a4d" strokeWidth="1.5" rx="2" />
          <rect x="62" y="2" width="56" height="26" fill="#150d27" stroke="#2c1a4d" strokeWidth="1.5" rx="2" />
          <rect x="32" y="32" width="56" height="26" fill="#1a0f30" stroke="#2c1a4d" strokeWidth="1.5" rx="2" />
          <rect x="-28" y="32" width="56" height="26" fill="#160d29" stroke="#2c1a4d" strokeWidth="1.5" rx="2" />
          <rect x="92" y="32" width="56" height="26" fill="#170e2b" stroke="#2c1a4d" strokeWidth="1.5" rx="2" />
        </pattern>
      </defs>

      {/* Deep Castle Sky & Distant Stone Background */}
      <rect width="1920" height="1080" fill="url(#dungeonSkyGrad)" />

      {/* Stone Brick Masonry Back Walls (Left & Right Flanks) */}
      <rect x="0" y="0" width="480" height="1080" fill="url(#stoneBrickPattern)" opacity="0.8" />
      <rect x="1440" y="0" width="480" height="1080" fill="url(#stoneBrickPattern)" opacity="0.8" />

      {/* Distant Central Gothic Hall Vista: Moonlit Castle Silhouette */}
      <g>
        {/* Distant Pale Moon in Archway Center */}
        <circle cx="960" cy="380" r="140" fill="#e9d5ff" opacity="0.18" />
        <circle cx="960" cy="380" r="90" fill="#f3e8ff" opacity="0.3" />

        {/* Distant Castle Battlements & Spire Silhouettes */}
        <path
          d="M 680 620 L 680 480 L 710 440 L 740 480 L 740 620 L 800 620 L 800 420 L 830 380 L 860 420 L 860 620 L 920 620 L 920 340 L 960 280 L 1000 340 L 1000 620 L 1060 620 L 1060 420 L 1090 380 L 1120 420 L 1120 620 L 1180 620 L 1180 440 L 1210 400 L 1240 440 L 1240 620 Z"
          fill="#06020c"
          opacity="0.9"
        />

        {/* Central Gothic Arch Framing the Moonlit Vista */}
        <path
          d="M 640 1080 L 640 540 Q 960 180 1280 540 L 1280 1080 Z"
          fill="none"
          stroke="#3b1b61"
          strokeWidth="18"
        />
        <path
          d="M 660 1080 L 660 550 Q 960 210 1260 550 L 1260 1080 Z"
          fill="none"
          stroke="#6b21a8"
          strokeWidth="6"
          opacity="0.6"
        />

        {/* Heavy Iron Portcullis Gate with Menacing Spikes */}
        <g stroke="#1e1035" strokeWidth="6" opacity="0.8">
          {/* Vertical Iron Portcullis Bars */}
          {[720, 780, 840, 900, 960, 1020, 1080, 1140, 1200].map((x) => (
            <g key={`portcullis-${x}`}>
              <line x1={x} y1="360" x2={x} y2="680" />
              {/* Pointed Bottom Spike */}
              <polygon points={`${x-6},680 ${x+6},680 ${x},705`} fill="#3b1b61" />
            </g>
          ))}
          {/* Horizontal Crossbars */}
          <line x1="680" y1="420" x2="1240" y2="420" strokeWidth="8" />
          <line x1="680" y1="500" x2="1240" y2="500" strokeWidth="8" />
          <line x1="680" y1="580" x2="1240" y2="580" strokeWidth="8" />
          <line x1="680" y1="660" x2="1240" y2="660" strokeWidth="8" />
        </g>
      </g>

      {/* Gothic Ceiling Vault Arch Ribs Spanning the Upper Viewport */}
      <g fill="none" stroke="#2e1065" strokeWidth="14" opacity="0.75">
        <path d="M 0 0 Q 480 320 960 160 Q 1440 320 1920 0" />
        <path d="M 0 120 Q 480 420 960 260 Q 1440 420 1920 120" strokeWidth="8" stroke="#581c87" />
        <path d="M 280 0 L 960 260 L 1640 0" strokeWidth="5" stroke="#7e22ce" opacity="0.5" />
      </g>

      {/* Massive Left Gothic Stone Pillars */}
      <g>
        <rect x="60" y="0" width="160" height="1080" fill="url(#dungeonPillarGrad)" />
        <rect x="260" y="0" width="140" height="1080" fill="url(#dungeonPillarGrad)" />
        {/* Pillar Fluting & Stone Joints */}
        <line x1="100" y1="0" x2="100" y2="1080" stroke="#4c1d95" strokeWidth="3" opacity="0.5" />
        <line x1="140" y1="0" x2="140" y2="1080" stroke="#7e22ce" strokeWidth="4" opacity="0.6" />
        <line x1="180" y1="0" x2="180" y2="1080" stroke="#4c1d95" strokeWidth="3" opacity="0.5" />
        {/* Carved Stone Capital Arch Blocks */}
        <polygon points="40,240 240,240 210,290 70,290" fill="#251240" stroke="#6b21a8" strokeWidth="2" />
        <polygon points="240,240 420,240 390,290 270,290" fill="#251240" stroke="#6b21a8" strokeWidth="2" />
        <polygon points="40,640 240,640 220,670 60,670" fill="#1e0f33" stroke="#581c87" strokeWidth="2" />
        <polygon points="240,640 420,640 400,670 260,670" fill="#1e0f33" stroke="#581c87" strokeWidth="2" />
      </g>

      {/* Massive Right Gothic Stone Pillars */}
      <g>
        <rect x="1520" y="0" width="140" height="1080" fill="url(#dungeonPillarGrad)" />
        <rect x="1700" y="0" width="160" height="1080" fill="url(#dungeonPillarGrad)" />
        {/* Pillar Fluting & Stone Joints */}
        <line x1="1740" y1="0" x2="1740" y2="1080" stroke="#4c1d95" strokeWidth="3" opacity="0.5" />
        <line x1="1780" y1="0" x2="1780" y2="1080" stroke="#7e22ce" strokeWidth="4" opacity="0.6" />
        <line x1="1820" y1="0" x2="1820" y2="1080" stroke="#4c1d95" strokeWidth="3" opacity="0.5" />
        {/* Carved Stone Capital Arch Blocks */}
        <polygon points="1500,240 1680,240 1650,290 1530,290" fill="#251240" stroke="#6b21a8" strokeWidth="2" />
        <polygon points="1680,240 1880,240 1850,290 1710,290" fill="#251240" stroke="#6b21a8" strokeWidth="2" />
        <polygon points="1500,640 1680,640 1660,670 1520,670" fill="#1e0f33" stroke="#581c87" strokeWidth="2" />
        <polygon points="1680,640 1880,640 1860,670 1700,670" fill="#1e0f33" stroke="#581c87" strokeWidth="2" />
      </g>

      {/* Forged Iron Torch Sconces with Warm Cast Light (Left Wall) */}
      <g transform="translate(140, 480)">
        {/* Warm Radiant Light Cone */}
        <circle cx="0" cy="-25" r="280" fill="url(#torchGlowLeft)" />
        {/* Heavy Forged Iron Armature */}
        <path d="M -30 60 Q 20 40 30 -10 L 10 -20" fill="none" stroke="#334155" strokeWidth="9" strokeLinecap="round" />
        <polygon points="10,-20 50,-20 40,10 20,10" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        {/* Animated Multi-Tiered Flame */}
        <motion.path
          d="M 30 -20 C 10 -50, 15 -85, 30 -115 C 45 -85, 50 -50, 30 -20 Z"
          fill="url(#flameColor)"
          animate={{
            scaleY: [1, 1.2, 0.9, 1.15, 1],
            scaleX: [1, 0.92, 1.08, 0.95, 1],
            opacity: [0.9, 1, 0.85, 0.95, 0.9]
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Forged Iron Torch Sconces with Warm Cast Light (Right Wall) */}
      <g transform="translate(1780, 480)">
        {/* Warm Radiant Light Cone */}
        <circle cx="0" cy="-25" r="280" fill="url(#torchGlowRight)" />
        {/* Heavy Forged Iron Armature */}
        <path d="M 30 60 Q -20 40 -30 -10 L -10 -20" fill="none" stroke="#334155" strokeWidth="9" strokeLinecap="round" />
        <polygon points="-10,-20 -50,-20 -40,10 -20,10" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        {/* Animated Multi-Tiered Flame */}
        <motion.path
          d="M -30 -20 C -50 -50, -45 -85, -30 -115 C -15 -85, -10 -50, -30 -20 Z"
          fill="url(#flameColor)"
          animate={{
            scaleY: [1.1, 0.95, 1.25, 1.0, 1.1],
            scaleX: [0.95, 1.05, 0.9, 1.05, 0.95],
            opacity: [0.95, 0.85, 1, 0.9, 0.95]
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Cobblestone Hall Floor Perspective Grid */}
      <g stroke="#2e1065" strokeWidth="2" opacity="0.65">
        <line x1="960" y1="620" x2="0" y2="1080" />
        <line x1="960" y1="620" x2="320" y2="1080" />
        <line x1="960" y1="620" x2="640" y2="1080" />
        <line x1="960" y1="620" x2="960" y2="1080" stroke="#7e22ce" strokeWidth="3" />
        <line x1="960" y1="620" x2="1280" y2="1080" />
        <line x1="960" y1="620" x2="1600" y2="1080" />
        <line x1="960" y1="620" x2="1920" y2="1080" />
        {/* Horizontal flagstone lines */}
        <line x1="420" y1="740" x2="1500" y2="740" />
        <line x1="280" y1="830" x2="1640" y2="830" strokeWidth="2.5" />
        <line x1="140" y1="940" x2="1780" y2="940" strokeWidth="3" />
        <line x1="0" y1="1060" x2="1920" y2="1060" strokeWidth="4" />
      </g>

      {/* Drifting Ethereal Purple Fog along the Floor */}
      <motion.path
        d="M 0 920 Q 480 840 960 900 Q 1440 960 1920 880 L 1920 1080 L 0 1080 Z"
        fill="#581c87"
        opacity="0.25"
        animate={{ x: [-30, 30, -30] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

// =========================================================================
// 2. CYBER CITADEL SKYLINE ("cyberpunk-neon")
// =========================================================================
function CyberpunkScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cyberSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#04010d" />
          <stop offset="50%" stopColor="#120427" />
          <stop offset="100%" stopColor="#060212" />
        </linearGradient>

        <linearGradient id="cyberHoloMoon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="cyberTowerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#080317" />
          <stop offset="50%" stopColor="#17092e" />
          <stop offset="100%" stopColor="#09031a" />
        </linearGradient>

        <linearGradient id="neonRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.95" />
        </linearGradient>

        {/* Micro Window Grid Pattern */}
        <pattern id="cyberWindows" width="30" height="24" patternUnits="userSpaceOnUse">
          <rect width="30" height="24" fill="transparent" />
          <rect x="3" y="3" width="8" height="6" fill="#06b6d4" opacity="0.6" rx="1" />
          <rect x="16" y="3" width="8" height="6" fill="#eab308" opacity="0.5" rx="1" />
          <rect x="3" y="14" width="8" height="6" fill="#ec4899" opacity="0.55" rx="1" />
          <rect x="16" y="14" width="8" height="6" fill="#38bdf8" opacity="0.7" rx="1" />
        </pattern>
      </defs>

      {/* Cyber Sky Backdrop */}
      <rect width="1920" height="1080" fill="url(#cyberSkyGrad)" />

      {/* Giant Holographic Data Moon & Cyber Rings */}
      <g opacity="0.75">
        <circle cx="960" cy="340" r="220" fill="url(#cyberHoloMoon)" stroke="#06b6d4" strokeWidth="2" strokeDasharray="16 8" />
        <circle cx="960" cy="340" r="260" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="32 12" />
        <circle cx="960" cy="340" r="290" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="8 8" />
        {/* Radial crosshairs */}
        <line x1="620" y1="340" x2="1300" y2="340" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
        <line x1="960" y1="20" x2="960" y2="660" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* Sweeping Neon Laser Beams */}
      <motion.line
        x1="200" y1="700" x2="1400" y2="0"
        stroke="#06b6d4" strokeWidth="2.5" opacity="0.6"
        animate={{ opacity: [0.2, 0.7, 0.3], strokeWidth: [1.5, 3, 1.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="1720" y1="700" x2="520" y2="0"
        stroke="#ec4899" strokeWidth="2.5" opacity="0.6"
        animate={{ opacity: [0.3, 0.8, 0.2], strokeWidth: [2, 3.5, 2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Layer 1: Distant Background Skyscraper Silhouettes */}
      <g fill="#070214" stroke="#1f073a" strokeWidth="1.5">
        <rect x="80" y="320" width="110" height="460" />
        <line x1="135" y1="220" x2="135" y2="320" stroke="#f43f5e" strokeWidth="2" />
        <circle cx="135" cy="220" r="3" fill="#f43f5e" />

        <rect x="240" y="240" width="140" height="540" />
        <polygon points="240,240 310,170 380,240" fill="#070214" />
        <line x1="310" y1="90" x2="310" y2="170" stroke="#06b6d4" strokeWidth="3" />
        <circle cx="310" cy="90" r="4" fill="#06b6d4" />

        <rect x="420" y="360" width="90" height="420" />
        <rect x="540" y="280" width="120" height="500" />
        <rect x="1260" y="260" width="130" height="520" />
        <polygon points="1260,260 1325,190 1390,260" fill="#070214" />
        <line x1="1325" y1="110" x2="1325" y2="190" stroke="#eab308" strokeWidth="3" />
        <circle cx="1325" cy="110" r="4" fill="#eab308" />

        <rect x="1420" y="340" width="110" height="440" />
        <rect x="1560" y="220" width="150" height="560" />
        <line x1="1635" y1="120" x2="1635" y2="220" stroke="#ec4899" strokeWidth="2.5" />
        <circle cx="1635" cy="120" r="4" fill="#ec4899" />
        <rect x="1740" y="380" width="100" height="400" />
      </g>

      {/* Layer 2: Midground Megastructure Towers with Glowing Windows */}
      <g>
        {/* Left Mega Arcology */}
        <rect x="120" y="360" width="220" height="440" fill="url(#cyberTowerGrad)" stroke="#06b6d4" strokeWidth="2" />
        <rect x="140" y="380" width="180" height="380" fill="url(#cyberWindows)" opacity="0.85" />

        {/* Mid-Left Spire */}
        <polygon points="380,800 380,300 460,200 540,300 540,800" fill="url(#cyberTowerGrad)" stroke="#a855f7" strokeWidth="2" />
        <rect x="410" y="320" width="100" height="420" fill="url(#cyberWindows)" opacity="0.75" />

        {/* Illuminated Skybridge connecting Left Towers */}
        <rect x="340" y="440" width="40" height="18" fill="#06b6d4" opacity="0.8" stroke="#38bdf8" strokeWidth="2" />
        <rect x="340" y="560" width="40" height="18" fill="#ec4899" opacity="0.8" stroke="#f472b6" strokeWidth="2" />

        {/* Right Mega Arcology */}
        <rect x="1580" y="340" width="240" height="460" fill="url(#cyberTowerGrad)" stroke="#ec4899" strokeWidth="2" />
        <rect x="1610" y="360" width="180" height="400" fill="url(#cyberWindows)" opacity="0.85" />

        {/* Mid-Right Spire */}
        <polygon points="1380,800 1380,280 1460,180 1540,280 1540,800" fill="url(#cyberTowerGrad)" stroke="#06b6d4" strokeWidth="2" />
        <rect x="1410" y="300" width="100" height="440" fill="url(#cyberWindows)" opacity="0.75" />

        {/* Skybridge connecting Right Towers */}
        <rect x="1540" y="420" width="40" height="18" fill="#eab308" opacity="0.8" stroke="#fef08a" strokeWidth="2" />
      </g>

      {/* Giant Angled Holographic Billboards - Reduced opacity to 12% to prevent clutter behind hero headline */}
      <g opacity="0.12">
        {/* Left Holographic Billboard */}
        <g transform="translate(180, 520) rotate(-6)">
          <rect x="0" y="0" width="220" height="110" rx="12" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeWidth="3" />
          <rect x="8" y="8" width="204" height="94" rx="8" fill="#08031a" fillOpacity="0.7" />
          <text x="110" y="46" fill="#22d3ee" fontSize="16" fontFamily="monospace" fontWeight="900" textAnchor="middle" letterSpacing="2">
            CYBER PROTOCOL
          </text>
          <text x="110" y="78" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="3">
            CYBER CITADEL // 2026
          </text>
          {/* Billboard Frame Neon Brackets */}
          <line x1="-5" y1="0" x2="-5" y2="25" stroke="#ec4899" strokeWidth="4" />
          <line x1="225" y1="85" x2="225" y2="110" stroke="#ec4899" strokeWidth="4" />
        </g>

        {/* Right Holographic Billboard */}
        <g transform="translate(1520, 500) rotate(5)">
          <rect x="0" y="0" width="220" height="110" rx="12" fill="#ec4899" fillOpacity="0.12" stroke="#ec4899" strokeWidth="3" />
          <rect x="8" y="8" width="204" height="94" rx="8" fill="#08031a" fillOpacity="0.7" />
          <text x="110" y="46" fill="#f472b6" fontSize="16" fontFamily="monospace" fontWeight="900" textAnchor="middle" letterSpacing="2">
            OVERDRIVE // ACTIVE
          </text>
          <text x="110" y="78" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="3">
            SYSTEM // READY
          </text>
          {/* Vertical Neon Status Indicator Strip */}
          <rect x="235" y="0" width="32" height="110" rx="6" fill="#eab308" fillOpacity="0.2" stroke="#eab308" strokeWidth="2" />
          <text x="251" y="24" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>
          <text x="251" y="42" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">C</text>
          <text x="251" y="60" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>
          <text x="251" y="78" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">I</text>
          <text x="251" y="96" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">V</text>
        </g>
      </g>

      {/* Perspective 3D Elevated Cyber Grid Highway Runway */}
      <g stroke="url(#neonRoadGrad)" strokeWidth="2.5" opacity="0.85">
        {/* Horizon Vanishing Point: (960, 680) */}
        <line x1="960" y1="680" x2="0" y2="1080" strokeWidth="4" />
        <line x1="960" y1="680" x2="280" y2="1080" />
        <line x1="960" y1="680" x2="560" y2="1080" />
        <line x1="960" y1="680" x2="800" y2="1080" />
        <line x1="960" y1="680" x2="960" y2="1080" stroke="#f43f5e" strokeWidth="5" />
        <line x1="960" y1="680" x2="1120" y2="1080" />
        <line x1="960" y1="680" x2="1360" y2="1080" />
        <line x1="960" y1="680" x2="1640" y2="1080" />
        <line x1="960" y1="680" x2="1920" y2="1080" strokeWidth="4" />

        {/* Perspective Highway Horizontal Bars */}
        <line x1="680" y1="730" x2="1240" y2="730" strokeWidth="2" />
        <line x1="520" y1="790" x2="1400" y2="790" strokeWidth="2.5" />
        <line x1="360" y1="860" x2="1560" y2="860" strokeWidth="3" />
        <line x1="180" y1="950" x2="1740" y2="950" strokeWidth="4" />
        <line x1="0" y1="1060" x2="1920" y2="1060" strokeWidth="5" />
      </g>
    </svg>
  );
}

// =========================================================================
// 3. ENCHANTED FANTASY KINGDOM ("cozy-pink" / "cozy-pinkish")
// =========================================================================
function CozyPinkScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cozySkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0b36" />
          <stop offset="40%" stopColor="#500724" />
          <stop offset="75%" stopColor="#9d174d" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>

        <linearGradient id="castleWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4c0519" />
          <stop offset="50%" stopColor="#831843" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>

        <linearGradient id="conicalRoofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#be185d" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>

        <linearGradient id="rollingHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#701a75" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
      </defs>

      {/* Dreamy Sunset Sky */}
      <rect width="1920" height="1080" fill="url(#cozySkyGrad)" />

      {/* Layered Whimsical Puffy Clouds */}
      <g fill="#fbcfe8" opacity="0.35">
        <motion.path
          d="M 180 260 C 140 180, 240 120, 340 160 C 400 90, 520 110, 560 190 C 640 180, 700 250, 640 320 C 580 380, 200 360, 180 260 Z"
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 1280 220 C 1240 150, 1340 100, 1420 140 C 1500 80, 1620 90, 1660 170 C 1740 160, 1800 230, 1750 300 C 1680 350, 1300 330, 1280 220 Z"
          animate={{ x: [0, -45, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Distant Rolling Hills */}
      <path
        d="M 0 760 Q 480 620 960 700 Q 1440 600 1920 740 L 1920 1080 L 0 1080 Z"
        fill="url(#rollingHillGrad)"
        opacity="0.8"
      />
      <path
        d="M 0 840 Q 420 740 960 800 Q 1500 720 1920 860 L 1920 1080 L 0 1080 Z"
        fill="#260438"
      />

      {/* Central Fairytale Castle with Multiple Spired Towers */}
      <g transform="translate(680, 320)">
        {/* Central Castle Keep Base */}
        <rect x="140" y="240" width="280" height="260" fill="url(#castleWallGrad)" stroke="#f472b6" strokeWidth="2" />
        {/* Castle Battlements */}
        {[140, 180, 220, 260, 300, 340, 380].map((bx) => (
          <rect key={`battlement-${bx}`} x={bx} y="220" width="24" height="24" fill="#831843" stroke="#f472b6" strokeWidth="1" />
        ))}
        {/* Stained Glass Rose Window */}
        <circle cx="280" cy="320" r="32" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="3" opacity="0.9" />
        <circle cx="280" cy="320" r="18" fill="#fda4af" stroke="#f43f5e" strokeWidth="2" />

        {/* Tower 1 (Left Tall Spire) */}
        <rect x="80" y="160" width="70" height="340" fill="url(#castleWallGrad)" stroke="#f472b6" strokeWidth="1.5" />
        <polygon points="65,160 115,10 165,160" fill="url(#conicalRoofGrad)" stroke="#fbcfe8" strokeWidth="2" />
        {/* Golden Ball Finial & Waving Pennant */}
        <circle cx="115" cy="10" r="4" fill="#facc15" />
        <motion.polygon
          points="115,10 160,20 115,30"
          fill="#f43f5e"
          animate={{ scaleX: [1, 1.25, 0.9, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tower 2 (Right Tall Spire) */}
        <rect x="410" y="160" width="70" height="340" fill="url(#castleWallGrad)" stroke="#f472b6" strokeWidth="1.5" />
        <polygon points="395,160 445,10 495,160" fill="url(#conicalRoofGrad)" stroke="#fbcfe8" strokeWidth="2" />
        <circle cx="445" cy="10" r="4" fill="#facc15" />
        <motion.polygon
          points="445,10 490,20 445,30"
          fill="#f43f5e"
          animate={{ scaleX: [1, 1.25, 0.9, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center Grand Spire (Highest Peak) */}
        <rect x="230" y="100" width="100" height="140" fill="url(#castleWallGrad)" stroke="#f472b6" strokeWidth="2" />
        <polygon points="215,100 280,-80 345,100" fill="url(#conicalRoofGrad)" stroke="#fbcfe8" strokeWidth="2.5" />
        <circle cx="280" cy="-80" r="6" fill="#facc15" />
        <motion.polygon
          points="280,-80 340,-68 280,-56"
          fill="#facc15"
          animate={{ scaleX: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Arched Castle Gateway Door */}
        <path d="M 240 500 L 240 420 Q 280 380 320 420 L 320 500 Z" fill="#20040f" stroke="#fb7185" strokeWidth="3" />
      </g>

      {/* Majestic Blooming Sakura Trees (Left Foreground) */}
      <g>
        {/* Gnarled Dark Wood Trunk */}
        <path
          d="M 0 1080 Q 120 780 180 620 Q 240 480 380 360 Q 520 280 660 320"
          fill="none"
          stroke="#3d091e"
          strokeWidth="48"
          strokeLinecap="round"
        />
        <path
          d="M 180 620 Q 280 600 420 660"
          fill="none"
          stroke="#3d091e"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M 380 360 Q 420 180 540 140"
          fill="none"
          stroke="#3d091e"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* Lush Cherry Blossom Petal Canopy Clusters */}
        <circle cx="660" cy="320" r="95" fill="#fbcfe8" opacity="0.9" />
        <circle cx="630" cy="280" r="80" fill="#f472b6" opacity="0.85" />
        <circle cx="540" cy="140" r="85" fill="#fbcfe8" opacity="0.9" />
        <circle cx="500" cy="110" r="70" fill="#fda4af" opacity="0.8" />
        <circle cx="420" cy="660" r="80" fill="#fbcfe8" opacity="0.9" />
        <circle cx="390" cy="620" r="65" fill="#f472b6" opacity="0.85" />
        <circle cx="320" cy="380" r="85" fill="#fbcfe8" opacity="0.9" />
      </g>

      {/* Majestic Blooming Sakura Trees (Right Foreground) */}
      <g>
        <path
          d="M 1920 1080 Q 1800 760 1720 600 Q 1640 460 1500 340 Q 1360 260 1240 300"
          fill="none"
          stroke="#3d091e"
          strokeWidth="48"
          strokeLinecap="round"
        />
        <path
          d="M 1720 600 Q 1620 580 1480 640"
          fill="none"
          stroke="#3d091e"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M 1500 340 Q 1460 160 1340 120"
          fill="none"
          stroke="#3d091e"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* Lush Blossom Canopy Clusters */}
        <circle cx="1240" cy="300" r="95" fill="#fbcfe8" opacity="0.9" />
        <circle cx="1270" cy="260" r="80" fill="#f472b6" opacity="0.85" />
        <circle cx="1340" cy="120" r="85" fill="#fbcfe8" opacity="0.9" />
        <circle cx="1380" cy="90" r="70" fill="#fda4af" opacity="0.8" />
        <circle cx="1480" cy="640" r="80" fill="#fbcfe8" opacity="0.9" />
        <circle cx="1580" cy="360" r="85" fill="#fbcfe8" opacity="0.9" />
      </g>

      {/* Animated Floating Sakura Petals Drifting in the Gentle Breeze */}
      {[
        { x: 420, y: 340, d: 0 },
        { x: 680, y: 220, d: 1 },
        { x: 920, y: 460, d: 2 },
        { x: 1240, y: 320, d: 0.5 },
        { x: 1480, y: 520, d: 1.5 },
        { x: 800, y: 680, d: 2.5 }
      ].map((p, i) => (
        <motion.path
          key={`petal-${i}`}
          d="M 0 0 C 12 -10, 20 0, 16 12 C 12 24, 0 16, 0 0 Z"
          fill="#fbcfe8"
          stroke="#f472b6"
          strokeWidth="1"
          style={{ x: p.x, y: p.y }}
          animate={{
            x: [p.x, p.x + 80, p.x + 160],
            y: [p.y, p.y + 60, p.y + 120],
            rotate: [0, 45, 90],
            opacity: [0.3, 0.9, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: p.d, ease: "linear" }}
        />
      ))}
    </svg>
  );
}

// =========================================================================
// 4. GILDED PENTHOUSE PALACE ("billionaire-gold")
// =========================================================================
function BillionaireScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="penthouseNightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#020205" />
          <stop offset="60%" stopColor="#0b0802" />
          <stop offset="100%" stopColor="#1a1203" />
        </linearGradient>

        <linearGradient id="goldMarblePillar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="25%" stopColor="#1c1605" />
          <stop offset="50%" stopColor="#42340b" />
          <stop offset="75%" stopColor="#1a1403" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        <linearGradient id="gold24kGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#713f12" />
          <stop offset="35%" stopColor="#eab308" />
          <stop offset="70%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        <radialGradient id="chandelierRadial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#eab308" stopOpacity="0.3" />
          <stop offset="80%" stopColor="#854d0e" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Panoramic Penthouse Night City Vista Background */}
      <rect width="1920" height="1080" fill="url(#penthouseNightSky)" />

      {/* Glittering Golden City Lights Outside Panoramic Windows */}
      <g opacity="0.6">
        {[200, 360, 520, 680, 840, 1000, 1160, 1320, 1480, 1640].map((cx, i) => (
          <rect 
            key={`city-tower-${i}`} 
            x={cx} 
            y={360 + (i % 4) * 40} 
            width={70 + (i % 3) * 20} 
            height={400} 
            fill="#080603" 
            stroke="#ca8a04" 
            strokeWidth="1" 
          />
        ))}
        {/* Glistening window lights */}
        {[...Array(60)].map((_, i) => (
          <circle
            key={`glint-window-${i}`}
            cx={220 + (i * 27) % 1500}
            cy={420 + (i * 37) % 320}
            r={1.5}
            fill="#fef08a"
            opacity={0.7}
          />
        ))}
      </g>

      {/* Grand Art-Deco Fluted Marble Columns (Left Flank) */}
      <g>
        <rect x="80" y="0" width="160" height="1080" fill="url(#goldMarblePillar)" stroke="#eab308" strokeWidth="2" />
        <rect x="280" y="0" width="140" height="1080" fill="url(#goldMarblePillar)" stroke="#ca8a04" strokeWidth="1.5" />
        {/* Fluting Channels */}
        <line x1="120" y1="0" x2="120" y2="1080" stroke="#fef08a" strokeWidth="2" opacity="0.5" />
        <line x1="160" y1="0" x2="160" y2="1080" stroke="#facc15" strokeWidth="3" opacity="0.7" />
        <line x1="200" y1="0" x2="200" y2="1080" stroke="#fef08a" strokeWidth="2" opacity="0.5" />
        {/* Stepped Art Deco 24k Gold Capitals */}
        <polygon points="50,180 270,180 250,230 70,230" fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
        <polygon points="65,230 255,230 240,265 80,265" fill="url(#gold24kGrad)" />
        <polygon points="250,180 450,180 430,230 270,230" fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
      </g>

      {/* Grand Art-Deco Fluted Marble Columns (Right Flank) */}
      <g>
        <rect x="1500" y="0" width="140" height="1080" fill="url(#goldMarblePillar)" stroke="#ca8a04" strokeWidth="1.5" />
        <rect x="1680" y="0" width="160" height="1080" fill="url(#goldMarblePillar)" stroke="#eab308" strokeWidth="2" />
        {/* Fluting Channels */}
        <line x1="1720" y1="0" x2="1720" y2="1080" stroke="#fef08a" strokeWidth="2" opacity="0.5" />
        <line x1="1760" y1="0" x2="1760" y2="1080" stroke="#facc15" strokeWidth="3" opacity="0.7" />
        <line x1="1800" y1="0" x2="1800" y2="1080" stroke="#fef08a" strokeWidth="2" opacity="0.5" />
        {/* Stepped Art Deco 24k Gold Capitals */}
        <polygon points="1470,180 1670,180 1650,230 1490,230" fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
        <polygon points="1650,180 1870,180 1850,230 1670,230" fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
        <polygon points="1665,230 1855,230 1840,265 1680,265" fill="url(#gold24kGrad)" />
      </g>

      {/* Overhead Art-Deco Sunburst Fan Vaults & Gilded Archways */}
      <g stroke="#eab308" strokeWidth="2" fill="none" opacity="0.7">
        <path d="M 0 0 L 960 220 L 1920 0" strokeWidth="4" />
        <path d="M 180 0 L 960 220 L 1740 0" strokeWidth="2.5" />
        <path d="M 360 0 L 960 220 L 1560 0" />
        <path d="M 540 0 L 960 220 L 1380 0" />
        <circle cx="960" cy="0" r="140" strokeWidth="3" />
        <circle cx="960" cy="0" r="220" strokeWidth="2" strokeDasharray="8 8" />
      </g>

      {/* Grand Multi-Tiered Crystal Chandeliers */}
      <g transform="translate(960, 180)">
        {/* Radiant Chandelier Light Glow */}
        <circle cx="0" cy="60" r="240" fill="url(#chandelierRadial)" />
        {/* Brass Chain & Support Armature */}
        <line x1="0" y1="-180" x2="0" y2="0" stroke="#ca8a04" strokeWidth="6" />
        <ellipse cx="0" cy="0" rx="90" ry="16" fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
        <ellipse cx="0" cy="40" rx="60" ry="12" fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
        <ellipse cx="0" cy="75" rx="35" ry="8" fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
        {/* Hanging Faceted Crystal Drops */}
        {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((cx) => (
          <polygon key={`cryst-1-${cx}`} points={`${cx},0 ${cx-4},25 ${cx},32 ${cx+4},25`} fill="#ffffff" stroke="#fef08a" strokeWidth="1" opacity="0.9" />
        ))}
        {[-50, -30, -10, 10, 30, 50].map((cx) => (
          <polygon key={`cryst-2-${cx}`} points={`${cx},40 ${cx-4},62 ${cx},68 ${cx+4},62`} fill="#ffffff" stroke="#fef08a" strokeWidth="1" opacity="0.9" />
        ))}
        {[-25, 0, 25].map((cx) => (
          <polygon key={`cryst-3-${cx}`} points={`${cx},75 ${cx-5},100 ${cx},108 ${cx+5},100`} fill="#ffffff" stroke="#fef08a" strokeWidth="1.5" />
        ))}
      </g>

      {/* Cascading Floating 24k Gold Coins & Starburst Glints */}
      {[
        { x: 480, y: 380, s: 22, d: 0 },
        { x: 620, y: 640, s: 18, d: 1 },
        { x: 1320, y: 440, s: 24, d: 0.5 },
        { x: 1440, y: 680, s: 19, d: 1.5 },
        { x: 1040, y: 560, s: 16, d: 2 }
      ].map((c, i) => (
        <motion.g
          key={`gold-coin-${i}`}
          transform={`translate(${c.x}, ${c.y})`}
          animate={{
            y: [c.y, c.y - 30, c.y],
            rotateY: [0, 180, 360],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: c.d, ease: "easeInOut" }}
        >
          <circle cx="0" cy="0" r={c.s} fill="url(#gold24kGrad)" stroke="#fef08a" strokeWidth="2" />
          <circle cx="0" cy="0" r={c.s - 4} fill="none" stroke="#713f12" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="0" y={c.s / 3} fill="#713f12" fontSize={c.s} fontWeight="900" textAnchor="middle">G</text>
        </motion.g>
      ))}
    </svg>
  );
}

// =========================================================================
// 5. ARCANE GRAND LIBRARY ("intellect")
// =========================================================================
function IntellectLibraryScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="libSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#03071e" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="mahoganyPillar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1c0d02" />
          <stop offset="50%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#1c0d02" />
        </linearGradient>

        <radialGradient id="astrolabeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#312e81" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1920" height="1080" fill="url(#libSkyGrad)" />

      {/* Giant Luminous Celestial Astrolabe in Center-Back */}
      <g transform="translate(960, 420)">
        <circle cx="0" cy="0" r="280" fill="url(#astrolabeGlow)" />
        <circle cx="0" cy="0" r="260" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="16 8" opacity="0.6" />
        <circle cx="0" cy="0" r="210" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="24 12" opacity="0.7" />
        <circle cx="0" cy="0" r="160" fill="none" stroke="#c7d2fe" strokeWidth="2" opacity="0.8" />
        {/* Constellation Star Coordinates */}
        <polygon points="0,-160 138,80 -138,80" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 4" />
        <polygon points="0,160 138,-80 -138,-80" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 4" />
      </g>

      {/* Multi-Tiered Towering Floor-to-Ceiling Bookshelves (Left) */}
      <g>
        <rect x="40" y="0" width="380" height="1080" fill="url(#mahoganyPillar)" stroke="#b45309" strokeWidth="2" />
        {/* Shelf Levels */}
        {[140, 280, 420, 560, 700, 840, 980].map((sy) => (
          <g key={`left-shelf-${sy}`}>
            {/* Shelf Plank */}
            <rect x="40" y={sy} width="380" height="20" fill="#78350f" stroke="#d97706" strokeWidth="1.5" />
            {/* Rows of Leather-Bound Spellbooks */}
            {[...Array(14)].map((_, bi) => {
              const colors = ['#1e3a8a', '#991b1b', '#065f46', '#78350f', '#581c87', '#0f766e'];
              const c = colors[bi % colors.length];
              const bw = 18 + (bi % 3) * 4;
              const bh = 85 + (bi % 4) * 8;
              return (
                <rect
                  key={`book-l-${sy}-${bi}`}
                  x={55 + bi * 25}
                  y={sy - bh}
                  width={bw}
                  height={bh}
                  fill={c}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  rx="2"
                />
              );
            })}
          </g>
        ))}
        {/* Rolling Brass Library Ladder */}
        <g stroke="#f59e0b" strokeWidth="4">
          <line x1="180" y1="80" x2="260" y2="1080" />
          <line x1="230" y1="80" x2="310" y2="1080" />
          {[200, 320, 440, 560, 680, 800, 920, 1040].map((ry) => (
            <line key={`ladder-rung-${ry}`} x1={180 + (ry - 80) * (80/1000)} y1={ry} x2={230 + (ry - 80) * (80/1000)} y2={ry} strokeWidth="3" />
          ))}
        </g>
      </g>

      {/* Multi-Tiered Towering Floor-to-Ceiling Bookshelves (Right) */}
      <g>
        <rect x="1500" y="0" width="380" height="1080" fill="url(#mahoganyPillar)" stroke="#b45309" strokeWidth="2" />
        {[140, 280, 420, 560, 700, 840, 980].map((sy) => (
          <g key={`right-shelf-${sy}`}>
            <rect x="1500" y={sy} width="380" height="20" fill="#78350f" stroke="#d97706" strokeWidth="1.5" />
            {[...Array(14)].map((_, bi) => {
              const colors = ['#581c87', '#1e3a8a', '#991b1b', '#065f46', '#d97706', '#0284c7'];
              const c = colors[bi % colors.length];
              const bw = 18 + (bi % 3) * 4;
              const bh = 85 + (bi % 4) * 8;
              return (
                <rect
                  key={`book-r-${sy}-${bi}`}
                  x={1515 + bi * 25}
                  y={sy - bh}
                  width={bw}
                  height={bh}
                  fill={c}
                  stroke="#fbbf24"
                  strokeWidth="1"
                  rx="2"
                />
              );
            })}
          </g>
        ))}
      </g>

      {/* Floating Illuminated Grimoire & Ancient Glowing Scrolls */}
      <motion.g
        transform="translate(960, 640)"
        animate={{ y: [640, 610, 640], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Open Grimoire Spine */}
        <polygon points="-60,0 0,15 60,0 60,70 0,85 -60,70" fill="#1e1b4b" stroke="#facc15" strokeWidth="2" />
        {/* Left Page */}
        <path d="M -60 0 Q -30 -15 0 15 L 0 85 Q -30 65 -60 70 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        {/* Right Page */}
        <path d="M 0 15 Q 30 -15 60 0 L 60 70 Q 30 65 0 85 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
        {/* Glowing Arcane Glyphs on Pages */}
        <line x1="-48" y1="25" x2="-12" y2="25" stroke="#6366f1" strokeWidth="2" />
        <line x1="-48" y1="40" x2="-16" y2="40" stroke="#6366f1" strokeWidth="2" />
        <line x1="12" y1="25" x2="48" y2="25" stroke="#6366f1" strokeWidth="2" />
        <line x1="16" y1="40" x2="48" y2="40" stroke="#6366f1" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

// =========================================================================
// 6. DWARVEN MOUNTAIN FORGE ("strength")
// =========================================================================
function StrengthForgeScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="forgeCaveSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#080202" />
          <stop offset="50%" stopColor="#200505" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>

        <linearGradient id="lavaStream" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        <radialGradient id="anvilForgeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#dc2626" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1920" height="1080" fill="url(#forgeCaveSky)" />

      {/* Jagged Volcanic Rock Cavern Walls */}
      <polygon points="0,0 280,0 240,400 320,600 220,850 360,1080 0,1080" fill="#180707" stroke="#450a0a" strokeWidth="3" />
      <polygon points="1920,0 1640,0 1680,400 1600,600 1700,850 1560,1080 1920,1080" fill="#180707" stroke="#450a0a" strokeWidth="3" />

      {/* Cascading Molten Lava Falls (Left & Right Fissures) */}
      <motion.path
        d="M 220 0 Q 260 300 240 600 Q 280 850 250 1080"
        fill="none"
        stroke="url(#lavaStream)"
        strokeWidth="28"
        strokeLinecap="round"
        animate={{ strokeWidth: [24, 32, 24] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M 1700 0 Q 1660 300 1680 600 Q 1640 850 1670 1080"
        fill="none"
        stroke="url(#lavaStream)"
        strokeWidth="28"
        strokeLinecap="round"
        animate={{ strokeWidth: [28, 36, 28] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Central Dwarven Forge Furnace */}
      <g transform="translate(960, 480)">
        <circle cx="0" cy="0" r="280" fill="url(#anvilForgeGlow)" />
        {/* Massive Basalt Furnace Arch */}
        <path d="M -180 200 L -180 40 Q 0 -120 180 40 L 180 200 Z" fill="#0c0404" stroke="#f97316" strokeWidth="6" />
        <ellipse cx="0" cy="80" rx="120" ry="70" fill="url(#lavaStream)" />
      </g>

      {/* Colossal Obsidian & Iron Anvil with Legendary Warhammer */}
      <g transform="translate(960, 720)">
        {/* Stone Anvil Base Plinth */}
        <polygon points="-160,180 160,180 120,100 -120,100" fill="#1c0707" stroke="#7f1d1d" strokeWidth="3" />
        {/* Forged Steel Anvil Horn & Body */}
        <path d="M -180 60 L -110 30 L 110 30 L 140 50 L 170 60 L 100 90 L -120 90 Z" fill="#2d0a0a" stroke="#f97316" strokeWidth="3" />
        
        {/* Legendary Dwarven Warhammer Resting on Anvil */}
        <g stroke="#f59e0b" strokeWidth="2">
          {/* Heavy Steel Hammerhead */}
          <rect x="-40" y="-30" width="80" height="50" rx="6" fill="#450a0a" />
          <polygon points="-45,-15 -25,-15 -35,-3" fill="#facc15" />
          <polygon points="45,-15 25,-15 35,-3" fill="#facc15" />
          {/* Ironbound Wooden Haft */}
          <line x1="0" y1="20" x2="0" y2="120" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        </g>
      </g>

      {/* Flying Molten Forge Sparks & Embers */}
      {[...Array(16)].map((_, i) => (
        <motion.circle
          key={`forge-spark-${i}`}
          cx={800 + (i * 45) % 360}
          cy={800}
          r={2 + (i % 3)}
          fill="#fef08a"
          animate={{
            y: [-20, -260 - (i * 20), -400],
            x: [(i % 2 === 0 ? 30 : -30), (i % 2 === 0 ? -40 : 40)],
            opacity: [0.9, 1, 0]
          }}
          transition={{ duration: 2.2 + (i % 3), repeat: Infinity, delay: i * 0.2, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

// =========================================================================
// 7. SACRED HEALING GLADE ("vitality")
// =========================================================================
function VitalityGladeScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gladeSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#022c22" />
          <stop offset="60%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>

        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#042f2e" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      <rect width="1920" height="1080" fill="url(#gladeSky)" />

      {/* Sunbeams (God Rays) Filtering Through the Forest Canopy */}
      <g opacity="0.35">
        <polygon points="300,0 480,0 800,1080 500,1080" fill="#a7f3d0" />
        <polygon points="900,0 1060,0 1380,1080 1140,1080" fill="#a7f3d0" />
        <polygon points="1440,0 1620,0 1880,1080 1640,1080" fill="#a7f3d0" />
      </g>

      {/* Giant Ancient World Tree Roots & Canopies (Left Flank) */}
      <g>
        <path
          d="M 0 1080 Q 140 780 180 540 Q 240 280 440 120 L 0 0 Z"
          fill="#062d22"
          stroke="#10b981"
          strokeWidth="12"
        />
        {/* Arching Root Spans */}
        <path d="M 180 740 Q 320 700 480 840" fill="none" stroke="#064e3b" strokeWidth="32" strokeLinecap="round" />
        <circle cx="440" cy="120" r="110" fill="#059669" opacity="0.85" />
        <circle cx="360" cy="80" r="90" fill="#34d399" opacity="0.75" />
      </g>

      {/* Giant Ancient World Tree Roots & Canopies (Right Flank) */}
      <g>
        <path
          d="M 1920 1080 Q 1780 780 1740 540 Q 1680 280 1480 120 L 1920 0 Z"
          fill="#062d22"
          stroke="#10b981"
          strokeWidth="12"
        />
        <path d="M 1740 740 Q 1600 700 1440 840" fill="none" stroke="#064e3b" strokeWidth="32" strokeLinecap="round" />
        <circle cx="1480" cy="120" r="110" fill="#059669" opacity="0.85" />
        <circle cx="1560" cy="80" r="90" fill="#34d399" opacity="0.75" />
      </g>

      {/* Sparkling Enchanted Forest Stream Winding Down Center */}
      <path
        d="M 960 520 Q 880 700 940 840 Q 1020 960 960 1080 L 1080 1080 Q 1160 940 1060 840 Q 980 700 1020 520 Z"
        fill="url(#streamGrad)"
        opacity="0.8"
      />

      {/* Floating Luminous Healing Spores & Fireflies */}
      {[...Array(18)].map((_, i) => (
        <motion.circle
          key={`spore-${i}`}
          cx={400 + (i * 65) % 1100}
          cy={300 + (i * 45) % 600}
          r={3 + (i % 3)}
          fill="#6ee7b7"
          animate={{
            y: [0, -35, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 3.5 + (i % 4), repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

// =========================================================================
// 8. CELESTIAL VOID TEMPLE ("mind")
// =========================================================================
function MindTempleScenery() {
  return (
    <svg 
      className="w-full h-full object-cover" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="voidCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#090518" />
          <stop offset="100%" stopColor="#020008" />
        </radialGradient>

        <radialGradient id="mandalaAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1920" height="1080" fill="url(#voidCore)" />

      {/* Starlit Celestial Nebula Clouds */}
      <g opacity="0.45">
        <circle cx="480" cy="320" r="320" fill="#4338ca" filter="blur(60px)" />
        <circle cx="1440" cy="380" r="340" fill="#0891b2" filter="blur(70px)" />
      </g>

      {/* Sacred Geometry Mandala & Chakra Aura Ring */}
      <g transform="translate(960, 420)">
        <circle cx="0" cy="0" r="280" fill="url(#mandalaAura)" />
        <circle cx="0" cy="0" r="260" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="12 6" />
        <circle cx="0" cy="0" r="200" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="20 10" />
        <circle cx="0" cy="0" r="140" fill="none" stroke="#e0e7ff" strokeWidth="1.5" />

        {/* Concentric Flower of Life Circles */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <circle
              key={`flower-${deg}`}
              cx={80 * Math.cos(rad)}
              cy={80 * Math.sin(rad)}
              r="80"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="1.5"
              opacity="0.6"
            />
          );
        })}
      </g>

      {/* Floating Weightless Stone Pagoda Shrines (Left) */}
      <motion.g
        transform="translate(240, 420)"
        animate={{ y: [420, 390, 420] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Pagoda Tier 1 */}
        <polygon points="-80,80 80,80 60,40 -60,40" fill="#1e1b4b" stroke="#22d3ee" strokeWidth="2" />
        {/* Pagoda Tier 2 */}
        <polygon points="-60,40 60,40 40,0 -40,0" fill="#312e81" stroke="#818cf8" strokeWidth="2" />
        {/* Pagoda Tier 3 */}
        <polygon points="-40,0 40,0 0,-40" fill="#4338ca" stroke="#c7d2fe" strokeWidth="2" />
        {/* Floating Stone Base */}
        <polygon points="-90,80 90,80 50,140 -50,140" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      </motion.g>

      {/* Floating Weightless Stone Pagoda Shrines (Right) */}
      <motion.g
        transform="translate(1680, 420)"
        animate={{ y: [420, 450, 420] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon points="-80,80 80,80 60,40 -60,40" fill="#1e1b4b" stroke="#22d3ee" strokeWidth="2" />
        <polygon points="-60,40 60,40 40,0 -40,0" fill="#312e81" stroke="#818cf8" strokeWidth="2" />
        <polygon points="-40,0 40,0 0,-40" fill="#4338ca" stroke="#c7d2fe" strokeWidth="2" />
        <polygon points="-90,80 90,80 50,140 -50,140" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      </motion.g>

      {/* Reflecting Pool with Expanding Concentric Water Ripples */}
      <g transform="translate(960, 850)">
        <ellipse cx="0" cy="0" rx="600" ry="160" fill="#061224" stroke="#0891b2" strokeWidth="2" />
        {[80, 180, 300, 450].map((r, i) => (
          <motion.ellipse
            key={`ripple-${i}`}
            cx="0"
            cy="0"
            rx={r}
            ry={r * 0.28}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            animate={{
              rx: [r, r + 70],
              ry: [(r * 0.28), (r + 70) * 0.28],
              opacity: [0.8, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
          />
        ))}
      </g>
    </svg>
  );
}

// =========================================================================
// MAIN THEME ENVIRONMENT DISPATCHER
// =========================================================================
export default function ThemeEnvironment({ 
  currentTheme = 'dark-dungeon', 
  selectedAttribute = 'intellect',
  activeSection = 'about',
  inspectedCard = null
}) {
  // Determine which concrete scenery to display:
  // 1. If an attribute card is specifically hovered/inspected, or we are in the attributes section
  const isAttributeActive = 
    ['intellect', 'strength', 'vitality', 'mind'].includes(inspectedCard) ||
    activeSection === 'attributes';

  const activeAttrKey = ['intellect', 'strength', 'vitality', 'mind'].includes(inspectedCard)
    ? inspectedCard
    : selectedAttribute;

  // Active theme key (normalized for cozy-pinkish)
  const normalizedTheme = currentTheme === 'cozy-pinkish' ? 'cozy-pink' : currentTheme;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* Dynamic Animated Scenery Transitions via AnimatePresence */}
      <AnimatePresence mode="wait">
        {isAttributeActive ? (
          <motion.div
            key={`scenery-attr-${activeAttrKey}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.82, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {activeAttrKey === 'intellect' && <IntellectLibraryScenery />}
            {activeAttrKey === 'strength' && <StrengthForgeScenery />}
            {activeAttrKey === 'vitality' && <VitalityGladeScenery />}
            {activeAttrKey === 'mind' && <MindTempleScenery />}
          </motion.div>
        ) : (
          <motion.div
            key={`scenery-theme-${normalizedTheme}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {normalizedTheme === 'dark-dungeon' && <DarkDungeonScenery />}
            {normalizedTheme === 'cyberpunk-neon' && <CyberpunkScenery />}
            {normalizedTheme === 'cozy-pink' && <CozyPinkScenery />}
            {normalizedTheme === 'billionaire-gold' && <BillionaireScenery />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Central Radial Vignette: Ensures foreground cards & text remain 100% readable & crisp */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 48%, var(--rpg-bg) 0%, rgba(10, 10, 20, 0.45) 60%, transparent 100%)',
          opacity: 0.88
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, var(--rpg-bg) 0%, transparent 15%, transparent 85%, var(--rpg-bg) 100%)',
          opacity: 0.7
        }}
      />

    </div>
  );
}
