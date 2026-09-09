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
    bases: {},  // 所有根據地 {baseId: baseData}
    currentBaseId: null  // 當前根據地ID
};

// 根據地類型及其特性
const baseTypes = {
    riverside: {
        name: '溪流邊營地',
        icon: '🏕️',
        description: '靠近水源，涼爽舒適',
        features: ['可釣魚', '水源充足'],
        baseFishChance: 0.4,
        baseBerriesChance: 0,
        baseAnimalChance: 0.1
    },
    forest: {
        name: '密林營地',
        icon: '🌲',
        description: '密集的樹木，隱蔽性強',
        features: ['可採集漿果', '隱蔽'],
        baseFishChance: 0,
        baseBerriesChance: 0.5,
        baseAnimalChance: 0.2
    },
    highland: {
        name: '高地營地',
        icon: '⛰️',
        description: '視野開闊，野生動物多',
        features: ['動物屍體出現', '視野好'],
        baseFishChance: 0,
        baseBerriesChance: 0.1,
        baseAnimalChance: 0.6
    },
    plains: {
        name: '平原營地',
        icon: '🌾',
        description: '開闊平坦，基礎',
        features: ['均衡發展'],
        baseFishChance: 0.1,
        baseBerriesChance: 0.2,
        baseAnimalChance: 0.2
    }
};

// 根據地設施數據
const baseStructures = {
    bed: {
        name: '簡易床',
        cost: 5,  // 建造消耗的研發點數
        icon: '🛏️',
        description: '可以恢復疲勞',
        effect: 'reduce_fatigue',
        requiredLevel: 1
    },
    pot: {
        name: '陶罐',
        cost: 3,
        icon: '🏺',
        description: '可以儲存食物',
        effect: 'food_storage',
        requiredLevel: 1
    },
    saltMaker: {
        name: '製鹽工具',
        cost: 10,
        icon: '🧂',
        description: '製作鹽，增加食物保存時間',
        effect: 'food_preservation',
        requiredLevel: 2
    },
    fireplace: {
        name: '篝火',
        cost: 2,
        icon: '🔥',
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
        items: ['草藥', '蘑菇'],
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
        items: ['小石子'],
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
        items: ['礦石', '古老的鑰匙'],
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
        items: ['寶藏', '秘密文書'],
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
        enemies: null,
        items: ['新鮮魚', '水晶'],
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
        enemies: ['湖怪'],
        items: ['珍珠'],
        neighbors: {
            up: 'river',
            down: null,
            left: 'garden',
            right: null
        }
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
    actionPoints: 20,
    maxActionPoints: 20,
    lastActionPointHour: -1,
    // 新增：疲勞度系統 (0-100)
    fatigue: 0,
    maxFatigue: 100,
    // 新增：飽食度系統 (0-100，低於20為飢餓狀態)
    hunger: 100,
    maxHunger: 100,
    hungerDays: 0,  // 連續飢餓天數
    lastHungerCheckDay: -1,
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

// ============= 初始化遊戲 =============
function initGame() {
    // 初始化行動值時間
    player.lastActionPointHour = getCurrentHourGMT8();
    // 初始化飢餓檢查日期
    player.lastHungerCheckDay = gameState.gameDay;
    // 初始化時間系統
    startTimeSystem();
    updateUI();
    showScene('entrance');
}

// ============= 時間系統 =============
/**
 * 啟動遊戲時間系統，每小時檢查一次飢餓和疲勞
 */
function startTimeSystem() {
    // 每 10 秒檢查一次遊戲時間事件（代表每小時）
    setInterval(() => {
        checkHungerSystem();
        checkNightDanger();
        updateUI();
    }, 10000);
}

/**
 * 檢查飢餓系統
 * 改為基於行動消耗，不再基於實時時間
 * 只檢查連續飢餓天數和死亡機制
 */
function checkHungerSystem() {
    const currentHour = getCurrentHourGMT8();
    
    // 每天午夜檢查一次連續飢餓天數
    if (currentHour === 0 && player.lastHungerCheckDay !== gameState.gameDay) {
        player.lastHungerCheckDay = gameState.gameDay;
        
        if (player.hunger < 20) {
            player.hungerDays++;
            // 飢餓一天，永久降低最高生命值 10 點
            player.maxHp -= 10;
            if (player.maxHp < 10) player.maxHp = 10;
            player.hp = Math.min(player.hp, player.maxHp);
            
            // 連續飢餓 3 天則死亡
            if (player.hungerDays >= 3) {
                playerDeath();
                return;
            }
            
            showMessage(`⚠️ 飢餓了一天，已連續飢餓 ${player.hungerDays} 天！最高生命值永久降低 10！`);
        } else {
            player.hungerDays = 0;  // 重置連續飢餓天數
        }
        
        gameState.gameDay++;
    }
    
    // 飢餓狀態影響戰鬥
    if (player.hunger < 20) {
        // 降低攻擊力 30%、防禦 20%
        player.attack = Math.floor(15 * 0.7);
        player.defense = Math.floor(10 * 0.8);
    }
}

// ============= 移動系統 =============
function move(direction) {
    if (gameState.isInBattle) {
        showMessage('戰鬥中無法移動！');
        return;
    }

    // 檢查飽食度
    if (player.hunger <= 0) {
        showMessage('⚠️ 你已經餓得走不動了！必須進食！');
        return;
    }

    const currentSceneData = scenes[gameState.currentScene];
    const nextSceneName = currentSceneData.neighbors[direction];

    if (!nextSceneName) {
        showMessage('這個方向無法前進...');
        return;
    }

    // 移動消耗 2 點飽食度
    player.hunger = Math.max(0, player.hunger - 2);

    gameState.currentScene = nextSceneName;
    showScene(nextSceneName);
    
    // 移動後檢查晚間危險
    setTimeout(() => {
        checkNightDanger();
    }, 500);
}

// ============= 時間系統 =============
/**
 * 獲取 GMT+8 當前小時 (0-23)
 */
function getCurrentHourGMT8() {
    const now = new Date();
    // 轉換為 GMT+8 時區
    const gmt8Time = new Date(now.getTime() + (8 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
    return gmt8Time.getHours();
}

/**
 * 玩家死亡系統
 */
function playerDeath() {
    // 隨機遺失身上的道具
    const lostItems = [];
    const itemsToLose = Math.floor(player.inventory.length * 0.5);
    for (let i = 0; i < itemsToLose; i++) {
        const randomIndex = Math.floor(Math.random() * player.inventory.length);
        lostItems.push(player.inventory[randomIndex]);
        player.inventory.splice(randomIndex, 1);
    }
    
    // 永久降低所有戰鬥能力 20%
    player.attack = Math.floor(player.attack * 0.8);
    player.defense = Math.floor(player.defense * 0.8);
    player.speed = Math.floor(player.speed * 0.8);
    player.crit = Math.floor(player.crit * 0.8);
    
    // 回到根據地，血量恢復一半
    player.hp = Math.floor(player.maxHp * 0.5);
    player.isAtBase = true;
    if (player.baseLocation) {
        gameState.currentScene = player.baseLocation;
    } else {
        gameState.currentScene = 'entrance';
    }
    
    showMessage(`💀 你因為飢餓而暈倒了！\n\n遺失了道具：${lostItems.join('、')}\n所有戰鬥能力永久降低 20%！\n已返回根據地。`);
    updateUI();
}

/**
 * 檢查並恢復行動值
 * 每個整點小時恢復 1 點行動值，最多恢復到最大值
 */
function checkActionPointRecovery() {
    const currentHour = getCurrentHourGMT8();
    
    // 如果當前小時與上次記錄不同，說明已經過了一小時
    if (player.lastActionPointHour !== currentHour) {
        player.lastActionPointHour = currentHour;
        // 每小時恢復 1 點行動值
        if (player.actionPoints < player.maxActionPoints) {
            player.actionPoints = Math.min(player.actionPoints + 1, player.maxActionPoints);
            updateUI();
        }
    }
}

/**
 * 建造根據地
 */
function buildBase() {
    // 檢查行動值
    const actionCost = 5;
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！需要 ${actionCost} 點行動值。`);
        return;
    }
    
    checkActionPointRecovery();
    
    const baseTypesList = Object.keys(baseTypes);
    let message = '選擇根據地類型：\n\n';
    baseTypesList.forEach((type, index) => {
        const base = baseTypes[type];
        message += `${index + 1}. ${base.name}\n   ${base.description}\n   特性：${base.features.join('、')}\n\n`;
    });
    
    const choice = prompt(message + '請輸入選項編號 (1-4)：');
    const typeIndex = parseInt(choice) - 1;
    
    if (typeIndex < 0 || typeIndex >= baseTypesList.length) {
        showMessage('無效的選擇');
        return;
    }
    
    const selectedType = baseTypesList[typeIndex];
    const baseId = `base_${Date.now()}`;
    
    // 初始化根據地
    const newBase = {
        id: baseId,
        type: selectedType,
        location: gameState.currentScene,
        structures: [],
        storage: [],  // 根據地儲存空間
        createdDay: gameState.gameDay
    };
    
    gameState.bases[baseId] = newBase;
    gameState.currentBaseId = baseId;
    player.baseLocation = gameState.currentScene;
    player.isAtBase = true;
    player.actionPoints -= actionCost;
    
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
function shouldGenerateEnemy() {
    const currentHour = getCurrentHourGMT8();
    const sceneName = gameState.currentScene;
    
    // 如果小時已變，重置該場景的生成狀態
    if (gameState.lastEnemyHour !== currentHour) {
        gameState.sceneEnemyGenerated = {};
        gameState.lastEnemyHour = currentHour;
    }
    
    // 如果該場景在本小時已經生成過敵人，不再生成
    if (gameState.sceneEnemyGenerated[sceneName]) {
        return false;
    }
    
    // 50% 機率生成敵人
    if (Math.random() < 0.5) {
        gameState.sceneEnemyGenerated[sceneName] = true;
        return true;
    }
    
    return false;
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
    if (!currentBase || !currentBase.structures.includes('bed')) {
        showMessage('⚠️ 根據地內沒有床！無法睡眠。');
        return;
    }
    
    checkActionPointRecovery();
    
    const actionCost = 3;
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！`);
        return;
    }
    
    // 消耗行動值並完全恢復疲勞
    player.actionPoints -= actionCost;
    player.fatigue = 0;
    player.hp = Math.min(player.hp + 20, player.maxHp);  // 也恢復一些血量
    
    showMessage(`😴 你在床上舒服地睡了一覺...\n疲勞完全恢復，血量恢復 20 點。`);
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
    
    // 尋找可食用的物品
    const foodItems = currentBase.storage.filter(item => 
        item.includes('魚') || item.includes('肉') || item.includes('漿果') || item.includes('麵包')
    );
    
    if (foodItems.length === 0) {
        showMessage('⚠️ 根據地內沒有食物！');
        return;
    }
    
    const selectedFood = foodItems[0];
    
    checkActionPointRecovery();
    
    const actionCost = 1;
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！`);
        return;
    }
    
    player.actionPoints -= actionCost;
    player.hunger = Math.min(player.hunger + 40, player.maxHunger);
    
    // 移除已食用的食物
    const index = currentBase.storage.indexOf(selectedFood);
    if (index > -1) {
        currentBase.storage.splice(index, 1);
    }
    
    showMessage(`🍖 你吃了 ${selectedFood}。\n飽食度恢復 40 點。`);
    updateUI();
}

/**
 * 返回根據地
 */
function returnToBase() {
    if (!player.baseLocation) {
        showMessage('⚠️ 還沒有建造根據地！');
        return;
    }
    
    const actionCost = 2;
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！需要 ${actionCost} 點。`);
        return;
    }
    
    player.actionPoints -= actionCost;
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
    
    const actionCost = 1;
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！`);
        return;
    }
    
    player.actionPoints -= actionCost;
    player.isAtBase = false;
    
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
    move(randomDir);
    
    showMessage(`🚶 你離開了根據地，前往野外探索。\n晚上 10 點前務必回到根據地！`);
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
    if (base.storage.length >= 10000) {
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
        const actionCost = 1;
        if (player.actionPoints < actionCost) {
            showMessage('⚠️ 行動值不足！');
            return;
        }
        
        player.actionPoints -= actionCost;
        
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
    
    const actionCost = 3;
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！`);
        return;
    }
    
    const base = gameState.bases[gameState.currentBaseId];
    
    // 檢查是否已經建造過
    if (base.structures.includes(structureName)) {
        showMessage(`⚠️ 已經建造過 ${structure.name} 了！`);
        return;
    }
    
    player.actionPoints -= actionCost;
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
    let storageHTML = '<strong>根據地存儲：</strong><br>';
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
    
    document.getElementById('sceneEmoji').textContent = scene.emoji;
    document.getElementById('sceneName').textContent = scene.name;
    document.getElementById('sceneDescription').textContent = scene.description;

    let info = '';
    if (scene.type === 'dark' && !player.inventory.includes(scene.requiredItem)) {
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
    if (scene.npc) {
        info += (info ? ' | ' : '') + `👤 此處有 NPC：${scene.npc}`;
    }

    document.getElementById('sceneInfo').textContent = info;
}

// ============= 探索系統 =============
function exploreScene() {
    // 檢查行動值恢復
    checkActionPointRecovery();
    
    // 檢查行動值
    const actionCost = 1;  // 探索消耗 1 點行動值
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！\n當前行動值：${player.actionPoints}/${player.maxActionPoints}\n明天會恢復。`);
        return;
    }
    
    // 檢查飽食度
    if (player.hunger <= 0) {
        showMessage(`⚠️ 你已經餓得無法探索了！必須進食！`);
        return;
    }
    
    const scene = scenes[gameState.currentScene];

    if (scene.type === 'dark' && !player.inventory.includes(scene.requiredItem)) {
        showMessage(`黑漆漆的一片，什麼都看不見！\n需要 ${scene.requiredItem} 才能探索。`);
        return;
    }

    // 消耗行動值和飽食度
    player.actionPoints -= actionCost;
    player.hunger = Math.max(0, player.hunger - 5);  // 探索消耗 5 點飽食度
    
    // 增加探索經驗
    addSkillExp('exploration', 5);

    // 檢查該場景是否在此小時應該生成敵人
    if (scene.enemies && shouldGenerateEnemy()) {
        const randomEnemy = scene.enemies[Math.floor(Math.random() * scene.enemies.length)];
        startBattle(randomEnemy);
        return;
    }

    // 沒有生成敵人或該場景無敵人時，尋找物品
    if (scene.items) {
        const randomItem = scene.items[Math.floor(Math.random() * scene.items.length)];
        
        // 嘗試添加到背包
        if (addItemToBackpack(randomItem)) {
            showMessage(`🎉 發現了 ${randomItem}！\n消耗了 ${actionCost} 點行動值和 5 點飽食度。`);
        } else {
            showMessage(`🎉 發現了 ${randomItem}！\n但背包滿了！無法拿取。`);
        }
        updateUI();
    } else {
        showMessage('這裡沒有發現任何東西...\n消耗了 ' + actionCost + ' 點行動值和 5 點飽食度。');
        updateUI();
    }
}

// ============= 對話系統 =============
function talkToNPC() {
    // 檢查行動值恢復
    checkActionPointRecovery();
    
    // 檢查飱食度
    if (player.hunger <= 0) {
        showMessage(`⚠️ 你已經餓得無法對話了！必須進食！`);
        return;
    }
    
    // 檢查行動值
    const actionCost = 1;  // 對話消耗 1 點行動值
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！\n當前行動值：${player.actionPoints}/${player.maxActionPoints}`);
        return;
    }
    
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

    player.actionPoints -= actionCost;
    player.hunger = Math.max(0, player.hunger - 1);  // 對話消耗 1 點飱食度
    showMessage(dialogues[scene.npc] + `\n\n消耗了 ${actionCost} 點行動值和 1 點飱食度。`);
    updateUI();
}

// ============= 拾取系統 =============
function pickupItem() {
    // 檢查行動值恢復
    checkActionPointRecovery();
    
    // 檢查行動值
    const actionCost = 1;  // 拾取消耗 1 點行動值
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！\n當前行動值：${player.actionPoints}/${player.maxActionPoints}`);
        return;
    }
    
    // 檢查飱食度
    if (player.hunger <= 0) {
        showMessage(`⚠️ 你已經餓得無法拾取物品了！必須進食！`);
        return;
    }
    
    const scene = scenes[gameState.currentScene];
    
    if (!scene.items || scene.items.length === 0) {
        showMessage('這裡沒有可拾取的物品。');
        return;
    }

    const item = scene.items[0];
    if (!player.inventory.includes(item)) {
        player.actionPoints -= actionCost;
        player.hunger = Math.max(0, player.hunger - 1);  // 拾取消耗 1 點飱食度
        player.inventory.push(item);
        showMessage(`✓ 拾取了 ${item}！\n消耗了 ${actionCost} 點行動值和 1 點飱食度。`);
        updateUI();
    }
}

// ============= 休息系統 =============
function rest() {
    // 檢查行動值恢復
    checkActionPointRecovery();
    
    // 檢查行動值
    const actionCost = 2;  // 休息消耗 2 點行動值
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！\n當前行動值：${player.actionPoints}/${player.maxActionPoints}\n明天會恢復。`);
        return;
    }
    
    const healAmount = 30;
    const oldHp = player.hp;
    player.hp = Math.min(player.hp + healAmount, player.maxHp);
    const actualHeal = player.hp - oldHp;
    
    // 消耗行動值，休息時適度消耗飱食度
    player.actionPoints -= actionCost;
    player.hunger = Math.max(0, player.hunger - 3);  // 休息消耗 3 點飱食度
    
    showMessage(`😴 你在此休息...\n回復了 ${actualHeal} 點血量！\n消耗了 ${actionCost} 點行動值和 3 點飱食度。`);
    updateUI();
}

// ============= 戰鬥系統 =============
function startBattle(enemyName) {
    // 檢查行動值恢復
    checkActionPointRecovery();
    
    // 檢查飽食度
    if (player.hunger <= 0) {
        showMessage(`⚠️ 你已經餓得無力戰鬥了！必須進食！`);
        return;
    }
    
    // 檢查行動值
    const actionCost = 3;  // 戰鬥消耗 3 點行動值
    if (player.actionPoints < actionCost) {
        showMessage(`⚠️ 行動值不足！\n當前行動值：${player.actionPoints}/${player.maxActionPoints}\n無法進行戰鬥。`);
        return;
    }
    
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
    
    // 消耗行動值和飽食度
    player.actionPoints -= actionCost;
    player.hunger = Math.max(0, player.hunger - 3);  // 開始戰鬥消耗 3 點飽食度
    
    updateBattleUI();
    addBattleLog(`戰鬥開始！遇到了 ${enemyName}！\n消耗了 ${actionCost} 點行動值和 3 點飽食度。`, 'system');
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
}

function playerAttack(type) {
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
        const playerElements = Object.entries(player.elements).filter(e => e[1] > 0);
        if (playerElements.length > 0) {
            const randomElement = playerElements[Math.floor(Math.random() * playerElements.length)];
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

    // 消耗飱食度
    player.hunger = Math.max(0, player.hunger - 2);  // 每次攻擊消耗 2 點飽食度

    enemy.hp -= damage;
    addBattleLog(`你使用了 ${skillName}！造成 ${damage} 點傷害！（消耗 2 點飱食度）`, 'player');
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
    gameState.playerDefending = true;
    addBattleLog(`你進入防守姿態，傷害減少 50%！`, 'player');

    setTimeout(() => {
        enemyAttack();
    }, 1500);
}

function useItem() {
    const actionCost = 1;  // 使用物品消耗 1 點行動值
    if (player.actionPoints < actionCost) {
        addBattleLog(`⚠️ 行動值不足！無法使用物品。`, 'system');
        return;
    }

    const healItem = player.inventory.find(item => item.includes('藥') || item === '麵包');
    if (!healItem) {
        addBattleLog(`你沒有可使用的道具！`, 'system');
        return;
    }

    const healAmount = 50;
    player.hp = Math.min(player.hp + healAmount, player.maxHp);
    player.inventory.splice(player.inventory.indexOf(healItem), 1);
    player.actionPoints -= actionCost;
    
    addBattleLog(`使用了 ${healItem}，恢復 ${healAmount} 點血量！消耗了 ${actionCost} 點行動值。`, 'player');
    updateBattleUI();
    updateUI();

    setTimeout(() => {
        enemyAttack();
    }, 1500);
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
    player.inventory.push('金幣 x' + goldGain);

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
    
    setTimeout(() => {
        endBattle();
    }, 2000);
}

function endBattle() {
    gameState.isInBattle = false;
    gameState.battleEnemy = null;
    document.getElementById('battleSection').classList.remove('active');
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
        document.getElementById('playerHunger').textContent = `${Math.max(0, player.hunger)}/${player.maxHunger}`;
        const hungerPercent = Math.max(0, (player.hunger / player.maxHunger) * 100);
        document.getElementById('playerHungerFill').style.width = `${hungerPercent}%`;
        // 飢餓狀態警告
        if (player.hunger < 20) {
            document.getElementById('playerHungerFill').style.background = 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)';
        } else {
            document.getElementById('playerHungerFill').style.background = 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)';
        }
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
            document.getElementById('baseStatus').textContent = `📍 ${baseTypes[base.type].name}`;
        } else {
            document.getElementById('baseStatus').textContent = `📍 野外`;
        }
    }
    
    // 更新根據地UI
    updateBaseUI();
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

// 鍵盤快捷鍵
document.addEventListener('keydown', (e) => {
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
