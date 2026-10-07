// ============= 遊戲全局變量 =============
let gameState = {
    currentScene: 'entrance',
    isInBattle: false,
    battleEnemy: null,
    playerDefending: false,
    lastEnemyHour: -1,  // 追蹤最後一次生成敵人的小時
    sceneEnemyGenerated: {},  // 追蹤每個場景在當前小時是否已經生成過敵人
    gameDay: 1,  // 遊戲日期（用於飢餓檢查）
    lastHungerDay: 0,  // 上次飢餓檢查的日期
    lastPeriod: null,
    lastActionPointTime: Date.now(),
    gameTimeOffsetMs: 0,
    gameClockPaused: true,
    periodTransitionKey: null,
    enteredSceneEncounterKey: null,
    lastSurvivalTickRealMs: Date.now(),
    bases: {},  // 所有根據地 {baseId: baseData}
    currentBaseId: null,  // 當前根據地ID
    discoveries: []
};

const gameRules = {
    explorationEncounterChance: 1 / 10,
    sceneEntryEncounterChance: 1 / 20,
    actionPointRecoveryMinutes: 5,
    actionNeedsCost: 5,
    explorationActionCost: 3,
    restActionCost: 3,
    returnActionCost: 10,
    sleepActionCost: 3,
    restFatigueRecovery: 15,
    explorationFatigueGain: 5,
    periodNeedsCost: 20,
    escapeChance: 0.7,
    rawMeatDropChance: 0.5,
    rawWaterPoisonChance: 0.3,
    rawMeatPoisonChance: 0.3,
    poisonDamageIntervalMs: 15 * 60 * 1000,
    poisonDamagePercent: 0.2,
    dehydrationDeathGameMs: 24 * 60 * 60 * 1000,
    starvationDeathGameMs: 3 * 24 * 60 * 60 * 1000
};

gameState.gameClockStartRealMs = Date.now();
gameState.gameClockStartMs = Date.now();

// 根據地類型及其特性
const baseTypes = {
    riverside: {
        name: '溪流邊營地',
        icon: '🏕️',
        description: '靠近水源，涼爽舒適',
        features: ['可釣魚', '水源充足'],
        baseFishChance: 0.4,
        baseBerriesChance: 0,
        baseAnimalChance: 0.1,
        startingLocation: 'river'
    },
    forest: {
        name: '密林營地',
        icon: '🌲',
        description: '密集的樹木，隱蔽性強',
        features: ['可採集漿果', '隱蔽'],
        baseFishChance: 0,
        baseBerriesChance: 0.5,
        baseAnimalChance: 0.2,
        startingLocation: 'forest'
    },
    highland: {
        name: '高地營地',
        icon: '⛰️',
        description: '視野開闊，野生動物多',
        features: ['動物屍體出現', '視野好'],
        baseFishChance: 0,
        baseBerriesChance: 0.1,
        baseAnimalChance: 0.6,
        startingLocation: 'mountain'
    },
    plains: {
        name: '平原營地',
        icon: '🌾',
        description: '開闊平坦，基礎',
        features: ['均衡發展'],
        baseFishChance: 0.1,
        baseBerriesChance: 0.2,
        baseAnimalChance: 0.2,
        startingLocation: 'field'
    }
};

// 根據地設施數據
const baseStructures = {
    grass_mat: {
        name: '草蓆', icon: '🧺', recipe: { '植物纖維': 3 },
        description: '睡眠時減少疲勞 40 點', effect: 'reduce_fatigue_40',
        requiredLevel: 1
    },
    wood_bed: {
        name: '木床', icon: '🛏️', recipe: { '木材': 8, '植物纖維': 2 },
        description: '睡眠時減少疲勞 60 點', effect: 'reduce_fatigue_60',
        requiredLevel: 1
    },
    spring_bed: {
        name: '彈簧床', icon: '🛌', recipe: { '木材': 10, '金屬碎片': 3, '植物纖維': 4 },
        description: '睡眠時減少疲勞 80 點', effect: 'reduce_fatigue_80',
        requiredLevel: 2
    },
    purifier: {
        name: '海水淨化設施', icon: '💧', recipe: { '木材': 4, '小石子': 4, '金屬碎片': 2 },
        description: '在根據地煮製海水以取得飲用水與鹽', effect: 'purify_water',
        requiredLevel: 1
    },
    pot: {
        name: '陶罐', recipe: { '黏土': 3 },
        icon: '🏺',
        description: '可以儲存食物',
        effect: 'food_storage',
        requiredLevel: 1
    },
    saltMaker: {
        name: '製鹽工具', icon: '🧂', recipe: { '小石子': 5, '木材': 2 },
        description: '製作鹽，增加食物保存時間',
        effect: 'food_preservation',
        requiredLevel: 2
    },
    fireplace: {
        name: '篝火', icon: '🔥', recipe: { '木材': 4, '小石子': 6 },
        description: '烹飪食物，保持溫暖',
        effect: 'cooking',
        requiredLevel: 1
    }
};
// ============= 場景數據庫 =============
const scenes = {
    entrance: {
        name: '莊園入口',
        emoji: '🏰',
        description: '你站在一座宏偉的中世紀莊園前。石門上著黃銅的獅子頭，莊園周圍環繞著高高的石牆。',
        type: 'safe',
        enemies: null,
        items: null,
        neighbors: {
            up: 'forest',
            down: 'village',
            left: 'field',
            right: 'garden'
        }
    },
    forest: {
        name: '森林',
        emoji: '🌲',
        description: '濃密的樹林中充滿了神祕的氣息。陽光透過樹葉灑下斑駁的光影。',
        type: 'danger',
        enemies: ['森林狼', '樹妖'],
        items: ['草藥', '蘑菇', '漿果', '木材', '火種', '植物纖維'],
        neighbors: {
            up: 'mountain',
            down: 'entrance',
            left: 'field',
            right: 'river'
        }
    },
    village: {
        name: '小村莊',
        emoji: '🏘️',
        description: '一個寧靜的村莊，有幾間房屋和一家旅館。村民們在街上行走。',
        type: 'safe',
        enemies: null,
        items: ['治療藥水', '麵包'],
        npc: '村長',
        neighbors: {
            up: 'entrance',
            down: null,
            left: 'farm',
            right: 'market'
        }
    },
    field: {
        name: '荒野',
        emoji: '🌾',
        description: '廣闊的田野在風中搖曳。遠處可以看到山丘輪廓。',
        type: 'normal',
        enemies: ['野狼', '盜匪'],
        items: ['小石子', '漿果', '木材', '火種', '植物纖維'],
        neighbors: {
            up: 'forest',
            down: 'farm',
            left: 'cave_entrance',
            right: 'entrance'
        }
    },
    garden: {
        name: '城堡花園',
        emoji: '🌹',
        description: '精心修剪的花園，各種顏色的花朵盛開。一座噴泉矗立在花園中央。',
        type: 'safe',
        enemies: null,
        items: ['玫瑰花', '金幣'],
        neighbors: {
            up: 'castle',
            down: 'market',
            left: 'entrance',
            right: 'lake'
        }
    },
    mountain: {
        name: '山頂',
        emoji: '⛰️',
        description: '高聳的山峰俯瞰著整個莊園。寒風吹過，天色陰沉。',
        type: 'danger',
        enemies: ['山地獸'],
        items: ['礦石', '金屬碎片', '古老的鑰匙', '木材'],
        neighbors: {
            up: null,
            down: 'forest',
            left: 'cave_entrance',
            right: 'river'
        }
    },
    cave_entrance: {
        name: '洞穴入口',
        emoji: '🕳️',
        description: '一個黑暗的洞穴入口。你看不到裡面是什麼...',
        type: 'dark',
        requiredItem: '蠟燭',
        enemies: ['洞穴蝙蝠', '地底生物'],
        items: ['寶藏', '秘密文書', '礦石', '金屬碎片', '黏土'],
        neighbors: {
            up: 'mountain',
            down: 'field',
            left: null,
            right: 'river'
        }
    },
    river: {
        name: '河流',
        emoji: '🌊',
        description: '清澈的河流潺潺流動。你可以在這裡釣魚或補充飲用水。',
        type: 'safe',
        waterSource: 'fresh',
        enemies: null,
        items: ['新鮮魚', '水晶', '火種'],
        neighbors: {
            up: 'mountain',
            down: 'lake',
            left: 'forest',
            right: 'castle'
        }
    },
    castle: {
        name: '古堡',
        emoji: '🏛️',
        description: '一座宏大的古堡矗立在眼前。它看起來很久沒人打理了。',
        type: 'danger',
        enemies: ['城堡衛兵', '死靈騎士'],
        items: ['王冠', '古老的寶藏'],
        boss: true,
        neighbors: {
            up: null,
            down: 'river',
            left: 'garden',
            right: null
        }
    },
    lake: {
        name: '湖泊',
        emoji: '💧',
        description: '寧靜的湖泊反射著天空。湖水清澈見底。',
        type: 'normal',
        waterSource: 'fresh',
        enemies: ['湖怪'],
        items: ['珍珠', '黏土', '新鮮魚'],
        neighbors: {
            up: 'river',
            down: null,
            left: 'garden',
            right: null
        }
    },
    shore: {
        name: '海岸',
        emoji: '🏝️',
        description: '浪潮拍打著海岸，潮池與漂流木散落在礁石間。探索海岸可以取得海水。',
        type: 'normal',
        waterSource: 'sea',
        enemies: ['湖怪'],
        items: ['新鮮魚', '貝殼', '火種'],
        neighbors: { up: null, down: null, left: null, right: null }
    },
    farm: {
        name: '農場',
        emoji: '🚜',
        description: '一個農場，有穀倉和一些農作物。',
        type: 'safe',
        enemies: null,
        items: ['穀物', '雞蛋'],
        npc: '農民',
        neighbors: {
            up: 'field',
            down: 'village',
            left: null,
            right: 'market'
        }
    },
    market: {
        name: '市集',
        emoji: '🏪',
        description: '熱鬧的市集，商人們在叫賣各種商品。',
        type: 'safe',
        enemies: null,
        items: [],
        npc: '商人',
        neighbors: {
            up: 'garden',
            down: 'village',
            left: 'farm',
            right: 'lake'
        }
    }
};

// 以原始 12 個場景為模板擴展成 12 x 10 的連通地圖，共 120 個可探索位置。
const mapColumns = 12;
const mapRows = 10;
const expansionAreas = ['北境林地', '東部河谷', '南方草原', '西部山脊', '迷霧濕地', '遠岸海灣', '古跡邊疆', '高原腹地', '遠方荒野'];
const mapTemplates = Object.keys(scenes).map(key => [key, JSON.parse(JSON.stringify(scenes[key]))]);
const originalSceneCount = mapTemplates.length;
const expandedSceneKeys = Object.keys(scenes);

for (let index = originalSceneCount; index < mapColumns * mapRows; index++) {
    const templateIndex = (index - originalSceneCount) % mapTemplates.length;
    const areaIndex = Math.floor((index - originalSceneCount) / mapTemplates.length);
    const [templateKey, template] = mapTemplates[templateIndex];
    const sceneKey = `expanded_${String(index - originalSceneCount + 1).padStart(3, '0')}`;
    scenes[sceneKey] = {
        ...JSON.parse(JSON.stringify(template)),
        name: `${expansionAreas[areaIndex]}・${template.name}`,
        description: `${template.description} 這片延伸地帶位於${expansionAreas[areaIndex]}。`,
        artTemplate: templateKey,
        mapArea: expansionAreas[areaIndex],
        neighbors: {}
    };
    expandedSceneKeys.push(sceneKey);
}

expandedSceneKeys.forEach((sceneKey, index) => {
    const row = Math.floor(index / mapColumns);
    const column = index % mapColumns;
    scenes[sceneKey].mapRow = row;
    scenes[sceneKey].mapColumn = column;
    scenes[sceneKey].neighbors = {
        up: row > 0 ? expandedSceneKeys[index - mapColumns] : null,
        down: row < mapRows - 1 ? expandedSceneKeys[index + mapColumns] : null,
        left: column > 0 ? expandedSceneKeys[index - 1] : null,
        right: column < mapColumns - 1 ? expandedSceneKeys[index + 1] : null
    };
});

const itemRecipes = {
    antidote: { name: '解毒藥', icon: '🧪', recipe: { '草藥': 2, '可飲用水': 1 }, description: '解除中毒狀態' },
    candle: { name: '蠟燭', icon: '🕯️', recipe: { '植物纖維': 2, '火種': 1 }, description: '照亮黑暗洞穴' },
    torch: { name: '火把', icon: '🔦', recipe: { '木材': 1, '植物纖維': 1, '火種': 1 }, description: '可攜式照明工具' },
    spear: { name: '石矛', icon: '🗡️', recipe: { '木材': 2, '小石子': 2, '植物纖維': 1 }, description: '簡易狩獵與防身工具' }
};

const itemCatalog = [
    ['MAP', '地圖', '已探索區域的定位工具', '查看目前位置與鄰接區域', '開局取得'],
    ['MAT-01', '木材', '建造與生火素材', '製作床、篝火與工具', '森林、平原探索'],
    ['MAT-02', '小石子', '堅硬石材', '製作篝火、淨水設施與工具', '山地、洞穴探索'],
    ['MAT-03', '植物纖維', '可編織的韌性纖維', '製作草蓆、床具、蠟燭與火把', '森林、草地探索'],
    ['MAT-04', '火種', '可引燃火焰的乾燥材料', '點燃篝火並烹煮食物與水', '森林、海岸探索'],
    ['MAT-05', '金屬碎片', '可再利用的金屬材料', '製作高階床具與淨水設施', '洞穴、山地探索'],
    ['MAT-06', '黏土', '可塑形並燒製的材料', '製作陶罐', '河谷、濕地探索'],
    ['MAT-07', '草藥', '常見藥用植物', '與可飲用水製作解毒藥', '森林探索'],
    ['FOOD-01', '生肉', '尚未料理的肉類', '食用 +10 飽足度；30% 機率中毒', '擊敗怪物掉落'],
    ['FOOD-02', '熟肉', '篝火料理的肉類', '食用 +40 飽足度', '根據地篝火：生肉×1 + 火種×1'],
    ['WATER-01', '生水', '溪流或河流取得的未煮沸水', '直接飲用 +10 水分，30% 機率中毒', '溪流、河流探索'],
    ['WATER-02', '可飲用水', '煮沸處理過的安全飲水', '飲用 +30 水分', '篝火：生水×1 + 火種×1'],
    ['WATER-03', '海水', '海岸取得的鹹水', '不可直接安全飲用；煮製可得水與鹽', '海岸探索'],
    ['MAT-08', '鹽', '海水煮製後留下的結晶', '料理素材；製鹽工具可額外產出 1 鹽', '篝火：海水×1 + 火種×1'],
    ['FOOD-03', '漿果／野生漿果', '可直接食用的野生果實', '食用 +10 飽足度', '森林、平原探索／根據地資源生成'],
    ['FOOD-04', '蘑菇', '野外採集的菌類', '可作為料理素材', '森林探索'],
    ['MAT-09', '皮革', '狩獵取得的獸皮', '製作裝備素材', '部分怪物掉落'],
    ['MAT-10', '礦石', '未加工礦物', '製作與鍛造素材', '山地、洞穴探索'],
    ['FOOD-05', '新鮮魚', '水域取得的漁獲', '可食用或料理', '河流、湖泊探索'],
    ['FOOD-06', '穀物', '農地收穫的穀物', '料理素材', '農田探索'],
    ['FOOD-07', '雞蛋', '可食用的禽蛋', '料理素材', '農田探索'],
    ['MAT-11', '玫瑰花', '花園採集的花材', '探索與製作素材', '花園探索'],
    ['MAT-12', '水晶', '天然晶體', '收藏與製作素材', '河谷探索'],
    ['MAT-13', '珍珠', '水域珍稀素材', '收藏與交易素材', '湖泊探索'],
    ['MISC-01', '金幣', '通用貨幣', '交易使用', '探索與戰鬥獲得'],
    ['MISC-02', '治療藥水', '恢復用藥劑', '使用後恢復生命值', '村莊探索'],
    ['MISC-03', '麵包', '可攜式主食', '食用 +20 飽足度', '村莊探索'],
    ['MISC-04', '古老的鑰匙', '開啟古老門鎖的鑰匙', '進入特定區域', '山地探索'],
    ['MISC-05', '秘密文書', '記錄古代線索的文件', '任務與探索收藏', '洞穴探索'],
    ['MISC-06', '寶藏', '探索取得的珍藏', '收藏與任務用途', '遺跡探索'],
    ['MISC-07', '王冠', '古堡遺留的珍貴物件', '任務與收藏用途', '古堡探索'],
    ['MISC-08', '獵物屍體', '根據地生成的狩獵收穫', '可存入根據地（拆解功能尚未加入）', '高地營地資源生成'],
    ['GEAR-01', '鐵劍', '基本近戰武器', '提高攻擊能力', '初始裝備'],
    ['GEAR-02', '皮盾', '基礎防護裝備', '提高防禦能力', '初始裝備'],
    ['TOOL-01', '解毒藥', '清除中毒的藥劑', '使用後停止中毒傷害', '根據地製作：草藥×2 + 可飲用水×1'],
    ['TOOL-02', '蠟燭', '微弱但持續的照明用品', '進入黑暗洞穴', '根據地製作：植物纖維×2 + 火種×1'],
    ['TOOL-03', '火把', '可攜式照明與引火工具', '探索黑暗區域', '根據地製作：木材×1 + 植物纖維×1 + 火種×1'],
    ['TOOL-04', '石矛', '簡易狩獵工具', '防身與狩獵裝備', '根據地製作：木材×2 + 小石子×2 + 植物纖維×1'],
    ['STRUCT-01', '草蓆', '最簡易的床具', '根據地睡眠恢復疲勞 40', '根據地製作：植物纖維×3'],
    ['STRUCT-02', '木床', '穩固的木製床具', '根據地睡眠恢復疲勞 60', '根據地製作：木材×8 + 植物纖維×2'],
    ['STRUCT-03', '彈簧床', '舒適的進階床具', '根據地睡眠恢復疲勞 80', '建造 Lv.2；木材×10 + 金屬碎片×3 + 植物纖維×4'],
    ['STRUCT-04', '篝火', '根據地烹煮設施', '製作熟肉、可飲用水與鹽', '根據地製作：木材×4 + 小石子×6'],
    ['STRUCT-05', '海水淨化設施', '海水處理設施', '可替代篝火煮製海水', '根據地製作：木材×4 + 小石子×4 + 金屬碎片×2'],
    ['STRUCT-06', '陶罐', '擴充根據地儲物容量', '存儲上限由 10000 提高至 20000 件', '根據地製作：黏土×3'],
    ['STRUCT-07', '製鹽工具', '製鹽設施', '煮海水時額外取得 1 鹽', '根據地製作，建造 Lv.2：小石子×5 + 木材×2'],
    ['MISC-09', '貝殼', '海岸常見的硬殼素材', '探索與收藏素材', '海岸探索或怪物掉落']
];

// Each scene can override these tables to tune encounters, XP and material drops.
scenes.forest.exploreEncounterChance = 1 / 10;
scenes.forest.enterEncounterChance = 1 / 20;
scenes.forest.periodEnemies = { 夜晚: ['洞穴蝙蝠', '森林狼'] };
scenes.forest.periodItems = { 清晨: ['漿果', '草藥'], 正午: ['木材', '火種'], 傍晚: ['蘑菇', '漿果'], 夜晚: ['蘑菇', '火種'] };
scenes.forest.drops = ['木材', '草藥', '植物纖維', '火種'];
scenes.field.exploreEncounterChance = 1 / 10;
scenes.field.enterEncounterChance = 1 / 20;
scenes.field.periodEnemies = { 夜晚: ['野狼', '盜匪'] };
scenes.field.periodItems = { 清晨: ['漿果', '火種'], 正午: ['木材', '漿果'], 傍晚: ['火種', '小石子'], 夜晚: ['小石子'] };
scenes.field.drops = ['皮革', '小石子', '植物纖維', '漿果'];
scenes.mountain.exploreEncounterChance = 1 / 10;
scenes.mountain.enterEncounterChance = 1 / 20;
scenes.mountain.periodEnemies = { 夜晚: ['洞穴蝙蝠', '山地獸'] };
scenes.mountain.drops = ['礦石', '金屬碎片', '小石子'];
scenes.cave_entrance.exploreEncounterChance = 1 / 10;
scenes.cave_entrance.enterEncounterChance = 1 / 20;
scenes.cave_entrance.drops = ['礦石', '金屬碎片', '黏土'];
scenes.castle.exploreEncounterChance = 1 / 10;
scenes.castle.enterEncounterChance = 1 / 20;
scenes.castle.drops = ['礦石', '金屬碎片', '金幣'];
scenes.lake.exploreEncounterChance = 1 / 10;
scenes.lake.enterEncounterChance = 1 / 20;
scenes.lake.periodEnemies = { 夜晚: ['湖怪'] };
scenes.lake.periodItems = { 清晨: ['漿果', '珍珠'], 正午: ['生水', '火種'], 傍晚: ['新鮮魚', '生水'], 夜晚: ['珍珠'] };
scenes.lake.drops = ['珍珠', '黏土', '新鮮魚'];
scenes.shore.drops = ['新鮮魚', '貝殼', '火種'];
expandedSceneKeys.forEach(sceneKey => {
    const scene = scenes[sceneKey];
    if (!scene.artTemplate) return;
    const template = scenes[scene.artTemplate];
    ['drops', 'exploreEncounterChance', 'enterEncounterChance', 'periodEnemies', 'periodItems'].forEach(key => {
        if (template[key] !== undefined) scene[key] = JSON.parse(JSON.stringify(template[key]));
    });
});

// ============= 敵人數據庫 =============
const enemyDatabase = {
    '森林狼': {
        emoji: '🐺',
        hp: 30,
        attack: 8,
        defense: 2,
        speed: 14,
        crit: 25,
        element: 'wind',
        level: 1
    },
    '樹妖': {
        emoji: '👾',
        hp: 40,
        attack: 10,
        defense: 5,
        speed: 10,
        crit: 15,
        element: 'wood',
        level: 2
    },
    '野狼': {
        emoji: '🐺',
        hp: 35,
        attack: 9,
        defense: 3,
        speed: 13,
        crit: 22,
        element: 'wind',
        level: 2
    },
    '盜匪': {
        emoji: '🗡️',
        hp: 40,
        attack: 12,
        defense: 4,
        speed: 11,
        crit: 20,
        element: 'normal',
        level: 2
    },
    '山地獸': {
        emoji: '🦌',
        hp: 50,
        attack: 15,
        defense: 8,
        speed: 9,
        crit: 15,
        element: 'earth',
        level: 3
    },
    '洞穴蝙蝠': {
        emoji: '🦇',
        hp: 25,
        attack: 6,
        defense: 1,
        speed: 18,
        crit: 30,
        element: 'wind',
        level: 2
    },
    '地底生物': {
        emoji: '👹',
        hp: 45,
        attack: 11,
        defense: 6,
        speed: 8,
        crit: 10,
        element: 'earth',
        level: 3
    },
    '城堡衛兵': {
        emoji: '🤖',
        hp: 55,
        attack: 14,
        defense: 10,
        speed: 10,
        crit: 12,
        element: 'normal',
        level: 4
    },
    '死靈騎士': {
        emoji: '💀',
        hp: 70,
        attack: 18,
        defense: 12,
        speed: 12,
        crit: 25,
        element: 'water',
        level: 5,
        boss: true
    },
    '湖怪': {
        emoji: '🐙',
        hp: 50,
        attack: 13,
        defense: 7,
        speed: 11,
        crit: 18,
        element: 'water',
        level: 3
    }
};

// ============= 屬性相剋表 =============
const elementCounter = {
    fire: { weak: 'water', strong: 'wood' },
    water: { weak: 'earth', strong: 'fire' },
    earth: { weak: 'wind', strong: 'water' },
    wind: { weak: 'lightning', strong: 'earth' },
    wood: { weak: 'fire', strong: 'earth' },
    lightning: { weak: 'earth', strong: 'wind' },
    normal: { weak: null, strong: null }
};

// ============= 主角數據 =============
let player = {
    name: '陳風',
    biome: 'jungle',
    level: 1,
    hp: 100,
    maxHp: 100,
    attack: 15,
    defense: 10,
    speed: 12,
    crit: 20,
    critDmg: 150,
    exp: 0,
    maxExp: 100,
    inventory: ['地圖'],
    equipment: {
        weapon: '鐵劍',
        armor: '皮盾'
    },
    elements: {
        fire: 0,
        water: 0,
        earth: 0,
        wind: 0,
        wood: 0,
        lightning: 0
    },
    // 行動值系統
    actionPoints: 200,
    maxActionPoints: 200,
    lastActionPointTime: Date.now(),
    // 新增：疲勞度系統 (0-100)
    fatigue: 0,
    maxFatigue: 100,
    // 新增：飽食度系統 (0-100，低於20為飢餓狀態)
    hunger: 100,
    maxHunger: 100,
    thirst: 100,
    maxThirst: 100,
    hungerDays: 0,  // 連續飢餓天數
    lastHungerCheckDay: -1,
    dehydrationGameMs: 0,
    starvationGameMs: 0,
    isPoisoned: false,
    poisonProgressMs: 0,
    // 新增：背包容量
    backpackCapacity: 20,
    currentBackpackUsage: 1,  // 初始只有地圖
    // 新增：是否在根據地中
    isAtBase: false,
    baseLocation: null,
    // 新增：生活技能等級
    skills: {
        exploration: 1,      // 探索
        identification: 1,   // 鑑定
        construction: 1,     // 建造
        research: 1          // 研發
    },
    skillExp: {
        exploration: 0,
        identification: 0,
        construction: 0,
        research: 0
    },
    skillMaxExp: 100
};

const initialPlayerData = JSON.parse(JSON.stringify(player));
const saveStorageKey = 'wilderness-survival-save-slots-v1';
const settingsStorageKey = 'wilderness-survival-settings-v1';
const menuMusicSettingsKey = 'wilderness-survival-menu-music-v1';
let soundEnabled = JSON.parse(localStorage.getItem(settingsStorageKey) || '{"soundEnabled":false}').soundEnabled;
const savedMenuMusicSettings = JSON.parse(localStorage.getItem(menuMusicSettingsKey) || '{"enabled":true,"theme":"jungle","volume":0.42}');
let menuMusicEnabled = savedMenuMusicSettings.enabled !== false;
let menuMusicTheme = ['jungle', 'island', 'grassland'].includes(savedMenuMusicSettings.theme) ? savedMenuMusicSettings.theme : 'jungle';
let menuMusicVolume = Number.isFinite(savedMenuMusicSettings.volume) ? Math.max(0, Math.min(1, savedMenuMusicSettings.volume)) : 0.42;
let activeSaveSlot = null;

// ============= 初始化遊戲 =============
function initGame() {
    document.getElementById('mainMenu').hidden = false;
    document.getElementById('gameScreen').hidden = true;
    document.getElementById('saveOverlay').hidden = true;
    document.getElementById('settingsOverlay').hidden = true;
    document.getElementById('collectionOverlay').hidden = true;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('realTimeZone').textContent = timeZone;
    document.getElementById('settingsTimeZone').textContent = timeZone;
    document.getElementById('menuLocalZone').textContent = `現實時區 · ${timeZone}`;
    document.getElementById('soundToggle').checked = soundEnabled;
    document.getElementById('soundToggleModal').checked = soundEnabled;
    document.getElementById('menuMusicToggle').checked = menuMusicEnabled;
    document.getElementById('menuMusicToggleModal').checked = menuMusicEnabled;
    document.getElementById('menuMusicTheme').value = menuMusicTheme;
    document.getElementById('menuMusicThemeModal').value = menuMusicTheme;
    document.getElementById('menuMusicVolume').value = Math.round(menuMusicVolume * 100);
    document.getElementById('menuMusicVolumeModal').value = Math.round(menuMusicVolume * 100);
    document.getElementById('menuMusicVolumeLabel').textContent = `${Math.round(menuMusicVolume * 100)}%`;
    document.getElementById('menuMusicVolumeModalLabel').textContent = `${Math.round(menuMusicVolume * 100)}%`;
    window.menuMusic.setTheme(menuMusicTheme);
    window.menuMusic.setEnabled(menuMusicEnabled);
    window.menuMusic.setVolume(menuMusicVolume);
    if (menuMusicEnabled) window.menuMusic.start(menuMusicTheme);
    player.lastActionPointTime = Date.now();
    gameState.lastPeriod = getCurrentGamePeriod();
    gameState.periodTransitionKey = getPeriodTransitionKey();
    // 初始化飢餓檢查日期
    player.lastHungerCheckDay = gameState.gameDay;
    // 初始化時間系統
    startTimeSystem();
    updateUI();
    showScene('entrance');
    updateGameMode();
}

function createStartingBase(biome, location) {
    const type = ({ jungle: 'forest', island: 'riverside', grassland: 'plains' })[biome] || 'forest';
    const id = `base_starter_${Date.now()}`;
    gameState.bases[id] = {
        id,
        type,
        location,
        structures: ['grass_mat', 'fireplace'],
        storage: ['木材', '火種'],
        createdDay: gameState.gameDay,
        isStarter: true
    };
    gameState.currentBaseId = id;
    player.baseLocation = location;
    player.isAtBase = true;
    generateBaseResources();
}

function startNewGame() {
    player = JSON.parse(JSON.stringify(initialPlayerData));
    const startingRegions = { jungle: 'forest', island: 'river', grassland: 'field' };
    const availableBiomes = Object.keys(startingRegions);
    player.biome = availableBiomes[Math.floor(Math.random() * availableBiomes.length)];
    const now = Date.now();
    gameState.currentScene = startingRegions[player.biome];
    gameState.isInBattle = false;
    gameState.battleEnemy = null;
    gameState.gameDay = 1;
    gameState.lastPeriod = null;
    gameState.periodTransitionKey = null;
    gameState.gameTimeOffsetMs = 0;
    gameState.gameClockStartRealMs = now;
    gameState.gameClockStartMs = now;
    gameState.gameClockPaused = false;
    gameState.bases = {};
    gameState.currentBaseId = null;
    player.lastActionPointTime = now;
    player.dehydrationGameMs = 0;
    player.starvationGameMs = 0;
    player.isPoisoned = false;
    player.poisonProgressMs = 0;
    gameState.lastSurvivalTickRealMs = now;
    gameState.lastPeriod = getCurrentGamePeriod();
    gameState.periodTransitionKey = getPeriodTransitionKey();
    createStartingBase(player.biome, gameState.currentScene);
    activeSaveSlot = null;
    enterGame();
    showScene(gameState.currentScene);
    updateUI();
}

function enterGame() {
    resumeGameClock();
    window.menuMusic.stop();
    document.getElementById('mainMenu').hidden = true;
    document.getElementById('gameScreen').hidden = false;
    updateUI();
}

function returnToMainMenu() {
    if (gameState.isInBattle) return;
    pauseGameClock();
    document.getElementById('messageModal').classList.remove('active');
    document.getElementById('gameScreen').hidden = true;
    document.getElementById('mainMenu').hidden = false;
    if (menuMusicEnabled) window.menuMusic.start(menuMusicTheme);
}

function getSaveSlots() {
    try {
        return JSON.parse(localStorage.getItem(saveStorageKey) || '[]').slice(0, 3);
    } catch {
        return [];
    }
}

function openSaveSlots(mode) {
    const overlay = document.getElementById('saveOverlay');
    const title = document.getElementById('saveOverlayTitle');
    title.textContent = mode === 'save' ? '選擇存檔欄位' : '讀取進度';
    renderSaveSlots(mode);
    overlay.dataset.mode = mode;
    overlay.hidden = false;
}

function renderSaveSlots(mode) {
    const slots = getSaveSlots();
    const list = document.getElementById('saveSlotList');
    list.replaceChildren();
    for (let index = 0; index < 3; index++) {
        const save = slots.find(entry => entry.slot === index);
        const button = document.createElement('button');
        button.className = 'save-slot';
        button.disabled = mode === 'load' && !save;
        button.innerHTML = `<span class="slot-number">0${index + 1}</span><span class="slot-detail"><strong>${save ? save.name : '空存檔欄位'}</strong><small>${save ? `${save.sceneName} · ${new Date(save.savedAt).toLocaleString()}` : '尚未建立進度'}</small></span><span class="slot-action">${save ? (mode === 'save' ? '覆蓋' : '讀取') : (mode === 'save' ? '建立' : '空') }　›</span>`;
        button.onclick = () => mode === 'save' ? saveToSlot(index) : loadFromSlot(index);
        list.appendChild(button);
    }
}

function saveToSlot(slot) {
    const slots = getSaveSlots().filter(entry => entry.slot !== slot);
    const defaultName = `第 ${gameState.gameDay} 天`;
    const name = prompt('請輸入存檔名稱：', defaultName);
    if (name === null) return;
    slots.push({
        slot,
        name: name.trim() || defaultName,
        savedAt: Date.now(),
        sceneName: scenes[gameState.currentScene]?.name || gameState.currentScene,
        player: JSON.parse(JSON.stringify(player)),
        gameState: JSON.parse(JSON.stringify(gameState))
    });
    localStorage.setItem(saveStorageKey, JSON.stringify(slots));
    activeSaveSlot = slot;
    renderSaveSlots('save');
    showMessage('存檔完成。這個存檔保存在目前瀏覽器中。');
}

function loadFromSlot(slot) {
    const save = getSaveSlots().find(entry => entry.slot === slot);
    if (!save) return;
    player = save.player;
    player.dehydrationGameMs = Number(player.dehydrationGameMs) || 0;
    player.starvationGameMs = Number(player.starvationGameMs) || 0;
    player.isPoisoned = Boolean(player.isPoisoned);
    player.poisonProgressMs = Number(player.poisonProgressMs) || 0;
    player.inventory = (player.inventory || []).map(item => item === '淡水' ? '可飲用水' : item);
    player.currentBackpackUsage = player.inventory?.length || 0;
    if (!['jungle', 'island', 'grassland'].includes(player.biome)) player.biome = 'jungle';
    Object.assign(gameState, save.gameState);
    const now = Date.now();
    gameState.gameClockStartRealMs = now;
    gameState.gameClockStartMs = now;
    player.lastActionPointTime = now;
    gameState.lastSurvivalTickRealMs = now;
    gameState.isInBattle = false;
    gameState.battleEnemy = null;
    activeSaveSlot = slot;
    closeOverlay('saveOverlay');
    enterGame();
    showScene(gameState.currentScene);
    updateUI();
}

function openOverlay(id) {
    if (id === 'collectionOverlay') showCollection('art');
    document.getElementById(id).hidden = false;
}

function closeOverlay(id) {
    document.getElementById(id).hidden = true;
}

function showCollection(view) {
    const frame = document.getElementById('collectionFrame');
    const artGallery = document.getElementById('collectionAssetGallery');
    if (view === 'art') {
        frame.hidden = true;
        artGallery.hidden = false;
        if (artGallery.dataset.loaded === 'true') return;

        const menuImage = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=85';
        const assets = [
            { title: '主選單叢林背景', subtitle: '主選單現用背景', image: menuImage },
            ...window.sceneArt.scenes.map(sceneKey => ({
                title: window.sceneArt.titles.jungle[sceneKey],
                subtitle: '遊戲場景 · 叢林',
                image: window.sceneArt.get(sceneKey, 'jungle')
            }))
        ];
        const grid = document.createElement('div');
        grid.className = 'scene-art-grid';
        assets.forEach(asset => {
            const card = document.createElement('article');
            card.className = 'scene-art-card';
            const image = document.createElement('div');
            image.className = 'scene-art-image';
            image.setAttribute('role', 'img');
            image.setAttribute('aria-label', asset.title);
            image.style.backgroundImage = `url("${asset.image}")`;
            const caption = document.createElement('div');
            caption.className = 'scene-art-caption';
            caption.textContent = asset.title;
            const subtitle = document.createElement('small');
            subtitle.textContent = asset.subtitle;
            caption.appendChild(subtitle);
            card.append(image, caption);
            grid.appendChild(card);
        });
        artGallery.replaceChildren(grid);
        artGallery.dataset.loaded = 'true';
        return;
    }

    artGallery.hidden = true;
    frame.hidden = false;
    frame.src = view === 'characters' ? 'character_details.html' : 'gallery.html';
}

function selectInfoPanel(panelName) {
    document.querySelectorAll('.panel-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.panel === panelName));
    document.querySelectorAll('.info-panel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${panelName}`));
}

function setSoundEnabled(enabled) {
    soundEnabled = enabled;
    localStorage.setItem(settingsStorageKey, JSON.stringify({ soundEnabled }));
    document.getElementById('soundToggle').checked = enabled;
    document.getElementById('soundToggleModal').checked = enabled;
    if (enabled) playUiSound(660);
}

function setMenuMusicEnabled(enabled) {
    menuMusicEnabled = Boolean(enabled);
    localStorage.setItem(menuMusicSettingsKey, JSON.stringify({ enabled: menuMusicEnabled, theme: menuMusicTheme, volume: menuMusicVolume }));
    document.getElementById('menuMusicToggle').checked = menuMusicEnabled;
    document.getElementById('menuMusicToggleModal').checked = menuMusicEnabled;
    window.menuMusic.setEnabled(menuMusicEnabled);
    if (menuMusicEnabled && !document.getElementById('mainMenu').hidden) {
        window.menuMusic.start(menuMusicTheme);
    }
}

function setMenuMusicTheme(theme) {
    if (!['jungle', 'island', 'grassland'].includes(theme)) return;
    menuMusicTheme = theme;
    localStorage.setItem(menuMusicSettingsKey, JSON.stringify({ enabled: menuMusicEnabled, theme: menuMusicTheme, volume: menuMusicVolume }));
    document.getElementById('menuMusicTheme').value = menuMusicTheme;
    document.getElementById('menuMusicThemeModal').value = menuMusicTheme;
    window.menuMusic.setTheme(menuMusicTheme);
    if (menuMusicEnabled && !document.getElementById('mainMenu').hidden) {
        window.menuMusic.start(menuMusicTheme);
    }
}

function setMenuMusicVolume(value) {
    menuMusicVolume = Math.max(0, Math.min(1, Number(value) / 100));
    localStorage.setItem(menuMusicSettingsKey, JSON.stringify({ enabled: menuMusicEnabled, theme: menuMusicTheme, volume: menuMusicVolume }));
    const label = `${Math.round(menuMusicVolume * 100)}%`;
    document.getElementById('menuMusicVolume').value = Math.round(menuMusicVolume * 100);
    document.getElementById('menuMusicVolumeModal').value = Math.round(menuMusicVolume * 100);
    document.getElementById('menuMusicVolumeLabel').textContent = label;
    document.getElementById('menuMusicVolumeModalLabel').textContent = label;
    window.menuMusic.setVolume(menuMusicVolume);
}

function playUiSound(frequency = 480) {
    if (!soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.035, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.08);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.08);
    oscillator.onended = () => audio.close();
}

function selectPeriodIcon(period) {
    return ({ 清晨: '🌅', 正午: '☀️', 傍晚: '🌇', 夜晚: '🌙' })[period] || '🌤️';
}

function updateGameMode() {
    const isBattle = gameState.isInBattle;
    const isBase = player.isAtBase && Boolean(gameState.currentBaseId);
    document.getElementById('movementControls').hidden = isBattle || isBase;
    document.getElementById('fieldActions').hidden = isBattle || isBase;
    document.getElementById('baseActions').hidden = isBattle || !isBase;
    document.getElementById('baseSection').hidden = !isBase;
    document.getElementById('battleSection').classList.toggle('active', isBattle);
    const gatherButton = document.getElementById('gatherButton');
    const scene = scenes[gameState.currentScene];
    gatherButton.textContent = scene?.canFish || scene?.items?.includes('新鮮魚') ? '🎣 釣魚' : '🌿 採集';
    gatherButton.hidden = isBattle || isBase || scene?.canGather === false;
    document.getElementById('sceneDisplay').classList.toggle('base-scene', isBase);
    document.getElementById('sceneDisplay').classList.toggle('battle-scene', isBattle);
    if (isBattle && gameState.battleEnemy) {
        document.getElementById('sceneEmoji').textContent = gameState.battleEnemy.emoji;
        document.getElementById('sceneName').textContent = `${gameState.battleEnemy.name} 擋住去路`;
        document.getElementById('sceneDescription').textContent = '敵人就在前方，選擇你的戰鬥行動。';
        document.getElementById('sceneInfo').textContent = '戰鬥中：無法移動或進行其他探索行動。';
    }
}

function gatherAtScene() {
    const scene = scenes[gameState.currentScene];
    if (scene.canGather === false) {
        showMessage('這個區域沒有可採集的資源。');
        return;
    }
    const waterItem = scene.waterSource === 'fresh' ? '生水' : scene.waterSource === 'sea' ? '海水' : null;
    const fishItems = (scene.items || []).filter(item => item === '新鮮魚');
    const targetItems = waterItem ? [waterItem, ...fishItems] : scene.canFish || fishItems.length ? ['新鮮魚'] : scene.items;
    if (!targetItems?.length) {
        showMessage('這裡沒有可採集的素材。');
        return;
    }
    if (!consumeAction(1)) return;
    const item = targetItems[Math.floor(Math.random() * targetItems.length)];
    if (!addInventoryItem(item)) {
        showMessage('背包已滿，無法收下發現的素材。');
        return;
    }
    showMessage(`${scene.canFish || scene.items?.includes('新鮮魚') ? '🎣' : '🌿'} 獲得素材：${item}。`);
    updateUI();
}

function useInventoryItem() {
    const usable = [...new Set(player.inventory.filter(item => ['生肉', '熟肉', '漿果', '野生漿果', '生水', '可飲用水', '治療藥水', '解毒藥', '麵包'].includes(item)))];
    if (!usable.length) {
        showMessage('背包裡沒有可立即使用的食物、飲水或藥品。');
        return;
    }
    const choice = prompt(`輸入要使用的物品名稱：\n${usable.join('、')}`, usable[0]);
    if (!choice || !usable.includes(choice)) return;
    if (['生水', '可飲用水'].includes(choice)) return drinkWater(choice);
    if (['生肉', '熟肉', '漿果', '野生漿果', '麵包'].includes(choice)) return useFood(choice);
    if (!consumeAction(1)) return;
    player.inventory.splice(player.inventory.indexOf(choice), 1);
    if (choice === '解毒藥') {
        player.isPoisoned = false;
        player.poisonProgressMs = 0;
    } else {
        player.hp = Math.min(player.maxHp, player.hp + 50);
    }
    updateUI();
    showMessage(choice === '解毒藥' ? '使用解毒藥，中毒狀態已解除。' : `使用${choice}，恢復 50 點生命。`);
}

function openCraftPanel() {
    if (!player.isAtBase) return;
    const structures = Object.entries(baseStructures).map(([id, entry]) => `${id}: ${entry.name}（${formatRecipe(entry.recipe)}）`);
    const items = Object.entries(itemRecipes).map(([id, entry]) => `${id}: ${entry.name}（${formatRecipe(entry.recipe)}）`);
    const id = prompt(`輸入要製作的代碼（僅限根據地）：\n${[...structures, ...items].join('\n')}`, 'wood_bed');
    if (!id) return;
    if (baseStructures[id]) constructStructure(id);
    else if (itemRecipes[id]) craftItem(id);
    else showMessage('找不到這個配方代碼。');
}

function formatRecipe(recipe) {
    return Object.entries(recipe || {}).map(([name, quantity]) => `${name}×${quantity}`).join('、');
}

function craftItem(itemId) {
    const recipe = itemRecipes[itemId];
    if (!player.isAtBase || !gameState.currentBaseId || !recipe) return;
    if (!hasItems(recipe.recipe)) {
        showMessage(`素材不足，需要：${formatRecipe(recipe.recipe)}。`);
        return;
    }
    if (player.inventory.length - Object.values(recipe.recipe).reduce((sum, count) => sum + count, 0) + 1 > player.backpackCapacity) {
        showMessage('背包空間不足，無法收下製作成品。');
        return;
    }
    if (!consumeAction(2)) return;
    consumeInventoryItems(recipe.recipe);
    addInventoryItem(recipe.name);
    addSkillExp('construction', 10);
    showMessage(`製作完成：${recipe.icon} ${recipe.name}。`);
    updateUI();
}

function openItemCatalog() {
    const list = document.getElementById('itemCatalogList');
    list.replaceChildren();
    itemCatalog.forEach(([id, name, description, effect, source]) => {
        const entry = document.createElement('article');
        entry.className = 'item-catalog-entry';
        const heading = document.createElement('strong');
        heading.textContent = `${id} · ${name}`;
        const detail = document.createElement('small');
        detail.textContent = `${description}｜效果：${effect}｜取得：${source}`;
        entry.append(heading, detail);
        list.appendChild(entry);
    });
    document.getElementById('itemCatalogOverlay').hidden = false;
}

function openResearchPanel() {
    if (!player.isAtBase) return;
    if (!consumeAction(2)) return;
    player.skills.research += 1;
    addDiscovery('在營地完成一次野外研究');
    showMessage(`研究完成。研發技能提升至 Lv.${player.skills.research}。`);
    updateUI();
}

// ============= 時間系統 =============
/**
 * 啟動遊戲時間系統，每小時檢查一次飢餓和疲勞
 */
function startTimeSystem() {
    // 每 10 秒檢查 GMT+8 時段切換及行動值自然回復
    setInterval(() => {
        if (document.hidden || document.getElementById('gameScreen').hidden) {
            pauseGameClock();
            gameState.lastSurvivalTickRealMs = Date.now();
            return;
        }
        resumeGameClock();
        checkHungerSystem();
        checkPeriodTransition();
        checkActionPointRecovery();
        updateUI();
    }, 10000);
}

function getGMT8Date() {
    const elapsedRealMs = gameState.gameClockPaused ? 0 : Date.now() - gameState.gameClockStartRealMs;
    const acceleratedNow = gameState.gameClockStartMs + (elapsedRealMs * 24) + (gameState.gameTimeOffsetMs || 0);
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(acceleratedNow));
    return Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
}

function pauseGameClock() {
    if (gameState.gameClockPaused) return;
    const now = Date.now();
    gameState.gameClockStartMs += (now - gameState.gameClockStartRealMs) * 24;
    gameState.gameClockStartRealMs = now;
    gameState.gameClockPaused = true;
    gameState.lastSurvivalTickRealMs = now;
}

function resumeGameClock() {
    if (!gameState.gameClockPaused) return;
    gameState.gameClockStartRealMs = Date.now();
    gameState.gameClockPaused = false;
    gameState.lastSurvivalTickRealMs = Date.now();
}

function getCurrentGamePeriod() {
    const hour = getGMT8Date().hour;
    if (hour >= 6 && hour < 12) return '清晨';
    if (hour >= 12 && hour < 18) return '正午';
    if (hour >= 18) return '傍晚';
    return '夜晚';
}

function getPeriodTransitionKey() {
    const time = getGMT8Date();
    return `${time.year}-${time.month}-${time.day}-${time.hour}-${getCurrentGamePeriod()}`;
}

function checkPeriodTransition() {
    const key = getPeriodTransitionKey();
    if (!gameState.periodTransitionKey) {
        gameState.periodTransitionKey = key;
        return;
    }
    if (key === gameState.periodTransitionKey) return;

    const previousPeriod = gameState.lastPeriod;
    const currentPeriod = getCurrentGamePeriod();
    gameState.periodTransitionKey = key;
    if (currentPeriod === previousPeriod) return;
    gameState.lastPeriod = currentPeriod;
    if (previousPeriod === '夜晚' && currentPeriod === '清晨') gameState.gameDay++;

    player.hunger = Math.max(0, player.hunger - gameRules.periodNeedsCost);
    player.thirst = Math.max(0, player.thirst - gameRules.periodNeedsCost);
    player.fatigue = Math.min(player.maxFatigue, player.fatigue + gameRules.periodNeedsCost);
    addDiscovery(`進入${currentPeriod}：飽食 -20、飲水 -20、疲勞 +20`);
    enforceNeedsReturn();
    updateUI();
}

function enforceNeedsReturn() {
    if (player.fatigue >= player.maxFatigue) {
        forceReturnToBase('疲勞達上限');
        return false;
    }
    return true;
}

function forceReturnToBase(reason) {
    player.isAtBase = Boolean(player.baseLocation);
    gameState.currentScene = player.baseLocation || 'entrance';
    if (gameState.isInBattle) endBattle();
    showScene(gameState.currentScene);
    showMessage(`⚠️ ${reason}，已強制返回根據地。`);
    updateUI();
}

function consumeAction(actionCost = 1, fatigue = 0, allowDuringBattle = false) {
    if (gameState.isInBattle && !allowDuringBattle) {
        showMessage('⚔️ 戰鬥中不能進行其他行動。');
        return false;
    }
    checkActionPointRecovery();
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足，需要 ${actionCost} 點（目前 ${player.actionPoints}/${player.maxActionPoints}）。`);
        return false;
    }
    player.actionPoints -= actionCost;
    const mayContinue = consumeNeedsOnly(fatigue);
    updateUI();
    return mayContinue;
}

function consumeNeedsOnly(fatigue = 0) {
    player.hunger = Math.max(0, player.hunger - gameRules.actionNeedsCost);
    player.thirst = Math.max(0, player.thirst - gameRules.actionNeedsCost);
    player.fatigue = Math.min(player.maxFatigue, player.fatigue + fatigue);
    return enforceNeedsReturn();
}

function pickSceneEnemy(scene) {
    const available = (scene.enemies || []).filter(name => enemyDatabase[name]);
    return available[Math.floor(Math.random() * available.length)] || null;
}

function hasItems(required) {
    return Object.entries(required).every(([item, quantity]) =>
        player.inventory.filter(owned => owned === item).length >= quantity
    );
}

function consumeInventoryItems(required) {
    for (const [item, quantity] of Object.entries(required)) {
        for (let count = 0; count < quantity; count++) {
            player.inventory.splice(player.inventory.indexOf(item), 1);
        }
    }
    player.currentBackpackUsage = player.inventory.length;
}

function poisonPlayer(reason) {
    player.isPoisoned = true;
    player.poisonProgressMs = 0;
    addDiscovery(`中毒：${reason}`);
}

function addInventoryItem(item) {
    if (player.inventory.length >= player.backpackCapacity) return false;
    player.inventory.push(item);
    player.currentBackpackUsage = player.inventory.length;
    return true;
}

function hasLightSource(requiredItem) {
    return player.inventory.includes(requiredItem) || player.inventory.includes('蠟燭') || player.inventory.includes('火把');
}

/**
 * 檢查飢餓系統
 * 改為基於行動消耗，不再基於實時時間
 * 只檢查連續飢餓天數和死亡機制
 */
function checkHungerSystem() {
    const now = Date.now();
    const lastTick = Number(gameState.lastSurvivalTickRealMs) || now;
    const elapsedRealMs = Math.max(0, now - lastTick);
    gameState.lastSurvivalTickRealMs = now;
    const elapsedGameMs = elapsedRealMs * 24;

    player.dehydrationGameMs = player.thirst < 20 ? (player.dehydrationGameMs || 0) + elapsedGameMs : 0;
    player.starvationGameMs = player.hunger < 20 ? (player.starvationGameMs || 0) + elapsedGameMs : 0;

    if (player.isPoisoned) {
        player.poisonProgressMs = (player.poisonProgressMs || 0) + elapsedRealMs;
        while (player.poisonProgressMs >= gameRules.poisonDamageIntervalMs && player.isPoisoned) {
            player.poisonProgressMs -= gameRules.poisonDamageIntervalMs;
            const damage = Math.max(1, Math.ceil(player.maxHp * gameRules.poisonDamagePercent));
            player.hp = Math.max(0, player.hp - damage);
            addDiscovery(`中毒發作：生命值 -${damage}`);
            if (player.hp <= 0) {
                playerDeath('中毒傷勢');
                return;
            }
        }
    }

    if (player.dehydrationGameMs > gameRules.dehydrationDeathGameMs) {
        playerDeath('脫水超過一天');
        return;
    }
    if (player.starvationGameMs > gameRules.starvationDeathGameMs) {
        playerDeath('飢餓超過三天');
        return;
    }
    enforceNeedsReturn();
}

function addDiscovery(entry) {
    if (!Array.isArray(gameState.discoveries)) gameState.discoveries = [];
    gameState.discoveries.unshift({ entry, discoveredAt: Date.now() });
    gameState.discoveries = gameState.discoveries.slice(0, 100);
}

// ============= 移動系統 =============
function move(direction) {
    if (gameState.isInBattle) {
        showMessage('戰鬥中無法移動！');
        return;
    }

    const currentSceneData = scenes[gameState.currentScene];
    if (!currentSceneData || !Object.prototype.hasOwnProperty.call(currentSceneData.neighbors, direction)) {
        showMessage('⚠️ 無效的移動方向。');
        return;
    }
    const nextSceneName = currentSceneData.neighbors[direction];

    if (!nextSceneName) {
        showMessage('這個方向無法前進...');
        return;
    }

    if (scenes[nextSceneName].type === 'dark' && !hasLightSource(scenes[nextSceneName].requiredItem)) {
        showMessage(`⚠️ 需要 ${scenes[nextSceneName].requiredItem} 才能進入該場景。`);
        return;
    }

    if (!consumeAction(1)) return;

    gameState.currentScene = nextSceneName;
    player.isAtBase = Boolean(player.baseLocation && nextSceneName === player.baseLocation);
    showScene(nextSceneName);

    // 每次進入場景只檢查一次 1/20 機率，依目標場景的敵人設定。
    const entryKey = `${nextSceneName}:${Date.now()}`;
    gameState.enteredSceneEncounterKey = entryKey;
    const destination = scenes[nextSceneName];
    if (destination.enemies && Math.random() < (destination.enterEncounterChance ?? gameRules.sceneEntryEncounterChance)) {
        startBattle(pickSceneEnemy(destination));
        return;
    }

}

// ============= 時間系統 =============
/**
 * 獲取 GMT+8 當前小時 (0-23)
 */
function getCurrentHourGMT8() {
    return getGMT8Date().hour;
}

/**
 * 玩家死亡系統
 */
function playerDeath(cause = '生存需求耗盡') {
    const lostItems = [...player.inventory];
    player.inventory = [];
    player.currentBackpackUsage = 0;
    player.hp = Math.floor(player.maxHp * 0.5);
    player.hunger = 50;
    player.thirst = 50;
    player.dehydrationGameMs = 0;
    player.starvationGameMs = 0;
    player.isPoisoned = false;
    player.poisonProgressMs = 0;
    player.isAtBase = Boolean(player.baseLocation);
    gameState.currentScene = player.baseLocation || 'entrance';
    gameState.isInBattle = false;
    gameState.battleEnemy = null;
    document.getElementById('battleSection').classList.remove('active');
    gameState.lastSurvivalTickRealMs = Date.now();
    showScene(gameState.currentScene);
    showMessage(`💀 你因【${cause}】倒下，醒來時已被送回根據地。身上可攜帶物品全數遺失：${lostItems.join('、') || '無'}。生命、飽食與水分已恢復一半。`);
    updateUI();
}

/**
 * 檢查並恢復行動值
 * 每個整點小時恢復 1 點行動值，最多恢復到最大值
 */
function checkActionPointRecovery() {
    const now = Date.now();
    if (!Number.isFinite(player.lastActionPointTime)) player.lastActionPointTime = now;
    const interval = gameRules.actionPointRecoveryMinutes * 60 * 1000;
    const elapsedIntervals = Math.floor((now - player.lastActionPointTime) / interval);
    if (elapsedIntervals <= 0) return;
    player.actionPoints = Math.min(player.maxActionPoints, player.actionPoints + elapsedIntervals);
    player.lastActionPointTime += elapsedIntervals * interval;
}

/**
 * 建造根據地
 */
function buildBase() {
    const baseTypesList = Object.keys(baseTypes);
    let message = '選擇根據地類型：\n\n';
    baseTypesList.forEach((type, index) => {
        const base = baseTypes[type];
        message += `${index + 1}. ${base.name}\n   ${base.description}\n   特性：${base.features.join('、')}\n\n`;
    });
    
    const choice = prompt(message + '請輸入選項編號 (1-4)：');
    if (choice === null) return;
    const typeIndex = parseInt(choice) - 1;
    
    if (typeIndex < 0 || typeIndex >= baseTypesList.length) {
        showMessage('無效的選擇');
        return;
    }

    const actionCost = 5;
    if (!consumeAction(actionCost)) return;
    
    const selectedType = baseTypesList[typeIndex];
    const baseId = `base_${Date.now()}`;
    
    // 初始化根據地
    const newBase = {
        id: baseId,
        type: selectedType,
        location: baseTypes[selectedType].startingLocation || gameState.currentScene,
        structures: [],
        storage: [],  // 根據地儲存空間
        createdDay: gameState.gameDay
    };
    
    gameState.bases[baseId] = newBase;
    gameState.currentBaseId = baseId;
    player.baseLocation = newBase.location;
    gameState.currentScene = newBase.location;
    player.isAtBase = true;
    
    // 初始生成一些資源
    generateBaseResources();
    
    addSkillExp('construction', 30);
    showMessage(`🏕️ 成功建造了 ${baseTypes[selectedType].name}！\n這將是你的根據地。\n建造經驗 +30`);
    updateUI();
}

/**
 * 檢查是否應該在這個小時生成敵人
 * 每個整點小時有 50% 機率生成敵人
 */
function shouldGenerateEnemy(probability = 1 / 8) {
    return Math.random() < probability;
}

/**
 * 根據地內睡眠
 */
function sleepAtBase() {
    if (!player.isAtBase) {
        showMessage('⚠️ 只能在根據地內睡眠！');
        return;
    }
    
    const currentBase = gameState.bases[gameState.currentBaseId];
    if (!currentBase) {
        showMessage('⚠️ 根據地不存在！');
        return;
    }

    if (!consumeAction(3)) return;
    const bedRecovery = currentBase.structures.reduce((best, structure) =>
        Math.max(best, ({ grass_mat: 40, wood_bed: 60, spring_bed: 80 })[structure] || 0), 20);
    player.fatigue = Math.max(0, player.fatigue - bedRecovery);
    player.hp = Math.min(player.hp + 20, player.maxHp);
    player.hunger = Math.max(1, player.hunger);
    player.thirst = Math.max(1, player.thirst);

    // 遊戲的一日等於實時一小時；睡眠直接推進至下一個整點後的清晨（01 分）。
    const elapsedRealMs = Date.now() - gameState.gameClockStartRealMs;
    const virtualNowMs = gameState.gameClockStartMs + (elapsedRealMs * 24) + (gameState.gameTimeOffsetMs || 0);
    const now = new Date(virtualNowMs);
    const target = new Date(now);
    target.setDate(target.getDate() + 1);
    target.setHours(0, 1, 0, 0);
    gameState.gameTimeOffsetMs += target.getTime() - virtualNowMs;
    gameState.gameDay++;
    gameState.lastPeriod = '清晨';
    gameState.periodTransitionKey = getPeriodTransitionKey();

    showMessage(`😴 睡眠完成，疲勞降低 ${bedRecovery} 點，血量恢復 20。時間已推進至隔天清晨。`);
    updateUI();
}

/**
 * 在根據地內進食
 */
function eatAtBase() {
    if (!player.isAtBase) {
        showMessage('⚠️ 只能在根據地內進食！');
        return;
    }
    
    const currentBase = gameState.bases[gameState.currentBaseId];
    if (!currentBase) {
        showMessage('⚠️ 根據地不存在！');
        return;
    }
    
    // 先吃根據地儲存的料理 / 食物。
    const foodItems = currentBase.storage.filter(item => ['生肉', '熟肉', '漿果', '野生漿果', '麵包', '新鮮魚'].includes(item));
    
    if (foodItems.length === 0) {
        showMessage('⚠️ 根據地內沒有食物！');
        return;
    }
    
    const selectedFood = foodItems[0];
    
    if (!consumeAction(1)) return;
    const hungerGain = ({ 生肉: 10, 熟肉: 40, 漿果: 10, 野生漿果: 10, 麵包: 20, 新鮮魚: 20 })[selectedFood] || 0;
    player.hunger = Math.min(player.hunger + hungerGain, player.maxHunger);
    if (selectedFood === '生肉' && Math.random() < gameRules.rawMeatPoisonChance) poisonPlayer('食用根據地儲存的生肉');
    
    // 移除已食用的食物
    const index = currentBase.storage.indexOf(selectedFood);
    if (index > -1) {
        currentBase.storage.splice(index, 1);
    }
    
    showMessage(`🍖 你吃了 ${selectedFood}。飽食度 +${hungerGain}${player.isPoisoned ? '，並已中毒' : ''}。`);
    updateUI();
}

function useFood(itemName) {
    const itemIndex = player.inventory.indexOf(itemName);
    if (itemIndex < 0) {
        showMessage(`⚠️ 背包沒有${itemName}。`);
        return;
    }
    if (!consumeAction(1)) return;
    player.inventory.splice(itemIndex, 1);
    player.currentBackpackUsage = player.inventory.length;
    const hungerGain = ({ 生肉: 10, 熟肉: 40, 漿果: 10, 野生漿果: 10, 麵包: 20, 新鮮魚: 20 })[itemName] || 0;
    player.hunger = Math.min(player.maxHunger, player.hunger + hungerGain);
    if (itemName === '生肉') {
        if (Math.random() < gameRules.rawMeatPoisonChance) {
            poisonPlayer('食用生肉');
            showMessage(`🍖 吃下生肉，飽足度 +${hungerGain}。生肉受到污染，你中毒了！`);
        } else {
            showMessage(`🍖 吃下生肉，飽足度 +${hungerGain}。`);
        }
    } else {
        showMessage(`🍽️ 使用 ${itemName}，飽食度 +${hungerGain}。`);
    }
    updateUI();
}

function cookFood() {
    if (!player.isAtBase || !gameState.currentBaseId) {
        showMessage('⚠️ 只能在根據地料理。');
        return;
    }
    const base = gameState.bases[gameState.currentBaseId];
    if (!base.structures.includes('fireplace')) {
        showMessage('⚠️ 需要先建造篝火才能料理。');
        return;
    }
    const choices = [
        ['肉', '料理熟肉：生肉×1 + 火種×1'],
        ['水', '煮沸生水：生水×1 + 火種×1'],
        ['海', '煮製海水：海水×1 + 火種×1（獲得可飲用水與鹽）']
    ];
    const choice = prompt(`選擇料理內容：\n${choices.map(([key, label]) => `${key}：${label}`).join('\n')}`, '肉');
    if (!choice) return;
    if (choice.startsWith('肉')) return cookAtBase('meat');
    if (choice.startsWith('水')) return cookAtBase('freshWater');
    if (choice.startsWith('海')) return cookAtBase('seaWater');
    showMessage('請輸入「肉」、「水」或「海」選擇料理。');
}

function cookAtBase(recipeKey) {
    const recipes = {
        meat: { input: { 生肉: 1, 火種: 1 }, output: ['熟肉'], message: '熟肉 +1。' },
        freshWater: { input: { 生水: 1, 火種: 1 }, output: ['可飲用水'], thirstGain: 10, message: '可飲用水 +1，煮沸時水分 +10。' },
        seaWater: { input: { 海水: 1, 火種: 1 }, output: ['可飲用水', '鹽'], thirstGain: 10, message: '可飲用水 +1、鹽 +1，煮製時水分 +10。' }
    };
    const recipe = recipes[recipeKey];
    if (!recipe || !player.isAtBase || !gameState.currentBaseId) return;
    const base = gameState.bases[gameState.currentBaseId];
    if (!base.structures.includes('fireplace') && !(recipeKey === 'seaWater' && base.structures.includes('purifier'))) {
        showMessage('需要根據地篝火；煮製海水也可使用海水淨化設施。');
        return;
    }
    if (!hasItems(recipe.input)) {
        showMessage(`素材不足，需要：${formatRecipe(recipe.input)}。`);
        return;
    }
    const inputCount = Object.values(recipe.input).reduce((sum, count) => sum + count, 0);
    const outputCount = recipe.output.length + (recipeKey === 'seaWater' && base.structures.includes('saltMaker') ? 1 : 0);
    if (player.inventory.length - inputCount + outputCount > player.backpackCapacity) {
        showMessage('背包空間不足，無法收下料理成品。');
        return;
    }
    if (!consumeAction(3)) return;
    consumeInventoryItems(recipe.input);
    const outputs = recipeKey === 'seaWater' && base.structures.includes('saltMaker')
        ? [...recipe.output, '鹽']
        : recipe.output;
    outputs.forEach(item => addInventoryItem(item));
    if (recipe.thirstGain) player.thirst = Math.min(player.maxThirst, player.thirst + recipe.thirstGain);
    showMessage(`🔥 烹煮完成：${recipe.message}`);
    updateUI();
}

function drinkWater(itemName = '可飲用水') {
    if (!player.inventory.includes(itemName) || !['生水', '可飲用水'].includes(itemName)) {
        showMessage(`⚠️ 背包沒有${itemName}。`);
        return;
    }
    if (!consumeAction(1)) return;
    player.inventory.splice(player.inventory.indexOf(itemName), 1);
    player.currentBackpackUsage = player.inventory.length;
    const waterGain = itemName === '生水' ? 10 : 30;
    player.thirst = Math.min(player.maxThirst, player.thirst + waterGain);
    if (itemName === '生水' && Math.random() < gameRules.rawWaterPoisonChance) {
        poisonPlayer('飲用未煮沸生水');
        showMessage(`💧 飲用生水，水分 +${waterGain}，但受到污染而中毒！`);
    } else {
        showMessage(`💧 飲用${itemName}，水分 +${waterGain}。`);
    }
    updateUI();
}

function purifyWater() {
    if (!player.isAtBase || !gameState.currentBaseId) {
        showMessage('⚠️ 只能在根據地淨化海水。');
        return;
    }
    const base = gameState.bases[gameState.currentBaseId];
    if (!base.structures.includes('fireplace') && !base.structures.includes('purifier')) {
        showMessage('⚠️ 需要根據地篝火或海水淨化設施才能煮製海水。');
        return;
    }
    cookAtBase('seaWater');
}

/**
 * 返回根據地
 */
function returnToBase() {
    if (!player.baseLocation) {
        showMessage('⚠️ 還沒有建造根據地！');
        return;
    }
    
    if (!consumeAction(10)) return;
    player.isAtBase = true;
    gameState.currentScene = player.baseLocation;
    showScene(player.baseLocation);
    
    showMessage(`🏕️ 你回到了根據地。`);
    updateUI();
}

/**
 * 離開根據地外出探索
 */
function goExplore() {
    if (!player.isAtBase) {
        showMessage('⚠️ 你已經在野外了！');
        return;
    }
    
    // 隨機移動到附近的場景
    const currentScene = scenes[gameState.currentScene];
    const possibleDirections = [];
    Object.keys(currentScene.neighbors).forEach(dir => {
        if (currentScene.neighbors[dir]) {
            possibleDirections.push(dir);
        }
    });
    
    if (possibleDirections.length === 0) {
        showMessage('⚠️ 無法離開這個地方！');
        return;
    }
    
    const randomDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    player.isAtBase = false;
    move(randomDir);
}

/**
 * 檢查背包是否有空間
 */
function canAddItemToBackpack() {
    return player.currentBackpackUsage < player.backpackCapacity;
}

/**
 * 將物品添加到背包
 */
function addItemToBackpack(item) {
    if (!canAddItemToBackpack()) {
        return false;
    }
    player.inventory.push(item);
    player.currentBackpackUsage++;
    return true;
}

/**
 * 將物品從背包移到根據地
 */
function moveItemToBase(itemIndex) {
    if (!player.isAtBase || !gameState.currentBaseId) {
        showMessage('⚠️ 必須在根據地內才能進行此操作！');
        return;
    }
    
    const base = gameState.bases[gameState.currentBaseId];
    const item = player.inventory[itemIndex];
    
    if (!item) {
        showMessage('⚠️ 物品不存在！');
        return;
    }
    
    // 檢查根據地存儲空間（系統上限）
    const storageCapacity = base.structures.includes('pot') ? 20000 : 10000;
    if (base.storage.length >= storageCapacity) {
        showMessage('⚠️ 根據地存儲空間已滿！');
        return;
    }
    
    base.storage.push(item);
    player.inventory.splice(itemIndex, 1);
    player.currentBackpackUsage--;
    
    showMessage(`✓ 將 ${item} 移入根據地。`);
    updateUI();
}

/**
 * 從根據地取出物品
 */
function takeItemFromBase(itemIndex) {
    if (!player.isAtBase || !gameState.currentBaseId) {
        showMessage('⚠️ 必須在根據地內才能進行此操作！');
        return;
    }
    
    const base = gameState.bases[gameState.currentBaseId];
    const item = base.storage[itemIndex];
    
    if (!item) {
        showMessage('⚠️ 物品不存在！');
        return;
    }
    
    if (!canAddItemToBackpack()) {
        showMessage('⚠️ 背包滿了！無法取出。');
        return;
    }
    
    player.inventory.push(item);
    player.currentBackpackUsage++;
    base.storage.splice(itemIndex, 1);
    
    showMessage(`✓ 將 ${item} 取出。`);
    updateUI();
}

/**
 * 獲取不同背包類型的容量
 */
function getBackpackCapacity(backpackType) {
    const capacities = {
        basic: 10,
        cloth: 20,
        leather: 30,
        iron: 50,
        rare: 100
    };
    return capacities[backpackType] || 10;
}

/**
 * 增加生活技能經驗值
 */
function addSkillExp(skillName, amount) {
    if (!player.skillExp.hasOwnProperty(skillName)) {
        return;
    }
    
    player.skillExp[skillName] += amount;
    
    // 檢查是否升級
    if (player.skillExp[skillName] >= player.skillMaxExp) {
        player.skills[skillName]++;
        player.skillExp[skillName] = 0;
        showMessage(`⭐ ${skillName} 技能升級到 Lv.${player.skills[skillName]}！`);
        updateUI();
    }
}

/**
 * 獲取可鑑定的物品等級範圍
 */
function getIdentificationLevel(skillLevel) {
    const levels = {
        1: '普通',
        2: '稀有',
        3: '傳說',
        4: '神話',
        5: '超越'
    };
    return levels[Math.min(skillLevel, 5)] || '普通';
}

/**
 * 鑑定野生動植物（增加識別技能經驗）
 */
function identifyWildlife() {
    if (!player.isAtBase) {
        if (!consumeAction(1)) return;
        
        // 隨機鑑定一個野生物
        const wildcrafts = ['毒蘑菇', '聖草', '野生果實', '獵物痕跡'];
        const identified = wildcrafts[Math.floor(Math.random() * wildcrafts.length)];
        
        addSkillExp('identification', 10);
        showMessage(`🔍 你鑑定了 ${identified}！\n識別經驗 +10`);
        updateUI();
    }
}

/**
 * 探索技能（增加探索經驗）
 */
function improveExploration() {
    if (!player.isAtBase) {
        addSkillExp('exploration', 15);
        showMessage(`🗺️ 探索經驗 +15`);
    }
}

/**
 * 晚上危險時段檢查（10點後在野外會有強大敵人襲擊）
 */
function checkNightDanger() {
    const currentHour = getCurrentHourGMT8();
    
    // 晚上 10 點到早上 6 點為危險時段
    if ((currentHour >= 22 || currentHour < 6) && !player.isAtBase) {
        const dangerousEnemies = ['夜行狼群', '黑夜獵手', '影子怪物', '深淵生物'];
        const enemy = dangerousEnemies[Math.floor(Math.random() * dangerousEnemies.length)];
        
        // 強制戰鬥
        showMessage(`⚠️ 夜晚來臨！一個危險的敵人出現了！\n${enemy}`);
        
        // 創建一個強化敵人
        const baseEnemy = enemyDatabase['死靈騎士'];
        gameState.battleEnemy = {
            name: enemy,
            emoji: '💀',
            hp: Math.floor(baseEnemy.hp * 1.5),
            maxHp: Math.floor(baseEnemy.hp * 1.5),
            attack: Math.floor(baseEnemy.attack * 1.3),
            defense: Math.floor(baseEnemy.defense * 1.2),
            speed: baseEnemy.speed,
            crit: baseEnemy.crit + 10,
            element: baseEnemy.element,
            level: baseEnemy.level + 2,
            isBoss: true,
            defending: false
        };
        
        gameState.isInBattle = true;
        document.getElementById('battleSection').classList.add('active');
        document.getElementById('battleLog').innerHTML = '';
        updateBattleUI();
        addBattleLog(`⚠️ 晚間危險敵人！${enemy} 出現了！`, 'system');
    }
}

/**
 * 在根據地內建造設施
 */
function constructStructure(structureName) {
    if (!player.isAtBase || !gameState.currentBaseId) {
        showMessage('⚠️ 只能在根據地內建造！');
        return;
    }
    
    const structure = baseStructures[structureName];
    if (!structure) {
        showMessage('⚠️ 不存在的設施！');
        return;
    }
    
    // 檢查技能等級
    if (player.skills.construction < structure.requiredLevel) {
        showMessage(`⚠️ 建造技能等級不足！需要 Lv.${structure.requiredLevel}，當前 Lv.${player.skills.construction}`);
        return;
    }
    
    const base = gameState.bases[gameState.currentBaseId];
    
    // 檢查是否已經建造過
    if (base.structures.includes(structureName)) {
        showMessage(`⚠️ 已經建造過 ${structure.name} 了！`);
        return;
    }

    if (!hasItems(structure.recipe)) {
        showMessage(`素材不足，需要：${formatRecipe(structure.recipe)}。`);
        return;
    }
    
    if (!consumeAction(3)) return;
    consumeInventoryItems(structure.recipe);
    base.structures.push(structureName);
    
    addSkillExp('construction', 20);
    showMessage(`🏗️ 成功建造了 ${structure.name}！\n建造經驗 +20`);
    updateUI();
}

/**
 * 根據地生成資源（根據地類型特性）
 */
function generateBaseResources() {
    if (!player.isAtBase || !gameState.currentBaseId) {
        return;
    }
    
    const base = gameState.bases[gameState.currentBaseId];
    const baseType = baseTypes[base.type];
    
    // 根據不同地形生成資源
    if (Math.random() < baseType.baseFishChance) {
        base.storage.push('新鮮魚');
    }
    
    if (Math.random() < baseType.baseBerriesChance) {
        base.storage.push('野生漿果');
    }
    
    if (Math.random() < baseType.baseAnimalChance) {
        base.storage.push('獵物屍體');
    }
}

/**
 * 更新根據地UI顯示
 */
function updateBaseUI() {
    const baseSection = document.getElementById('baseSection');
    const baseInfo = document.getElementById('baseInfo');
    const baseStorage = document.getElementById('baseStorage');
    
    if (!player.isAtBase || !gameState.currentBaseId) {
        if (baseSection) baseSection.style.display = 'none';
        return;
    }
    
    if (baseSection) baseSection.style.display = 'block';
    
    const base = gameState.bases[gameState.currentBaseId];
    const baseType = baseTypes[base.type];
    
    // 更新根據地信息
    let infoHTML = `
        <div><strong>${baseType.name}</strong></div>
        <div>${baseType.description}</div>
        <div style="margin-top: 8px; font-size: 12px;">
            特性：${baseType.features.join('、')}<br>
            已建造設施：${base.structures.length > 0 ? base.structures.map(s => baseStructures[s].name).join('、') : '無'}
        </div>
    `;
    if (baseInfo) baseInfo.innerHTML = infoHTML;
    
    // 更新根據地存儲
    const storageCapacity = base.structures.includes('pot') ? 20000 : 10000;
    let storageHTML = `<strong>根據地存儲 ${base.storage.length}/${storageCapacity}：</strong><br>`;
    if (base.storage.length === 0) {
        storageHTML += '<span style="color: #aaa;">空的</span>';
    } else {
        base.storage.forEach((item, index) => {
            storageHTML += `<div style="display: inline-block; background: #d4af37; color: #000; padding: 3px 8px; margin: 2px; border-radius: 3px; font-size: 11px;">
                ${item}
            </div>`;
        });
    }
    if (baseStorage) baseStorage.innerHTML = storageHTML;
}

// ============= 場景顯示 =============
function showScene(sceneName) {
    const scene = scenes[sceneName];
    const biome = ['jungle', 'island', 'grassland'].includes(player.biome) ? player.biome : 'jungle';
    const sceneTitle = scene.mapArea ? scene.name : window.sceneArt.titles[biome][sceneName] || scene.name;
    const sceneDescription = scene.mapArea ? scene.description : window.sceneArt.descriptions[biome][sceneName] || scene.description;
    const isBase = player.isAtBase && Boolean(gameState.currentBaseId);
    const currentBase = isBase ? gameState.bases[gameState.currentBaseId] : null;
    const baseType = currentBase ? baseTypes[currentBase.type] : null;
    document.getElementById('sceneEmoji').textContent = baseType?.icon || scene.emoji;
    const biomeName = ({ jungle: '叢林', island: '海島', grassland: '草原' })[biome];
    document.getElementById('biomeLabel').textContent = isBase ? `${biomeName} · 根據地` : biomeName;
    document.getElementById('sceneName').textContent = baseType ? `${baseType.name} · 營地` : sceneTitle;
    document.getElementById('sceneDescription').textContent = baseType ? `這裡是你的安全據點。${baseType.description}，可以製作工具、整理物資與休息。` : sceneDescription;
    const imageTint = gameState.isInBattle ? 'linear-gradient(180deg, rgba(19, 24, 20, .06), rgba(36, 20, 17, .48))' : 'linear-gradient(180deg, rgba(15, 22, 17, .18), rgba(15, 22, 17, .38))';
    const sceneImage = isBase ? window.sceneArt.getBase(biome) : window.sceneArt.get(scene.artTemplate || sceneName, biome);
    document.getElementById('sceneDisplay').style.backgroundImage = `${imageTint}, url("${sceneImage}")`;
    document.getElementById('sceneDisplay').style.backgroundPosition = 'center';

    let info = '';
    if (scene.type === 'dark' && !hasLightSource(scene.requiredItem)) {
        info = `⚠️ 這裡很黑，需要 ${scene.requiredItem} 才能進入！`;
        document.getElementById('sceneInfo').textContent = info;
        return;
    }

    if (scene.enemies) {
        info += `⚠️ 可能有敵人在此：${scene.enemies.join('、')}`;
    }
    if (scene.items) {
        info += (info ? ' | ' : '') + `📦 可能有物品：${scene.items.join('、')}`;
    }
    if (scene.waterSource) {
        info += (info ? ' | ' : '') + `💧 水源：${scene.waterSource === 'fresh' ? '溪流/河流，可探索取得生水' : '海岸，可探索取得海水'}`;
    }
    if (Number.isInteger(scene.mapRow)) {
        info += (info ? ' | ' : '') + `🗺️ 地圖格：${scene.mapColumn + 1}, ${scene.mapRow + 1} / ${mapColumns}×${mapRows}`;
    }
    if (scene.npc) {
        info += (info ? ' | ' : '') + `👤 此處有 NPC：${scene.npc}`;
        const npcElement = document.getElementById('sceneNpc');
        if (npcElement) {
            const npcDetails = {
                村長: ['👨‍🌾', '村長', '沉穩親切的村莊管理者'],
                農民: ['🧑‍🌾', '農民', '樸實可靠的農務工作者'],
                商人: ['🧑‍💼', '商人', '穿著整潔、善於交涉的交易者']
            }[scene.npc] || ['👤', scene.npc, '正在此處活動的人物'];
            npcElement.innerHTML = `<span class="npc-avatar">${npcDetails[0]}</span><span><strong>${npcDetails[1]}</strong><small>${npcDetails[2]}</small></span>`;
            npcElement.hidden = false;
        }
    } else {
        const npcElement = document.getElementById('sceneNpc');
        if (npcElement) npcElement.hidden = true;
    }

    document.getElementById('sceneInfo').textContent = info;
    updateGameMode();
}

// ============= 探索系統 =============
function exploreScene() {
    const scene = scenes[gameState.currentScene];

    if (scene.type === 'dark' && !hasLightSource(scene.requiredItem)) {
        showMessage(`黑漆漆的一片，什麼都看不見！\n需要 ${scene.requiredItem} 才能探索。`);
        return;
    }

    // 探索消耗 3 行動值，飽食/水分各 5，疲勞增加 5。
    const actionCost = gameRules.explorationActionCost;
    if (!consumeAction(actionCost, gameRules.explorationFatigueGain)) return;
    
    // 增加探索經驗
    addSkillExp('exploration', 5);

    // 每一次有效探索單獨擲 1/10 遇怪機率。
    const period = getCurrentGamePeriod();
    const periodEnemies = scene.periodEnemies && scene.periodEnemies[period];
    const enemies = periodEnemies || scene.enemies;
    if (enemies && enemies.length && shouldGenerateEnemy(scene.exploreEncounterChance ?? 1 / 10)) {
        const randomEnemy = pickSceneEnemy({ enemies });
        startBattle(randomEnemy);
        return;
    }

    // 各場景可設定時段限定採集物，未設定時使用一般採集物。
    const periodItems = scene.periodItems && scene.periodItems[period];
    const items = scene.waterSource === 'fresh' ? ['生水'] : scene.waterSource === 'sea' ? ['海水'] : periodItems || scene.items;
    if (items && items.length) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        
        // 嘗試添加到背包
        if (addInventoryItem(randomItem)) {
            showMessage(`🎉 發現了 ${randomItem}！消耗 ${actionCost} 點行動值。`);
            addDiscovery(`探索發現：${randomItem}（${scene.name} / ${period}）`);
        } else {
            showMessage(`🎉 發現了 ${randomItem}！\n但背包滿了！無法拿取。`);
        }
        updateUI();
    } else {
        showMessage(`這個時段沒有發現可採集物。消耗 ${actionCost} 點行動值。`);
        updateUI();
    }
}

// ============= 對話系統 =============
function talkToNPC() {
    const scene = scenes[gameState.currentScene];
    
    if (!scene.npc) {
        showMessage('這裡沒有人...');
        return;
    }

    const dialogues = {
        '村長': '歡迎來到村莊！我聽說山上有一隻強大的怪物...',
        '農民': '我在打理這個農場已經很多年了。如果你需要食物，我可以幫你。',
        '商人': '歡迎光臨！我這裡有各種商品。不過現在還沒實現購買功能呢。'
    };

    if (!consumeAction(1)) return;
    showMessage(dialogues[scene.npc]);
    updateUI();
}

// ============= 拾取系統 =============
function pickupItem() {
    const scene = scenes[gameState.currentScene];
    
    if (!scene.items || scene.items.length === 0) {
        showMessage('這裡沒有可拾取的物品。');
        return;
    }

    const item = scene.items[0];
    if (!player.inventory.includes(item)) {
        if (!consumeAction(1)) return;
        if (!addInventoryItem(item)) {
            showMessage('⚠️ 背包已滿，無法拾取。');
            return;
        }
        showMessage(`✓ 拾取了 ${item}！`);
        updateUI();
    }
}

// ============= 休息系統 =============
function rest() {
    if (!consumeAction(gameRules.restActionCost)) return;
    const oldFatigue = player.fatigue;
    player.fatigue = Math.max(0, player.fatigue - gameRules.restFatigueRecovery);
    const reduced = oldFatigue - player.fatigue;
    showMessage(`😌 休息完成，疲勞降低 ${reduced} 點（最多 15 點）。`);
    updateUI();
}

// ============= 戰鬥系統 =============
function startBattle(enemyName) {
    const enemyData = enemyDatabase[enemyName];
    gameState.isInBattle = true;
    gameState.battleEnemy = {
        name: enemyName,
        emoji: enemyData.emoji,
        hp: enemyData.hp,
        maxHp: enemyData.hp,
        attack: enemyData.attack,
        defense: enemyData.defense,
        speed: enemyData.speed,
        crit: enemyData.crit,
        element: enemyData.element,
        level: enemyData.level,
        isBoss: enemyData.boss || false,
        defending: false
    };

    gameState.playerDefending = false;

    document.getElementById('battleSection').classList.add('active');
    document.getElementById('battleLog').innerHTML = '';
    updateGameMode();
    
    updateBattleUI();
    addBattleLog(`戰鬥開始！遇到了 ${enemyName}！戰鬥期間不消耗行動值。`, 'system');
    updateUI();
    
    // 根據速度決定誰先攻擊
    setTimeout(() => {
        if (gameState.battleEnemy.speed > player.speed) {
            enemyAttack();
        }
    }, 1000);
}

function updateBattleUI() {
    const enemy = gameState.battleEnemy;
    document.getElementById('enemyEmoji').textContent = enemy.emoji;
    document.getElementById('enemyName').textContent = enemy.name;
    document.getElementById('enemyBattleHP').textContent = Math.max(0, enemy.hp);
    document.getElementById('enemyMaxHP').textContent = enemy.maxHp;
    document.getElementById('playerBattleHP').textContent = Math.max(0, player.hp);
    document.getElementById('playerMaxHP').textContent = player.maxHp;
    
    const enemyHpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
    document.getElementById('enemyHPBar').style.width = enemyHpPercent + '%';
    
    const playerHpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
    document.getElementById('playerHPBar').style.width = playerHpPercent + '%';

    // 禁用按鈕如果戰鬥結束
    const battleEnded = player.hp <= 0 || enemy.hp <= 0;
    document.getElementById('attackBtn').disabled = battleEnded;
    document.getElementById('skillBtn').disabled = battleEnded;
    document.getElementById('defendBtn').disabled = battleEnded;
    document.getElementById('itemBtn').disabled = battleEnded;
    document.getElementById('escapeBtn').disabled = battleEnded;
    const learnedElements = Object.entries(player.elements).filter(([, level]) => level > 0);
    document.getElementById('skillBtn').hidden = learnedElements.length === 0;
    document.getElementById('skillBtnTwo').hidden = learnedElements.length < 2;
    document.getElementById('skillBtnThree').hidden = learnedElements.length < 3;
    learnedElements.slice(0, 3).forEach(([element], index) => {
        const names = { fire: '炎', water: '水', earth: '地', wind: '風', wood: '木', lightning: '電' };
        const skillButton = document.getElementById(['skillBtn', 'skillBtnTwo', 'skillBtnThree'][index]);
        skillButton.innerHTML = `${['🔥', '🌿', '💧'][index]} ${names[element]}屬戰技<div class="skill-name">熟練度 Lv.${player.elements[element]}</div>`;
    });
}

function playerAttack(type, skillIndex = 0) {
    if (gameState.battleEnemy.hp <= 0) return;
    
    // 檢查飱食度
    if (player.hunger <= 0) {
        addBattleLog(`⚠️ 你已經餓得無力攻擊了！`, 'system');
        return;
    }

    const enemy = gameState.battleEnemy;
    let damage = 0;
    let skillName = '';

    if (type === 'normal') {
        damage = calculateDamage(player.attack, enemy.defense, player.crit, player.critDmg);
        skillName = '普通攻擊';
    } else if (type === 'skill') {
        // 根據玩家元素屬性選擇技能
        const playerElements = Object.entries(player.elements).filter(e => e[1] > 0).slice(0, 3);
        if (playerElements.length > 0) {
            const randomElement = playerElements[skillIndex] || playerElements[0];
            const elementName = {
                'fire': '炎', 'water': '水', 'earth': '地',
                'wind': '風', 'wood': '木', 'lightning': '電'
            }[randomElement[0]];
            damage = calculateDamage(player.attack * 1.3, enemy.defense * 0.8, player.crit * 1.2, player.critDmg);
            skillName = `${elementName}屬性技能`;
            
            // 屬性相剋判定
            if (elementCounter[randomElement[0]].weak === enemy.element) {
                damage = Math.floor(damage * 1.5);
                skillName += ' (克制！)';
            } else if (elementCounter[randomElement[0]].strong === enemy.element) {
                damage = Math.floor(damage * 0.7);
                skillName += ' (被克制...)';
            }
        } else {
            damage = calculateDamage(player.attack, enemy.defense, player.crit, player.critDmg);
            skillName = '普通攻擊';
        }
    }

    if (!consumeNeedsOnly()) return;

    enemy.hp -= damage;
    addBattleLog(`你使用了 ${skillName}！造成 ${damage} 點傷害！（飽食度 -5、水分 -5）`, 'player');
    updateBattleUI();

    if (enemy.hp <= 0) {
        battleWin();
        return;
    }

    setTimeout(() => {
        enemyAttack();
    }, 1500);
}

function playerDefend() {
    if (!consumeNeedsOnly()) return;
    gameState.playerDefending = true;
    addBattleLog(`你進入防守姿態，傷害減少 50%！`, 'player');

    setTimeout(() => {
        enemyAttack();
    }, 1500);
}

function useItem() {
    const healItem = player.inventory.find(item => item.includes('藥') || item === '麵包' || item === '熟肉' || item === '野生漿果');
    if (!healItem) {
        addBattleLog(`你沒有可使用的道具！`, 'system');
        return;
    }

    const healAmount = 50;
    player.hp = Math.min(player.hp + healAmount, player.maxHp);
    player.inventory.splice(player.inventory.indexOf(healItem), 1);
    if (!consumeNeedsOnly()) return;
    
    addBattleLog(`使用了 ${healItem}，恢復 ${healAmount} 點血量！（戰鬥不消耗行動值）`, 'player');
    updateBattleUI();
    updateUI();

    setTimeout(() => {
        enemyAttack();
    }, 1500);
}

function attemptEscape() {
    if (!gameState.isInBattle) return;
    if (!consumeAction(3, 0, true)) return;
    if (Math.random() < gameRules.escapeChance) {
        addBattleLog('🏃 逃跑成功，怪物消失了。', 'system');
        endBattle();
        return;
    }
    addBattleLog('⚠️ 逃跑失敗，怪物仍在面前，只能繼續戰鬥。', 'system');
    enemyAttack();
}

function enemyAttack() {
    if (gameState.battleEnemy.hp <= 0) return;

    const enemy = gameState.battleEnemy;
    let damage = calculateDamage(enemy.attack, player.defense, enemy.crit, 150);

    if (gameState.playerDefending) {
        damage = Math.floor(damage * 0.5);
        addBattleLog(`${enemy.name} 攻擊你，但你防守了！減少了傷害，受到 ${damage} 點傷害！`, 'enemy');
        gameState.playerDefending = false;
    } else {
        addBattleLog(`${enemy.name} 攻擊你！造成 ${damage} 點傷害！`, 'enemy');
    }

    player.hp -= damage;
    updateBattleUI();

    if (player.hp <= 0) {
        battleLose();
    }
}

function calculateDamage(attack, defense, crit, critDmg) {
    let damage = attack - defense + Math.floor(Math.random() * 5);
    damage = Math.max(1, damage);

    if (Math.random() * 100 < crit) {
        damage = Math.floor(damage * critDmg / 100);
        addBattleLog(`⚡ 爆擊！`, 'system');
    }

    return damage;
}

function battleWin() {
    const enemy = gameState.battleEnemy;
    const expGain = enemy.level * 25;
    const goldGain = enemy.level * 10;

    player.exp += expGain;
    if (!addInventoryItem('金幣 x' + goldGain)) addBattleLog('背包已滿，金幣未能收下。', 'system');

    if (Math.random() < gameRules.rawMeatDropChance && addInventoryItem('生肉')) {
        addBattleLog('🍖 獲得素材：生肉。生肉可以食用，但有中毒風險。', 'system');
    }
    const materials = (scenes[gameState.currentScene]?.drops || []).filter(item => item !== '生肉');
    if (materials.length && Math.random() < 0.5) {
        const material = materials[Math.floor(Math.random() * materials.length)];
        if (addInventoryItem(material)) addBattleLog(`🧰 獲得素材：${material}。`, 'system');
    }

    addBattleLog(`🎉 戰鬥勝利！\n獲得 ${expGain} 經驗值和 ${goldGain} 金幣！`, 'system');

    if (player.exp >= player.maxExp) {
        player.level++;
        player.exp = 0;
        player.maxHp += 20;
        player.hp = player.maxHp;
        player.attack += 3;
        player.defense += 2;
        addBattleLog(`✨ 升級了！等級 ${player.level}`, 'system');
    }

    setTimeout(() => {
        endBattle();
    }, 2000);
}

function battleLose() {
    addBattleLog(`💀 你被擊敗了...`, 'system');
    player.hp = Math.floor(player.maxHp / 2);
    player.fatigue = Math.min(player.maxFatigue, player.fatigue + 20);
    if (player.inventory.length > 0) {
        const lostIndex = Math.floor(Math.random() * player.inventory.length);
        const lostItem = player.inventory.splice(lostIndex, 1)[0];
        addBattleLog(`遺失道具：${lostItem}；疲勞 +20。`, 'system');
    }
    
    setTimeout(() => {
        endBattle();
    }, 2000);
}

function endBattle() {
    gameState.isInBattle = false;
    gameState.battleEnemy = null;
    document.getElementById('battleSection').classList.remove('active');
    showScene(gameState.currentScene);
    updateGameMode();
    updateUI();
}

function addBattleLog(message, type = 'system') {
    const log = document.getElementById('battleLog');
    const entry = document.createElement('div');
    entry.className = `battle-log-entry ${type}`;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// ============= UI 更新 =============
function updateUI() {
    // 檢查行動值恢復
    checkActionPointRecovery();
    
    // 基本屬性
    document.getElementById('playerLevel').textContent = player.level;
    document.getElementById('playerExp').textContent = `${player.exp}/${player.maxExp}`;
    document.getElementById('playerHP').textContent = `${Math.max(0, player.hp)}/${player.maxHp}`;
    document.getElementById('playerHPFill').style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
    
    document.getElementById('playerAttack').textContent = player.attack;
    document.getElementById('playerDefense').textContent = player.defense;
    document.getElementById('playerSpeed').textContent = player.speed;
    document.getElementById('playerCrit').textContent = `${player.crit}%`;
    document.getElementById('playerCritDmg').textContent = `${player.critDmg}%`;

    // 行動值
    if (document.getElementById('playerActionPoints')) {
        document.getElementById('playerActionPoints').textContent = `${player.actionPoints}/${player.maxActionPoints}`;
        document.getElementById('playerActionPointsFill').style.width = `${(player.actionPoints / player.maxActionPoints) * 100}%`;
    }

    // 疲勞度
    if (document.getElementById('playerFatigue')) {
        document.getElementById('playerFatigue').textContent = `${player.fatigue}/${player.maxFatigue}`;
        const fatiguePercent = (player.fatigue / player.maxFatigue) * 100;
        document.getElementById('playerFatigueFill').style.width = `${fatiguePercent}%`;
        // 根據疲勞度改變顏色
        if (fatiguePercent > 80) {
            document.getElementById('playerFatigueFill').style.background = 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)';
        } else if (fatiguePercent > 50) {
            document.getElementById('playerFatigueFill').style.background = 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)';
        } else {
            document.getElementById('playerFatigueFill').style.background = 'linear-gradient(90deg, #4caf50 0%, #388e3c 100%)';
        }
    }

    // 飽食度
    if (document.getElementById('playerHunger')) {
        const hungerStatus = player.hunger < 20 ? ' · 飢餓危險' : '';
        document.getElementById('playerHunger').textContent = `${Math.max(0, player.hunger)}/${player.maxHunger}${hungerStatus}`;
        const hungerPercent = Math.max(0, (player.hunger / player.maxHunger) * 100);
        document.getElementById('playerHungerFill').style.width = `${hungerPercent}%`;
        // 飢餓狀態警告
        if (player.hunger < 20) {
            document.getElementById('playerHungerFill').style.background = 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)';
        } else {
            document.getElementById('playerHungerFill').style.background = 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)';
        }
    }

    if (document.getElementById('playerThirst')) {
        const thirstStatus = player.thirst < 20 ? ' · 脫水危險' : '';
        const poisonStatus = player.isPoisoned ? ' · 中毒' : '';
        document.getElementById('playerThirst').textContent = `${Math.max(0, player.thirst)}/${player.maxThirst}${thirstStatus}${poisonStatus}`;
        document.getElementById('playerThirstFill').style.width = `${Math.max(0, (player.thirst / player.maxThirst) * 100)}%`;
        document.getElementById('playerThirstFill').style.background = player.thirst < 20 ? 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)' : 'linear-gradient(90deg, #29b6f6 0%, #0288d1 100%)';
    }
    if (document.getElementById('gameTime')) {
        const time = getGMT8Date();
        const period = getCurrentGamePeriod();
        document.getElementById('gameTime').textContent = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
        document.getElementById('gamePeriod').textContent = period;
        document.getElementById('periodIcon').textContent = selectPeriodIcon(period);
        const localNow = new Date();
        document.getElementById('realClock').textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(localNow);
    }

    // 元素屬性
    document.getElementById('elemFire').textContent = player.elements.fire;
    document.getElementById('elemWater').textContent = player.elements.water;
    document.getElementById('elemEarth').textContent = player.elements.earth;
    document.getElementById('elemWind').textContent = player.elements.wind;
    document.getElementById('elemWood').textContent = player.elements.wood;
    document.getElementById('elemLightning').textContent = player.elements.lightning;

    // 物品欄
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';
    player.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.textContent = item;
        inventory.appendChild(div);
    });

    // 生活技能
    document.getElementById('skillExploration').textContent = player.skills.exploration;
    document.getElementById('skillExplorationExp').textContent = player.skillExp.exploration;
    document.getElementById('skillIdentification').textContent = player.skills.identification;
    document.getElementById('skillIdentificationExp').textContent = player.skillExp.identification;
    document.getElementById('skillConstruction').textContent = player.skills.construction;
    document.getElementById('skillConstructionExp').textContent = player.skillExp.construction;
    document.getElementById('skillResearch').textContent = player.skills.research;
    document.getElementById('skillResearchExp').textContent = player.skillExp.research;

    // 根據地狀態
    if (document.getElementById('baseStatus')) {
        if (player.isAtBase && gameState.currentBaseId) {
            const base = gameState.bases[gameState.currentBaseId];
            document.getElementById('baseStatus').textContent = `📍 ${baseTypes[base.type].name}${player.isPoisoned ? ' · 中毒' : ''}`;
        } else {
            document.getElementById('baseStatus').textContent = `📍 野外${player.isPoisoned ? ' · 中毒' : ''}`;
        }
    }
    
    // 更新根據地UI
    updateBaseUI();
    updateGameMode();
}

// ============= 對話框系統 =============
function showMessage(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('messageModal').classList.add('active');
}

function closeModal() {
    document.getElementById('messageModal').classList.remove('active');
}

// ============= 遊戲啟動 =============
window.addEventListener('DOMContentLoaded', initGame);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseGameClock();
    else if (!document.getElementById('gameScreen').hidden) resumeGameClock();
});

// 鍵盤快捷鍵
document.addEventListener('keydown', (e) => {
    if (document.getElementById('gameScreen').hidden) return;
    if (document.getElementById('messageModal').classList.contains('active')) {
        if (e.key === 'Enter') closeModal();
        return;
    }

    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            move('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            move('down');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            move('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            move('right');
            break;
    }
});

document.addEventListener('pointerdown', () => {
    if (document.getElementById('mainMenu').hidden || !menuMusicEnabled) return;
    window.menuMusic.unlock();
    if (!window.menuMusic.getState().playing) window.menuMusic.start(menuMusicTheme);
}, true);

document.getElementById('mainMenu').addEventListener('click', (event) => {
    if (!event.target.closest('.menu-option')) {
        event.preventDefault();
        event.stopPropagation();
    }
});
