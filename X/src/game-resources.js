// ============= 遊戲資源管理系統 =============
// 包含所有角色、場景的圖片和數據

const gameResources = {
    // ============= 角色圖片資源 =============
    characters: {
        chenFeng: {
            name: '陳風',
            emoji: '👨',
            ascii: `
    ╱\\___/\\
   (oo)_(oo)
    \\ ~ /
     |_|
    /| |\\
   / | | \\
    | |
   /| |\\
  / | | \\
     | |
    \\ | /
     \\|/`,
            svgUrl: '#chenFeng-svg',
            description: '22歲上班族，平凡踏實，內心充滿疲憊與希望'
        },
        
        sunLili: {
            name: '孫莉莉',
            emoji: '👩‍💼',
            ascii: `
    ╱\\___/\\
   (@@)_(@@)
    \\ ♦ /
     |_|
    /| |\\
   / | | \\
    |♦|
   /| |\\
  / | | \\
     | |
    \\ | /
     \\|/`,
            svgUrl: '#sunLili-svg',
            description: '26歲集團總裁，冷靜自信，商業帝國的掌舵者'
        },
        
        shuLi: {
            name: '淑麗',
            emoji: '👩',
            ascii: `
    ╱\\___/\\
   (◇◇)_(◇◇)
    \\ ♥ /
     |_|
    /| |\\
   / | | \\
    |♥|
   /| |\\
  / | | \\
     | |
    \\ | /
     \\|/`,
            svgUrl: '#shuLi-svg',
            description: '25歲銷售冠軍，美麗高傲，野心勃勃的狙獵者'
        },
        
        aLian: {
            name: '阿蓮',
            emoji: '👩‍🦰',
            ascii: `
    ╱\\___/\\
   (•v•)_(•v•)
    \\ ◇ /
     |_|
    /| |\\
   / | | \\
    |◇|
   /| |\\
  / | | \\
     | |
    \\ | /
     \\|/`,
            svgUrl: '#aLian-svg',
            description: '21歲底層員工，善良樂觀，陳風最信任的朋友'
        }
    },

    // ============= 場景圖片資源（荒島主題） =============
    scenes: {
        entrance: {
            name: '荒島碼頭',
            emoji: '🏝️',
            description: '破舊的木製碼頭，滿目瘡痍，彷彿訴說著這座荒島的淒涼歷史',
            backgroundUrl: '#island-entrance-bg',
            type: 'safe'
        },
        forest: {
            name: '密林叢林',
            emoji: '🌴',
            description: '茂密的熱帶森林，潮濕的空氣中充滿了未知的危險',
            backgroundUrl: '#island-forest-bg',
            type: 'danger'
        },
        village: {
            name: '廢棄營地',
            emoji: '⛺',
            description: '多年無人居住的木製營地，破敗的帳篷和銹蝕的工具散落一地',
            backgroundUrl: '#island-village-bg',
            type: 'safe'
        },
        field: {
            name: '荒野平原',
            emoji: '🌾',
            description: '寬闊的荒野，野生植物瘋狂生長，隨時可能有野獸出沒',
            backgroundUrl: '#island-field-bg',
            type: 'normal'
        },
        garden: {
            name: '廢棄花園',
            emoji: '🌺',
            description: '曾經有人精心打理的花園，現在野花亂生，雜草叢生',
            backgroundUrl: '#island-garden-bg',
            type: 'safe'
        },
        mountain: {
            name: '山峰瞭望臺',
            emoji: '⛰️',
            description: '荒島最高點，從這裡可以望向無邊的大海，只有無盡的孤獨',
            backgroundUrl: '#island-mountain-bg',
            type: 'danger'
        },
        cave_entrance: {
            name: '神祕洞穴',
            emoji: '🕳️',
            description: '深邃黑暗的洞穴入口，彷彿通往地獄的門戶',
            backgroundUrl: '#island-cave-bg',
            type: 'dark'
        },
        river: {
            name: '淡水河流',
            emoji: '💧',
            description: '荒島上唯一的淡水來源，清澈的流水帶來一絲生機',
            backgroundUrl: '#island-river-bg',
            type: 'safe'
        },
        castle: {
            name: '古老遺蹟',
            emoji: '🏛️',
            description: '荒島上的神祕建築遺蹟，似乎隱藏著古老的秘密',
            backgroundUrl: '#island-castle-bg',
            type: 'danger'
        },
        lake: {
            name: '月光湖泊',
            emoji: '💫',
            description: '隱秘的湖泊，湖水在月光下閃閃發光，神祕而詭異',
            backgroundUrl: '#island-lake-bg',
            type: 'normal'
        },
        farm: {
            name: '廢棄農田',
            emoji: '🌾',
            description: '曾經的農業區，現在被荒蕪所吞沒，只有斷垣殘壁',
            backgroundUrl: '#island-farm-bg',
            type: 'safe'
        },
        market: {
            name: '殘破交易點',
            emoji: '🏚️',
            description: '舊時的交易市場，現在只剩下風吹過空蕩的棚架',
            backgroundUrl: '#island-market-bg',
            type: 'safe'
        }
    },

    // ============= SVG 角色圖片定義 =============
    svgs: {
        // 陳風 SVG
        chenFengSvg: `
        <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景 -->
            <rect width="200" height="400" fill="rgba(26, 26, 46, 0.8)"/>
            
            <!-- 頭部 -->
            <circle cx="100" cy="70" r="35" fill="#f5d5b8"/>
            
            <!-- 頭髮 -->
            <path d="M 65 70 Q 65 35 100 35 Q 135 35 135 70" fill="#1a1a1a"/>
            
            <!-- 眼睛 -->
            <circle cx="85" cy="65" r="4" fill="#000"/>
            <circle cx="115" cy="65" r="4" fill="#000"/>
            <circle cx="86" cy="63" r="1.5" fill="#fff"/>
            <circle cx="116" cy="63" r="1.5" fill="#fff"/>
            
            <!-- 鼻子 -->
            <line x1="100" y1="70" x2="100" y2="80" stroke="#d4a574" stroke-width="1"/>
            
            <!-- 嘴巴 -->
            <path d="M 90 85 Q 100 90 110 85" stroke="#c9a261" stroke-width="1.5" fill="none"/>
            
            <!-- 軀幹 -->
            <rect x="70" y="110" width="60" height="80" rx="5" fill="#4a5f8f"/>
            
            <!-- 襯衫 -->
            <rect x="75" y="115" width="50" height="50" rx="3" fill="#e8e8e8"/>
            <line x1="100" y1="115" x2="100" y2="165" stroke="#d4d4d4" stroke-width="1"/>
            
            <!-- 領帶 -->
            <polygon points="100,120 95,135 100,145 105,135" fill="#1a1a2e"/>
            
            <!-- 西裝外套 -->
            <path d="M 70 110 L 65 150 L 70 190 L 130 190 L 135 150 L 130 110" fill="#333333" stroke="#1a1a1a" stroke-width="2"/>
            
            <!-- 手臂 -->
            <rect x="45" y="125" width="20" height="70" rx="10" fill="#f5d5b8"/>
            <rect x="135" y="125" width="20" height="70" rx="10" fill="#f5d5b8"/>
            
            <!-- 手 -->
            <circle cx="52" cy="200" r="8" fill="#f5d5b8"/>
            <circle cx="148" cy="200" r="8" fill="#f5d5b8"/>
            
            <!-- 褲子 -->
            <rect x="75" y="190" width="22" height="80" fill="#3a3a3a"/>
            <rect x="103" y="190" width="22" height="80" fill="#3a3a3a"/>
            
            <!-- 鞋子 -->
            <rect x="70" y="270" width="30" height="15" rx="3" fill="#1a1a1a"/>
            <rect x="100" y="270" width="30" height="15" rx="3" fill="#1a1a1a"/>
            
            <!-- 氣質標籤 -->
            <text x="100" y="320" font-size="14" fill="#d4af37" text-anchor="middle" font-weight="bold">踏實 · 勤奮</text>
            <text x="100" y="340" font-size="12" fill="#aaa" text-anchor="middle">平凡上班族</text>
        </svg>
        `,
        
        // 孫莉莉 SVG
        sunLiliSvg: `
        <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景 -->
            <rect width="200" height="400" fill="rgba(26, 26, 46, 0.8)"/>
            
            <!-- 頭部 -->
            <circle cx="100" cy="70" r="35" fill="#f5d5b8"/>
            
            <!-- 長髮 -->
            <path d="M 65 70 Q 65 35 100 35 Q 135 35 135 70 Q 135 150 120 200" fill="#1a1a1a" stroke="#0a0a0a" stroke-width="1"/>
            <path d="M 65 70 Q 60 100 65 150 Q 70 180 75 220" fill="#1a1a1a"/>
            
            <!-- 眼睛（冷靜銳利） -->
            <circle cx="85" cy="65" r="4" fill="#000"/>
            <circle cx="115" cy="65" r="4" fill="#000"/>
            
            <!-- 眉毛 -->
            <path d="M 80 58 Q 85 55 90 58" stroke="#8B4513" stroke-width="2" fill="none"/>
            <path d="M 110 58 Q 115 55 120 58" stroke="#8B4513" stroke-width="2" fill="none"/>
            
            <!-- 嘴巴（冷漠微笑） -->
            <path d="M 90 85 Q 100 88 110 85" stroke="#a83a3a" stroke-width="2" fill="none"/>
            
            <!-- 軀幹 -->
            <rect x="70" y="110" width="60" height="80" rx="5" fill="#e8d4c0"/>
            
            <!-- 絲質襯衫 -->
            <rect x="75" y="115" width="50" height="50" rx="3" fill="#f5f5f5" stroke="#d4af37" stroke-width="1"/>
            <line x1="100" y1="115" x2="100" y2="165" stroke="#e0e0e0" stroke-width="1"/>
            
            <!-- 西裝外套（高級） -->
            <path d="M 70 110 L 65 150 L 70 190 L 130 190 L 135 150 L 130 110" fill="#2a2a2a" stroke="#d4af37" stroke-width="2"/>
            
            <!-- 金色腰帶 -->
            <rect x="70" y="185" width="60" height="8" fill="#d4af37"/>
            
            <!-- 手臂 -->
            <rect x="45" y="125" width="20" height="70" rx="10" fill="#f5d5b8"/>
            <rect x="135" y="125" width="20" height="70" rx="10" fill="#f5d5b8"/>
            
            <!-- 手（優雅） -->
            <circle cx="52" cy="200" r="8" fill="#f5d5b8"/>
            <circle cx="148" cy="200" r="8" fill="#f5d5b8"/>
            
            <!-- 褲裙 -->
            <rect x="75" y="190" width="50" height="85" fill="#1a1a1a"/>
            
            <!-- 高跟鞋 -->
            <rect x="70" y="270" width="30" height="18" rx="3" fill="#8b0000"/>
            <rect x="100" y="275" width="30" height="13" rx="3" fill="#8b0000"/>
            <polygon points="75,288 78,295 72,295" fill="#8b0000"/>
            <polygon points="105,290 108,295 102,295" fill="#8b0000"/>
            
            <!-- 氣質標籤 -->
            <text x="100" y="320" font-size="14" fill="#d4af37" text-anchor="middle" font-weight="bold">冷靜 · 自信</text>
            <text x="100" y="340" font-size="12" fill="#aaa" text-anchor="middle">集團總裁</text>
        </svg>
        `,
        
        // 淑麗 SVG
        shuLiSvg: `
        <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景 -->
            <rect width="200" height="400" fill="rgba(26, 26, 46, 0.8)"/>
            
            <!-- 頭部 -->
            <circle cx="100" cy="70" r="35" fill="#f5d5b8"/>
            
            <!-- 長捲髮 -->
            <path d="M 65 70 Q 60 40 100 35 Q 140 35 135 70 Q 135 150 125 220" fill="#1a1a1a"/>
            <path d="M 70 60 Q 60 70 65 120" fill="#2a2a2a"/>
            <path d="M 130 60 Q 140 70 135 120" fill="#2a2a2a"/>
            
            <!-- 眼睛（迷人） -->
            <circle cx="85" cy="65" r="5" fill="#000"/>
            <circle cx="115" cy="65" r="5" fill="#000"/>
            <circle cx="87" cy="62" r="2" fill="#fff"/>
            <circle cx="117" cy="62" r="2" fill="#fff"/>
            
            <!-- 眉毛（性感） -->
            <path d="M 78 58 Q 85 54 92 58" stroke="#8B4513" stroke-width="2" fill="none"/>
            <path d="M 108 58 Q 115 54 122 58" stroke="#8B4513" stroke-width="2" fill="none"/>
            
            <!-- 嘴巴（性感紅唇） -->
            <ellipse cx="100" cy="87" rx="12" ry="6" fill="#d42830"/>
            
            <!-- 軀幹 -->
            <rect x="70" y="110" width="60" height="90" rx="5" fill="#e8d4c0"/>
            
            <!-- 連身裙 (紅色) -->
            <path d="M 75 115 L 70 130 L 75 190 L 125 190 L 130 130 L 125 115" fill="#cc3333" stroke="#8b0000" stroke-width="1"/>
            
            <!-- 裙子腰線 -->
            <ellipse cx="100" cy="145" rx="25" ry="8" fill="rgba(139, 0, 0, 0.3)"/>
            
            <!-- 手臂 -->
            <rect x="45" y="125" width="20" height="75" rx="10" fill="#f5d5b8"/>
            <rect x="135" y="125" width="20" height="75" rx="10" fill="#f5d5b8"/>
            
            <!-- 手 (指甲） -->
            <circle cx="52" cy="205" r="8" fill="#f5d5b8"/>
            <circle cx="148" cy="205" r="8" fill="#f5d5b8"/>
            <circle cx="52" cy="205" r="2" fill="#e83a5e"/>
            <circle cx="148" cy="205" r="2" fill="#e83a5e"/>
            
            <!-- 腿部 -->
            <rect x="80" y="190" width="15" height="85" fill="#f5d5b8"/>
            <rect x="105" y="190" width="15" height="85" fill="#f5d5b8"/>
            
            <!-- 高跟鞋 (精緻） -->
            <rect x="75" y="272" width="25" height="15" rx="3" fill="#c41e3a"/>
            <rect x="100" y="275" width="25" height="12" rx="3" fill="#c41e3a"/>
            <polygon points="80,287 83,295 77,295" fill="#c41e3a"/>
            <polygon points="105,287 108,295 102,295" fill="#c41e3a"/>
            
            <!-- 氣質標籤 -->
            <text x="100" y="320" font-size="14" fill="#d4af37" text-anchor="middle" font-weight="bold">迷人 · 高傲</text>
            <text x="100" y="340" font-size="12" fill="#aaa" text-anchor="middle">銷售冠軍</text>
        </svg>
        `,
        
        // 阿蓮 SVG
        aLianSvg: `
        <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景 -->
            <rect width="200" height="400" fill="rgba(26, 26, 46, 0.8)"/>
            
            <!-- 頭部 -->
            <circle cx="100" cy="70" r="33" fill="#f5d5b8"/>
            
            <!-- 馬尾髮型 -->
            <path d="M 67 70 Q 65 40 100 38 Q 135 40 133 70" fill="#1a1a1a"/>
            <!-- 馬尾 -->
            <path d="M 115 55 Q 130 60 140 100 Q 145 150 140 200" fill="#1a1a1a" stroke="#0a0a0a" stroke-width="2"/>
            
            <!-- 眼睛（溫暖） -->
            <circle cx="85" cy="65" r="4" fill="#000"/>
            <circle cx="115" cy="65" r="4" fill="#000"/>
            <circle cx="86" cy="63" r="1.5" fill="#fff"/>
            <circle cx="116" cy="63" r="1.5" fill="#fff"/>
            
            <!-- 眉毛 -->
            <path d="M 80 58 Q 85 56 90 58" stroke="#8B4513" stroke-width="1.5" fill="none"/>
            <path d="M 110 58 Q 115 56 120 58" stroke="#8B4513" stroke-width="1.5" fill="none"/>
            
            <!-- 嘴巴（親切微笑） -->
            <path d="M 90 82 Q 100 86 110 82" stroke="#d4a574" stroke-width="2" fill="none"/>
            <path d="M 95 85 Q 100 88 105 85" stroke="#d4a574" stroke-width="1" fill="none"/>
            
            <!-- 軀幹 -->
            <rect x="72" y="110" width="56" height="70" rx="5" fill="#e8d4c0"/>
            
            <!-- T恤 (淺藍） -->
            <rect x="75" y="115" width="50" height="45" fill="#add8e6" stroke="#6db3cc" stroke-width="1"/>
            <circle cx="85" cy="130" r="2" fill="#6db3cc"/>
            <circle cx="115" cy="130" r="2" fill="#6db3cc"/>
            
            <!-- 手臂 -->
            <rect x="48" y="130" width="18" height="65" rx="9" fill="#f5d5b8"/>
            <rect x="134" y="130" width="18" height="65" rx="9" fill="#f5d5b8"/>
            
            <!-- 手 -->
            <circle cx="55" cy="200" r="7" fill="#f5d5b8"/>
            <circle cx="145" cy="200" r="7" fill="#f5d5b8"/>
            
            <!-- 短褲 (牛仔藍） -->
            <rect x="77" y="160" width="46" height="35" fill="#4a7fb0"/>
            
            <!-- 腿部 -->
            <rect x="80" y="195" width="13" height="80" fill="#f5d5b8"/>
            <rect x="107" y="195" width="13" height="80" fill="#f5d5b8"/>
            
            <!-- 運動鞋 -->
            <rect x="75" y="272" width="28" height="13" rx="3" fill="#f5f5f5" stroke="#999" stroke-width="1"/>
            <rect x="97" y="272" width="28" height="13" rx="3" fill="#f5f5f5" stroke="#999" stroke-width="1"/>
            <circle cx="79" cy="280" r="2" fill="#999"/>
            <circle cx="101" cy="280" r="2" fill="#999"/>
            
            <!-- 黑眼圈（疲憊） -->
            <ellipse cx="82" cy="68" rx="6" ry="3" fill="rgba(0, 0, 0, 0.2)"/>
            <ellipse cx="118" cy="68" rx="6" ry="3" fill="rgba(0, 0, 0, 0.2)"/>
            
            <!-- 氣質標籤 -->
            <text x="100" y="320" font-size="14" fill="#d4af37" text-anchor="middle" font-weight="bold">善良 · 樂觀</text>
            <text x="100" y="340" font-size="12" fill="#aaa" text-anchor="middle">年輕員工</text>
        </svg>
        `
    },

    // ============= 背景場景 SVG 定義 =============
    backgrounds: {
        islandEntranceBg: `
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            <!-- 天空 -->
            <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87ceeb;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e0f6ff;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a90e2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2c5aa0;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#skyGradient)"/>
            
            <!-- 太陽 -->
            <circle cx="1700" cy="200" r="80" fill="#ffd700" opacity="0.8"/>
            
            <!-- 海洋 -->
            <rect y="600" width="1920" height="480" fill="url(#oceanGradient)"/>
            
            <!-- 波浪 -->
            <path d="M 0 600 Q 240 580 480 600 T 960 600 T 1440 600 T 1920 600" stroke="#6ab7e8" stroke-width="3" fill="none"/>
            <path d="M 0 650 Q 240 630 480 650 T 960 650 T 1440 650 T 1920 650" stroke="#5aa5d8" stroke-width="2" fill="none"/>
            
            <!-- 破舊木製碼頭 -->
            <rect x="700" y="500" width="500" height="150" fill="#8b6914" stroke="#6b5a0f" stroke-width="2"/>
            <line x1="720" y1="550" x2="1180" y2="550" stroke="#5b4a0f" stroke-width="3"/>
            <line x1="720" y1="600" x2="1180" y2="600" stroke="#5b4a0f" stroke-width="3"/>
            <circle cx="750" cy="520" r="8" fill="#654321" opacity="0.6"/>
            <circle cx="850" cy="520" r="8" fill="#654321" opacity="0.6"/>
            <circle cx="950" cy="520" r="8" fill="#654321" opacity="0.6"/>
            <circle cx="1050" cy="520" r="8" fill="#654321" opacity="0.6"/>
            <circle cx="1150" cy="520" r="8" fill="#654321" opacity="0.6"/>
            
            <!-- 沙灘 -->
            <ellipse cx="960" cy="680" rx="800" ry="100" fill="#d4a76a"/>
            
            <!-- 棕櫚樹 -->
            <rect x="200" y="400" width="30" height="150" fill="#8b6914"/>
            <ellipse cx="215" cy="350" rx="60" ry="80" fill="#228b22"/>
            <ellipse cx="170" cy="380" rx="40" ry="50" fill="#228b22"/>
            <ellipse cx="260" cy="380" rx="40" ry="50" fill="#228b22"/>
            
            <!-- 另一棵樹 -->
            <rect x="1650" y="420" width="25" height="130" fill="#8b6914"/>
            <ellipse cx="1662" cy="375" rx="50" ry="70" fill="#1e7b1e"/>
            <ellipse cx="1625" cy="400" rx="35" ry="45" fill="#1e7b1e"/>
            <ellipse cx="1700" cy="400" rx="35" ry="45" fill="#1e7b1e"/>
            
            <!-- 岩石 -->
            <ellipse cx="400" cy="650" rx="60" ry="40" fill="#696969"/>
            <ellipse cx="1500" cy="670" rx="80" ry="50" fill="#696969"/>
        </svg>
        `,
        
        islandForestBg: `
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            <!-- 天空（陰暗） -->
            <defs>
                <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#6b8e23;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8fbc8f;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#forestSky)"/>
            
            <!-- 陽光穿過樹葉 -->
            <circle cx="1700" cy="150" r="60" fill="#ffff99" opacity="0.3"/>
            
            <!-- 遠景樹木 -->
            <g opacity="0.4">
                <polygon points="100,500 200,200 300,500" fill="#2d5016"/>
                <polygon points="400,600 550,250 700,600" fill="#2d5016"/>
                <polygon points="900,550 1100,150 1300,550" fill="#2d5016"/>
                <polygon points="1400,600 1600,200 1800,600" fill="#2d5016"/>
            </g>
            
            <!-- 中景樹木 -->
            <g opacity="0.7">
                <polygon points="200,700 350,350 500,700" fill="#3d6b1f"/>
                <polygon points="800,750 1000,300 1200,750" fill="#3d6b1f"/>
                <polygon points="1500,700 1700,250 1900,700" fill="#3d6b1f"/>
            </g>
            
            <!-- 近景樹木（最清晰） -->
            <polygon points="50,800 250,200 450,800" fill="#1e3a1e"/>
            <rect x="200" y="650" width="100" height="250" fill="#3d2817"/>
            
            <polygon points="1500,850 1750,250 2000,850" fill="#1e3a1e"/>
            <rect x="1700" y="700" width="100" height="250" fill="#3d2817"/>
            
            <!-- 地面 -->
            <rect y="800" width="1920" height="280" fill="#2d5016"/>
            
            <!-- 灌木和雜草 -->
            <ellipse cx="400" cy="820" rx="150" ry="80" fill="#1d3d1d" opacity="0.8"/>
            <ellipse cx="1400" cy="850" rx="180" ry="100" fill="#1d3d1d" opacity="0.8"/>
            <ellipse cx="960" cy="880" rx="200" ry="120" fill="#1d3d1d" opacity="0.7"/>
            
            <!-- 霧氣效果 -->
            <rect width="1920" height="1080" fill="rgba(200, 200, 200, 0.1)"/>
        </svg>
        `,
        
        islandFieldBg: `
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            <!-- 天空 -->
            <defs>
                <linearGradient id="fieldSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87ceeb;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e0f6ff;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#fieldSky)"/>
            
            <!-- 太陽 -->
            <circle cx="1700" cy="200" r="70" fill="#ffd700" opacity="0.9"/>
            
            <!-- 地平線 -->
            <rect y="500" width="1920" height="100" fill="#90ee90" opacity="0.6"/>
            
            <!-- 地面（草地） -->
            <rect y="600" width="1920" height="480" fill="#7cb342"/>
            
            <!-- 草叢紋理 -->
            <g stroke="#558b2f" stroke-width="2" opacity="0.5">
                <line x1="100" y1="650" x2="120" y2="700"/>
                <line x1="250" y1="640" x2="270" y2="690"/>
                <line x1="400" y1="660" x2="420" y2="710"/>
                <line x1="550" y1="645" x2="570" y2="695"/>
                <line x1="700" y1="655" x2="720" y2="705"/>
                <line x1="850" y1="650" x2="870" y2="700"/>
                <line x1="1000" y1="660" x2="1020" y2="710"/>
                <line x1="1150" y1="645" x2="1170" y2="695"/>
                <line x1="1300" y1="655" x2="1320" y2="705"/>
                <line x1="1450" y1="650" x2="1470" y2="700"/>
                <line x1="1600" y1="660" x2="1620" y2="710"/>
                <line x1="1750" y1="645" x2="1770" y2="695"/>
            </g>
            
            <!-- 野生灌木 -->
            <ellipse cx="300" cy="750" rx="100" ry="60" fill="#6b8e23" opacity="0.8"/>
            <ellipse cx="1200" cy="800" rx="120" ry="70" fill="#6b8e23" opacity="0.8"/>
            <ellipse cx="1600" cy="750" rx="90" ry="55" fill="#556b2f" opacity="0.9"/>
            
            <!-- 遠景山脈 -->
            <polygon points="0,400 960,100 1920,400" fill="rgba(180, 180, 200, 0.4)"/>
        </svg>
        `,
        
        islandRiverBg: `
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            <!-- 天空 -->
            <defs>
                <linearGradient id="riverSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87ceeb;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e0f6ff;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#2f4f7f;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#4a90e2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2f4f7f;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#riverSky)"/>
            
            <!-- 地面（兩側綠地） -->
            <rect y="600" width="600" height="480" fill="#7cb342"/>
            <rect x="1320" y="600" width="600" height="480" fill="#7cb342"/>
            
            <!-- 河流 -->
            <path d="M 600 200 Q 700 400 800 600 L 800 1080 L 1120 1080 Q 1000 700 900 600 Q 800 400 700 200" fill="url(#waterFlow)"/>
            
            <!-- 河流波紋 -->
            <g stroke="#6ab7e8" stroke-width="2" fill="none" opacity="0.6">
                <path d="M 600 300 Q 650 320 700 300"/>
                <path d="M 650 450 Q 700 470 750 450"/>
                <path d="M 700 600 Q 750 620 800 600"/>
                <path d="M 750 750 Q 800 770 850 750"/>
            </g>
            
            <!-- 河邊石頭 -->
            <ellipse cx="500" cy="700" rx="80" ry="60" fill="#696969"/>
            <ellipse cx="1450" cy="750" rx="100" ry="70" fill="#696969"/>
            
            <!-- 植被 -->
            <ellipse cx="300" cy="750" rx="120" ry="80" fill="#6b8e23" opacity="0.9"/>
            <ellipse cx="1700" cy="800" rx="140" ry="90" fill="#558b2f" opacity="0.9"/>
            
            <!-- 樹木 -->
            <polygon points="150,600 250,200 350,600" fill="#3d5c1f"/>
            <rect x="220" y="450" width="60" height="200" fill="#2d4a1f"/>
            
            <polygon points="1750,620 1880,180 2000,620" fill="#1e3a1e"/>
            <rect x="1850" y="400" width="70" height="220" fill="#1d2a0d"/>
        </svg>
        `,
        
        islandMountainBg: `
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            <!-- 天空（陰沉） -->
            <defs>
                <linearGradient id="mountainSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a6fa5;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#87ceeb;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#mountainSky)"/>
            
            <!-- 遠景山脈 -->
            <polygon points="0,600 300,200 600,600" fill="rgba(100, 100, 150, 0.4)"/>
            <polygon points="1320,620 1600,250 1920,620" fill="rgba(100, 100, 150, 0.4)"/>
            
            <!-- 中景山峰 -->
            <polygon points="200,700 600,300 1000,700" fill="rgba(120, 120, 180, 0.6)"/>
            <polygon points="900,720 1300,350 1700,720" fill="rgba(120, 120, 180, 0.6)"/>
            
            <!-- 主山峰 -->
            <polygon points="400,800 960,250 1520,800" fill="#808080"/>
            <polygon points="450,800 960,300 1470,800" fill="#696969"/>
            
            <!-- 山頂雪線 -->
            <polygon points="900,250 950,350 850,350" fill="#ffffff" opacity="0.9"/>
            <polygon points="960,300 1010,400 910,400" fill="#f5f5f5" opacity="0.8"/>
            
            <!-- 大海遠景 -->
            <rect y="850" width="1920" height="230" fill="#2c5aa0"/>
            
            <!-- 海洋波浪 -->
            <path d="M 0 850 Q 240 830 480 850 T 960 850 T 1440 850 T 1920 850" stroke="#4a7fc4" stroke-width="2" fill="none" opacity="0.7"/>
        </svg>
        `,
        
        islandCaveBg: `
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            <!-- 洞穴內部黑暗背景 -->
            <rect width="1920" height="1080" fill="#0a0a0a"/>
            
            <!-- 洞穴頂部 -->
            <ellipse cx="960" cy="200" rx="600" ry="200" fill="#1a1a2e"/>
            <path d="M 300 300 Q 400 150 500 300" fill="#1a1a2e"/>
            <path d="M 1400 320 Q 1500 120 1620 320" fill="#1a1a2e"/>
            
            <!-- 石筍和石柱 -->
            <polygon points="600,900 620,500 580,900" fill="#2a2a3e"/>
            <polygon points="1300,950 1330,600 1270,950" fill="#2a2a3e"/>
            
            <!-- 洞口光線 -->
            <ellipse cx="960" cy="400" rx="300" ry="150" fill="rgba(200, 200, 200, 0.2)"/>
            
            <!-- 發光的礦石 -->
            <circle cx="500" cy="600" r="15" fill="#4a90e2" opacity="0.6"/>
            <circle cx="800" cy="750" r="12" fill="#7cb342" opacity="0.5"/>
            <circle cx="1300" cy="650" r="18" fill="#ff6b6b" opacity="0.5"/>
            <circle cx="1700" cy="800" r="14" fill="#ffd700" opacity="0.4"/>
            
            <!-- 地面 -->
            <rect y="950" width="1920" height="130" fill="#0d0d0d"/>
            
            <!-- 霧氣效果 -->
            <rect width="1920" height="1080" fill="rgba(100, 100, 100, 0.3)"/>
        </svg>
        `
    }
};

// ============= 資源管理函數 =============

/**
 * 獲取角色圖片
 */
function getCharacterImage(characterKey) {
    return gameResources.characters[characterKey];
}

/**
 * 獲取場景背景
 */
function getSceneBackground(sceneKey) {
    return gameResources.scenes[sceneKey];
}

/**
 * 獲取SVG內容
 */
function getSVG(svgKey) {
    const svgMap = {
        'chenFeng-svg': gameResources.svgs.chenFengSvg,
        'sunLili-svg': gameResources.svgs.sunLiliSvg,
        'shuLi-svg': gameResources.svgs.shuLiSvg,
        'aLian-svg': gameResources.svgs.aLianSvg,
        'island-entrance-bg': gameResources.backgrounds.islandEntranceBg,
        'island-forest-bg': gameResources.backgrounds.islandForestBg,
        'island-field-bg': gameResources.backgrounds.islandFieldBg,
        'island-river-bg': gameResources.backgrounds.islandRiverBg,
        'island-mountain-bg': gameResources.backgrounds.islandMountainBg,
        'island-cave-bg': gameResources.backgrounds.islandCaveBg
    };
    return svgMap[svgKey] || null;
}

/**
 * 獲取所有場景列表
 */
function getAllScenes() {
    return Object.keys(gameResources.scenes).map(key => ({
        key: key,
        ...gameResources.scenes[key]
    }));
}

/**
 * 獲取所有角色列表
 */
function getAllCharacters() {
    return Object.keys(gameResources.characters).map(key => ({
        key: key,
        ...gameResources.characters[key]
    }));
}

// 資源系統已加載
console.log('🎮 遊戲資源系統已加載');
console.log('✅ 角色資源：', Object.keys(gameResources.characters).length, '個');
console.log('✅ 場景資源：', Object.keys(gameResources.scenes).length, '個');
console.log('✅ SVG資源已就緒');
