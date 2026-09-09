// ============= 角色卡系統 =============
// 遊戲場景：孫氏集團

const characters = {
    // ============= 主角：陳風 =============
    chenFeng: {
        id: 'char_chen_feng',
        name: '陳風',
        role: '主角',
        type: 'protagonist',
        gender: '男性',
        age: 22,
        position: '孫氏集團底層員工',
        department: '基層部門',
        startStatus: '遊戲開始時出現',
        
        // 外觀描述
        appearance: {
            height: '175cm',
            weight: '68kg',
            build: '中等身材，略顯消瘦',
            skinTone: '膚色偏白，長期室內辦公',
            hairstyle: '黑色短髮，長度在耳朵上方，髮質較軟',
            hairColor: '烏黑',
            eyeColor: '黑色眼睛，眼神略帶疲憊',
            facialFeatures: '五官精緻但不突出，嘴角總帶著淡淡的憂鬱',
            expression: '認真、謹慎、有些疲憊',
            emoji: '👨',
            
            // 全身詳細描寫
            fullbodyDescription: {
                top: '白色或淺藍色正裝襯衫，領口規整，袖子卷至手腕，略有皺褶',
                bottom: '深灰色西褲，版型簡樸，腰部略緊',
                shoes: '黑色皮鞋，款式普通，鞋面有時缺乏光澤',
                jacket: '深灰或黑色正裝西裝外套，尺寸剛好，常被穿著',
                accessories: '銀色手錶（便宜款），領帶為深色系（多為黑或深藍）',
                belt: '黑色皮帶，簡樸款式',
                details: '雙手略顯蒼白，指甲修剪得整齊，右手食指和中指常有筆跡痕跡',
                posture: '站姿不夠挺直，走路時略顯疲倦，肩膀微微下垂'
            }
        },
        
        // 個性特徵
        personality: {
            traits: ['踏實', '勤奮', '守紀律', '謙虛', '內向'],
            strengths: ['執行力強', '認真負責', '容易相處', '學習能力強', '細心觀察', '專注度高'],
            weaknesses: ['缺乏自信', '容易被指示', '主動性不足', '社交能力一般', '情感表達困難', '過度自責'],
            communicationStyle: '禮貌、謹慎，傾向聆聽而非表達，說話常帶有疑問句',
            attitude: '對上司恭敬有餘，對同事友善但保持距離，對下屬溫和',
            habits: ['習慣性地檢查工作是否完成', '喜歡在筆記本上記錄重要事項', '頻繁調整眼鏡（如果戴眼鏡）', '咬指甲的習慣'],
            hobbies: ['閱讀工業相關書籍', '下班後散步放鬆', '看一些勵志類的網絡文章', '偶爾聽輕音樂']
        },
        
        // 人際關係
        relationships: {
            sunLili: { status: '上級', attitude: '尊敬但有距離感' },
            shuLi: { status: '同事（上級）', attitude: '被支配，有點害怕' },
            aLian: { status: '同事（好友）', attitude: '親近信任的朋友' }
        },
        
        
        // 背景故事
        background: '來自普通家庭，父母都是藍領工人。進入孫氏集團工作已有三年，雖然兢兢業業但升職無望。每天重複著枯燥的工作，月薪只能維持生活。始終保持低調，默默為公司服務。內心深處渴望改變卻缺乏勇氣，經常懷疑自己是否還有其他可能性。',
        
        dailyRoutine: {
            morning: '6:30起床，簡單盥洗，7:00吃早餐，7:30出門上班',
            work: '8:00-12:00上午工作，12:00-13:00午餐休息，13:00-18:00下午工作',
            evening: '18:30回家，簡單晚餐，19:00-21:00看書或上網，22:00睡覺',
            weekend: '周六經常加班，周日休息時在家或散步'
        },
        
        psychologicalProfile: {
            selfEsteem: '較低，常自我懷疑',
            stressLevel: '中等偏高，經常感到焦慮',
            dreamAndGoal: '渴望升職但覺得遙遠，也想找到生活的意義',
            deepestFear: '被淘汰、被遺忘、虛度一生',
            secretWish: '希望有人能看見自己，承認自己的價值'
        },
        
        // 故事角度
        narrativeRole: '玩家將體驗陳風在職場中的人生選擇、職業成長、與各角色的互動關係，以及尋找自我價值的過程。他的故事代表著許多平凡上班族的內心掙扎與希望。'
    },

    // ============= 孫莉莉：集團總裁 =============
    sunLili: {
        id: 'char_sun_lili',
        name: '孫莉莉',
        role: '孫氏集團總裁',
        type: 'supporter/authority',
        gender: '女性',
        age: 26,
        position: '孫氏集團總裁',
        department: '總裁辦公室',
        startStatus: '遊戲中期出現，逐漸增加互動',
        
        // 外觀描述
        appearance: {
            height: '165cm',
            weight: '52kg',
            build: '修長身材，氣質優雅',
            skinTone: '膚色白皙，保養得宜',
            hairstyle: '烏黑長髮，長度及肩膀下方，髮質光澤感十足，常打理成大波浪捲',
            hairColor: '深色系烏黑',
            eyeColor: '黑色眼睛，目光銳利而充滿自信',
            facialFeatures: '五官精緻，輪廓立體，眼神有種令人敬畏的威懾力',
            expression: '冷靜、自信、幹練、職業微笑',
            emoji: '👩‍💼',
            
            // 全身詳細描寫
            fullbodyDescription: {
                top: '剪裁得體的白色或淺粉色絲質襯衫，領口簡潔高雅，常紮進褲子裡',
                bottom: '深灰或黑色西裝褲裙，版型剪裁精緻，臀部修身，腿部線條明顯',
                shoes: '深色高跟鞋（約7-8cm），名牌款式，光澤度高，踏步有節奏感',
                jacket: '精緻的深色西裝外套，剪裁完美貼身，常搭配高級品牌標誌',
                accessories: '18K金手錶（高級品牌），金質手鐲，精緻的金色項鍊，名牌包包',
                belt: '高級皮質腰帶，款式簡約但昂貴',
                details: '指甲修剪齊整且涂有深色指甲油，雙手白皙纖細，無瑕疵，常戴著高級戒指',
                posture: '站姿挺直，走路時步伐穩定有力，散發出權力感和威嚴',
                makeup: '精緻的專業妝容，口紅為深紅或枚紅色，眉毛修剪完美，眼妝簡約但突出氣質'
            }
        },
        
        // 個性特徵
        personality: {
            traits: ['果決', '幹練', '自信', '領導力強', '理性', '冷靜'],
            strengths: ['管理能力超群', '決策迅速精準', '眼光獨到', '魄力十足', '親和力有限但專業', '談判高手', '戰略眼光'],
            weaknesses: ['有時過於冷酷', '工作至上', '對下屬要求嚴格', '生活平衡差', '缺乏溫度', '容易忽視他人感受', '難以信任他人'],
            communicationStyle: '直接、有序、充滿權威感，不喜歡拖沓，用詞精確，說話簡潔高效',
            attitude: '對員工公平但嚴格，代表新時代職業女性，對優秀者賞識，對平庸者冷漠',
            habits: ['每天晨起運動30分鐘', '早餐前查看全球股市', '辦公室內簡潔無雜物', '會議時記筆記', '喜歡咖啡'],
            hobbies: ['閱讀商業書籍', '瑜伽健身', '古典音樂鑑賞', '收藏高級紅酒'],
            lifestyle: '獨居高檔公寓，生活規律如鐘表，週末也在忙工作'
        },
        
        // 人際關係
        relationships: {
            chenFeng: { status: '員工', attitude: '較為陌生，但認可他的工作能力' },
            shuLi: { status: '下屬銷售冠軍', attitude: '欣賞但有所保留' },
            aLian: { status: '基層員工', attitude: '一般下屬，較少直接互動' }
        },
        
        // 背景故事
        background: '富二代，但以自己的實力掌管孫氏集團。父親留給她一個基礎企業，她卻將其擴大三倍。代表新時代女性管理者，既溫柔又堅定。她建立的公司文化既競爭又有機會。雖然表面風光，但背後承受著巨大的商業壓力和孤獨。她不允許自己失敗，也不知道如何放鬆。',
        
        dailyRoutine: {
            morning: '5:30起床，運動30分鐘，6:30淋浴更衣，7:00早餐時查看新聞',
            work: '7:30出門，8:00-12:00高層會議和戰略規劃，12:00-13:00工作午餐，13:00-18:00視察和決策',
            evening: '18:30-21:00社交應酬或加班，21:30回家，22:00泡澡放鬆，23:00入睡',
            weekend: '周六參加商業論壇，周日準備下週計劃'
        },
        
        psychologicalProfile: {
            selfEsteem: '極高，但隱藏著不安全感',
            stressLevel: '極高，常感到疲憊但不願承認',
            dreamAndGoal: '建立商業帝國，成為行業領導者，但也渴望被理解和接納',
            deepestFear: '失控、失敗、被發現自己其實不完美',
            secretWish: '希望找到可以信任和依靠的人'
        },
        
        // 故事角色
        narrativeRole: '可作為陳風的職業導師和高不可攀的存在，劇情中可能涉及企業決策、職場機會、或領導人物的考驗。她可能是陳風的突破口，也可能是他的難題。'
    },

    // ============= 淑麗：資深銷售冠軍 =============
    shuLi: {
        id: 'char_shu_li',
        name: '淑麗',
        role: '孫氏集團資深銷售冠軍',
        type: 'rival/manipulator',
        gender: '女性',
        age: 25,
        position: '銷售部資深銷售冠軍',
        department: '銷售部',
        startStatus: '遊戲開始時出現',
        
        // 外觀描述
        appearance: {
            height: '168cm',
            weight: '55kg',
            build: '姣好身材，曲線明顯',
            skinTone: '膚色白皙，經常保養',
            hairstyle: '烏黑長髮，長度及腰部，常披肩或做成微捲，蓬鬆感十足',
            hairColor: '烏黑亮麗',
            eyeColor: '黑色眼睛，眼神充滿精計和魅力',
            facialFeatures: '五官精緻，唇形性感，眼角帶著狡黠的笑意',
            expression: '自信、迷人、高傲、經常展現魅力微笑',
            emoji: '👩',
            
            // 全身詳細描寫
            fullbodyDescription: {
                top: '時尚連身裙或緊身上衣，材質多為絲綢或棉質，顏色鮮豔（紅、藍、紫等），裁剪彰顯身材',
                bottom: '如果是連身裙，長度在膝蓋上方，修身剪裁，展現腿部線條；如果是分體，則搭配牛仔褲或短褲',
                shoes: '高跟鞋或精緻平底鞋，品牌款式，顏色與服裝搭配',
                jacket: '輕薄外套或針織衫，常披在肩上或拿在手上，增加優雅感',
                accessories: '精緻耳環（多為珍珠或水鑽款），手鐲，名牌包包，經常帶著香水',
                belt: '裝飾腰帶，突出腰部線條',
                details: '指甲修長且涂有鮮豔指甲油（常為紅色或粉紅色），皮膚光滑無瑕，香氣濃郁',
                posture: '站姿挺胸，走路時步態嫵媚而自信，經常翻動頭髮，有意製造存在感',
                makeup: '濃妝豔抹的專業化妝，口紅鮮豔（紅色或棗紅色），眼影色彩搭配得體，睫毛捲翹',
                overall: '整體呈現出熟女風範，既專業又性感，充分利用自己的優勢'
            }
        },
        
        // 個性特徵
        personality: {
            traits: ['高傲', '野心勃勃', '外向', '聰慧', '現實主義者', '虛榮心強'],
            strengths: ['銷售能力一流', '社交手腕高明', '目標導向明確', '說話得體但具說服力', '察言觀色能力強', '談判技巧高超'],
            weaknesses: ['傲慢、看不起他人', '功利心重', '缺乏同情心', '容易把下屬當工具', '膚淺', '容易翻臉', '物質慾望強'],
            communicationStyle: '諂媚上級，命令下屬，對陳風常帶著若無其事的指使與嘲笑，說話帶著暗示和試探',
            attitude: '視陳風為可使喚的下屬，時常有意無意地支配他，對比自己弱的人充滿輕蔑',
            habits: ['頻繁整理頭髮和妝容', '喜歡在會議中吸引注意力', '經常外出應酬', '購物和消費名牌', '在別人面前炫耀'],
            hobbies: ['逛街購物', '美容護膚', '參加高級聚會', '八卦同事私生活'],
            lifestyle: '獨居租住的高級公寓，日常花銷大，靠銷售獎金維持生活水平'
        },
        
        // 人際關係
        relationships: {
            chenFeng: { status: '下屬', attitude: '時常支配利用，心態高傲' },
            sunLili: { status: '上級總裁', attitude: '尊敬且討好，專業態度' },
            aLian: { status: '同事（底層）', attitude: '看不起，很少主動互動' }
        },
        
        // 背景故事
        background: '出身中產家庭，父母開小生意，從小被教導「錢能解決一切」。因為優異的銷售成績贏得上級信任，在公司中躍升快速。但美麗外表下隱藏著高傲與功利的內心。她經常利用職位優勢與個人魅力來支配他人，把同事分為「有用」和「無用」兩類。對陳風的支配不僅是工作上的，也帶著某種心理優越感。',
        
        dailyRoutine: {
            morning: '7:00起床，化妝打扮30分鐘，7:45早餐，8:00出門',
            work: '8:30-12:00客戶訪問和銷售活動，12:00-13:30午餐社交，13:30-18:00會議和簽約',
            evening: '18:00-20:00健身或美容，20:00-23:00應酬或逛街，23:30入睡',
            weekend: '周六購物和美容，周日參加高級聚會或約會'
        },
        
        psychologicalProfile: {
            selfEsteem: '極高，但完全基於外表和成就',
            stressLevel: '中等，但若銷售不達標會焦慮',
            dreamAndGoal: '晉升管理層，找到富有的男友或老闆，過上奢華生活',
            deepestFear: '老去、失去吸引力、被比下去',
            secretWish: '被尊重而不只是被欣賞，但她自己不知道'
        },
        
        // 故事角色
        narrativeRole: '可作為陳風的職場挑戰對象，體現職場中的權力動態與人性考驗。她代表的是被物質和虛榮所奴役的女性。玩家需要在與她的互動中找到平衡，或者被她所利用。'
    },

    // ============= 阿蓮：底層員工好友 =============
    aLian: {
        id: 'char_a_lian',
        name: '阿蓮',
        role: '孫氏集團底層員工（陳風的好友）',
        type: 'ally/supporter',
        gender: '女性',
        age: 21,
        position: '孫氏集團底層員工',
        department: '基層部門',
        startStatus: '遊戲開始時出現，是陳風的親近夥伴',
        
        // 外觀描述
        appearance: {
            height: '162cm',
            weight: '48kg',
            build: '纖細身材，有點瘦弱，顯得嬌小可愛',
            skinTone: '膚色白皙，但因常加班有些黑眼圈',
            hairstyle: '黑色長髮，常綁成馬尾或丸子頭，髮質柔順但略有毛躁',
            hairColor: '烏黑，髮尾略有分叉',
            eyeColor: '黑色眼睛，眼神清澈溫暖，帶著淡淡的疲憊',
            facialFeatures: '五官秀氣，臉型圓潤，鼻子小巧，嘴角容易上揚',
            expression: '親切、溫暖、帶著淡淡的笑容，有時會顯得有點委屈',
            emoji: '👩‍🦰',
            
            // 全身詳細描寫
            fullbodyDescription: {
                top: '簡單的上班T恤或襯衫，多為白色、淺藍或淺粉紅，款式寬鬆舒適',
                bottom: '短裙或短褲，長度在膝蓋上方，顏色多為牛仔藍或卡其色，材質舒適',
                shoes: '平底運動鞋或舒適平底鞋，顏色簡樸（白、黑、灰），明顯穿過很多次',
                jacket: '輕薄開衫或廉價外套，作為冬季保暖，顏色單調',
                accessories: '簡單的髮夾或皮筋，無名牌配飾，偶爾戴著一個廉價的串珠手環',
                belt: '簡單的布質腰帶或皮帶，款式樸素',
                details: '指甲修剪短促，無指甲油，手指常有筆痕或污漬，顯示工作繁忙',
                posture: '站姿有點駝背，因為缺乏自信，走路時步伐快速但小心翼翼',
                makeup: '淡妝或素顏，最多只用BB霜和淡色唇膏，強調自然而不是修飾',
                overall: '整體呈現出年輕、清純、有點狼狽的上班族新手形象，充滿青春但也充滿疲憊'
            }
        },
        
        // 個性特徵
        personality: {
            traits: ['善良', '樂觀', '平易近人', '體貼', '正直', '容易信任他人'],
            strengths: ['真誠、可靠', '擅長傾聽', '同情心強', '樂於幫助他人', '工作認真', '富有同理心'],
            weaknesses: ['有點天真', '容易被欺負', '說話直率有時不圓滑', '自信心不足', '無法說不', '容易被利用'],
            communicationStyle: '溫暖自然，常帶著關心，是陳風的傾聽者，說話時常帶著自我懷疑',
            attitude: '把陳風當做真誠的朋友，彼此信任與支持，對他人也充滿善意',
            habits: ['喜歡記筆記', '常常咬嘴唇', '走路會哼歌', '喜歡在空閒時幫同事'],
            hobbies: ['畫畫（業餘）', '寫日記', '看青春電視劇', '逛便利店'],
            lifestyle: '租住廉價公寓，每月工資基本花完，但樂觀面對'
        },
        
        // 人際關係
        relationships: {
            chenFeng: { status: '同事（好友）', attitude: '親近信任，彼此扶持' },
            sunLili: { status: '上級總裁', attitude: '敬畏但有距離感' },
            shuLi: { status: '同部門上級', attitude: '被看不起，被忽視' }
        },
        
        // 背景故事
        background: '出身低收入家庭，父親早逝，母親獨力撫養她。因家庭條件差無法讀大學，入職孫氏集團已有兩年。因為年齡和單純的性格，在公司中有時會被忽視或欺負。但她始終保持善良的心態，不會因為被傷害就變壞。與陳風是同事，也是最要好的朋友，彼此在職場的困難中互相支持。陳風是她在公司裡最信任的人。',
        
        dailyRoutine: {
            morning: '6:00起床，盥洗，6:30簡單早餐（通常是便利店便當），6:50出門',
            work: '7:30-12:00上午工作，12:00-13:00午餐（常和陳風一起），13:00-18:00下午工作',
            evening: '18:30回家，簡單晚餐，19:00-21:00看電視或畫畫，21:30入睡',
            weekend: '周六偶爾加班，周日在家休息或陪母親'
        },
        
        psychologicalProfile: {
            selfEsteem: '較低，但不會自暴自棄',
            stressLevel: '中等偏高，但習慣了',
            dreamAndGoal: '努力攢錢幫助母親，希望有一天能過上穩定生活',
            deepestFear: '母親生病、無法照顧母親、被所有人拋棄',
            secretWish: '被看見和接納，希望自己能變得更強大'
        },
        
        // 故事角色
        narrativeRole: '陳風的精神支柱與信任對象，劇情中可能涉及保護她、幫助她成長，或在職場中為她發聲。她代表純真與善良的力量。玩家對她的選擇將影響她的命運，以及陳風自己的內心世界。'
    }
};

// ============= 角色卡顯示功能 =============

/**
 * 獲取角色詳細信息
 */
function getCharacter(characterId) {
    for (let key in characters) {
        if (characters[key].id === characterId) {
            return characters[key];
        }
    }
    return null;
}

/**
 * 顯示角色卡片
 */
function displayCharacterCard(characterKey) {
    const character = characters[characterKey];
    if (!character) {
        console.error('角色不存在');
        return;
    }
    
    let cardHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 3px solid #d4af37; border-radius: 10px; padding: 20px; color: #fff; max-width: 600px; font-family: Arial, sans-serif;">
            <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 15px; margin-bottom: 15px;">
                <div style="font-size: 60px; margin-bottom: 10px;">${character.appearance.emoji}</div>
                <h1 style="color: #d4af37; margin: 0; font-size: 28px;">${character.name}</h1>
                <p style="color: #aaa; margin: 5px 0; font-size: 14px;">${character.position}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <p><strong>性別：</strong>${character.gender}</p>
                    <p><strong>年齡：</strong>${character.age}歲</p>
                    <p><strong>身高：</strong>${character.appearance.height}</p>
                </div>
                <div>
                    <p><strong>部門：</strong>${character.department}</p>
                    <p><strong>身材：</strong>${character.appearance.build}</p>
                    <p><strong>髮型：</strong>${character.appearance.hairstyle}</p>
                </div>
            </div>
            
            <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 12px; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="color: #d4af37; margin-top: 0;">👔 外觀描述</h3>
                <p style="margin: 5px 0;"><strong>服裝：</strong>${character.appearance.clothing}</p>
                <p style="margin: 5px 0;"><strong>配飾：</strong>${character.appearance.accessories}</p>
                <p style="margin: 5px 0;"><strong>化妝：</strong>${character.appearance.makeup || '無特殊說明'}</p>
                <p style="margin: 5px 0;"><strong>氣質：</strong>${character.appearance.expression}</p>
            </div>
            
            <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 12px; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="color: #d4af37; margin-top: 0;">💭 個性特徵</h3>
                <p style="margin: 5px 0;"><strong>性格特質：</strong>${character.personality.traits.join('、')}</p>
                <p style="margin: 5px 0;"><strong>優點：</strong>${character.personality.strengths.join('、')}</p>
                <p style="margin: 5px 0;"><strong>缺點：</strong>${character.personality.weaknesses.join('、')}</p>
                <p style="margin: 5px 0;"><strong>溝通方式：</strong>${character.personality.communicationStyle}</p>
                <p style="margin: 5px 0;"><strong>待人態度：</strong>${character.personality.attitude}</p>
            </div>
            
            <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 12px; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="color: #d4af37; margin-top: 0;">📖 背景故事</h3>
                <p style="margin: 5px 0;">${character.background}</p>
            </div>
            
            <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; padding: 12px; border-radius: 5px;">
                <h3 style="color: #d4af37; margin-top: 0;">🎭 故事角色</h3>
                <p style="margin: 5px 0;">${character.narrativeRole}</p>
            </div>
        </div>
    `;
    
    return cardHTML;
}

/**
 * 列出所有角色摘要
 */
function listAllCharacters() {
    console.log('=== 孫氏集團角色卡列表 ===\n');
    for (let key in characters) {
        const char = characters[key];
        console.log(`${char.emoji} ${char.name} - ${char.position}`);
        console.log(`   性別：${char.gender} | 年齡：${char.age}歲`);
        console.log(`   性格：${char.personality.traits.join('、')}`);
        console.log(`   出場時機：${char.startStatus}\n`);
    }
}

// ============= 角色互動系統 =============

/**
 * 獲取兩個角色間的關係描述
 */
function getRelationshipInfo(character1Key, character2Key) {
    const char1 = characters[character1Key];
    if (!char1 || !char1.relationships) return null;
    
    const relationshipKey = Object.keys(characters).find(key => characters[key].id === characters[character2Key].id);
    
    for (let key in char1.relationships) {
        if (key === character2Key) {
            return char1.relationships[key];
        }
    }
    return null;
}

// 在頁面加載時列出所有角色
console.log('角色卡系統已加載。使用 listAllCharacters() 查看所有角色。');
console.log('使用 displayCharacterCard("characterKey") 顯示特定角色卡。');
console.log('可用的角色Key：chenFeng, sunLili, shuLi, aLian');
