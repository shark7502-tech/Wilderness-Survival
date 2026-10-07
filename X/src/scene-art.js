(() => {
    const sceneKinds = {
        entrance: 'trail',
        forest: 'deepwood',
        village: 'village',
        field: 'meadow',
        garden: 'flowers',
        mountain: 'ridge',
        cave_entrance: 'cave',
        river: 'river',
        shore: 'lake',
        castle: 'ruins',
        lake: 'lake'
    };

    const palettes = {
        jungle: {
            sky: '#25483b', haze: '#adc18d', far: '#456a4a', mid: '#2b513b', leaf: '#183a2e', leafLight: '#60814a', trunk: '#473d2b', ground: '#40543a', foreground: '#1c3528', path: '#a08d61', water: '#5f9a89', flower: '#e5c77a', sun: '#f2d996', sparse: false
        },
        island: {
            sky: '#4f94a0', haze: '#f2d89b', far: '#619a82', mid: '#377a69', leaf: '#205b4b', leafLight: '#76a66e', trunk: '#745a3c', ground: '#bca36f', foreground: '#476d53', path: '#e0c38a', water: '#54aeb2', flower: '#f3d48a', sun: '#ffe2a0', sparse: false
        },
        grassland: {
            sky: '#6ca7a3', haze: '#e6d9a5', far: '#9da969', mid: '#73864f', leaf: '#455c3a', leafLight: '#adb365', trunk: '#62533a', ground: '#89965a', foreground: '#52643e', path: '#b7a06b', water: '#629e99', flower: '#e7d780', sun: '#ffe6a6', sparse: true
        }
    };

    const sceneTitles = {
        jungle: { entrance: '雨林入口', forest: '密林深處', village: '雨林聚落', field: '林間空地', garden: '野花秘園', mountain: '霧脊高地', cave_entrance: '石窟入口', river: '林間溪谷', shore: '海岸潮間帶', castle: '古樹遺址', lake: '靜謐湖泊', farm: '林邊農園', market: '藤棚集市' },
        island: { entrance: '海島岸門', forest: '棕櫚雨林', village: '海灣聚落', field: '椰林草地', garden: '海風花園', mountain: '火山高脊', cave_entrance: '熔岩洞窟', river: '潟湖溪口', shore: '海島沙岸', castle: '古島遺址', lake: '碧藍潟湖', farm: '島上農圃', market: '海灘市集' },
        grassland: { entrance: '草原邊界', forest: '林地邊緣', village: '草原聚落', field: '遼闊草原', garden: '野花坡地', mountain: '風蝕高地', cave_entrance: '岩洞入口', river: '草原河灣', shore: '河海交界岸', castle: '古石遺址', lake: '高原湖泊', farm: '山谷牧場', market: '草原市集' }
    };

    const sceneDescriptions = {
        jungle: {
            entrance: '藤蔓與高大的樹冠在前方交會，潮濕的林風帶來泥土與葉片的氣息。', forest: '層層樹冠遮住天空，薄霧在蕨葉間緩慢流動。', village: '木屋與藤棚散落在林間，炊煙輕輕升入樹冠。', field: '一小片陽光穿過樹梢，照亮長滿野草的林間空地。', garden: '潮濕石徑旁開著野花，巨葉與藤蔓圍成安靜的花園。', mountain: '林海沿著霧脊起伏，遠方的樹冠被晨光勾亮。', cave_entrance: '岩壁被青苔覆蓋，洞口深處只映出微弱的綠光。', river: '清澈溪水穿過濃密植被，陽光在水面碎成金點。', shore: '森林邊緣的海岸被浪花沖刷，潮池間散落著漂流木與礁石。', castle: '古老石柱被樹根纏住，遺址重新融入雨林。', lake: '平靜的林間湖泊倒映層疊樹冠，岸邊薄霧未散。', farm: '林邊小塊耕地被木柵欄圍起，作物在風裡輕晃。', market: '藤蔓棚架下擺著簡單攤位，林間小徑在此交會。'
        },
        island: {
            entrance: '淺色沙岸連著棕櫚林，海風從清亮的水面吹來。', forest: '棕櫚與闊葉樹交疊成蔭，遠處傳來潮水拍岸聲。', village: '木屋沿海灣而建，帆布棚在暖風中輕輕鼓起。', field: '椰樹間留出一片被陽光照亮的草地。', garden: '海島花叢沿著砂岩小徑盛開，葉面閃著鹽霧水珠。', mountain: '火山岩脊俯瞰海面，雲影在山坡與島礁間移動。', cave_entrance: '黑色火山岩洞口面向潮池，洞壁映著青藍水光。', river: '淡水溪流穿過棕櫚林，最後匯入碧綠潟湖。', shore: '淺色沙灘與火山岩礁相接，潮池映出碧藍海水。', castle: '古石牆立在海島林間，藤葉與海風磨圓了石角。', lake: '潟湖清澈見底，珊瑚色礁石隱約浮在水下。', farm: '海風中的小農圃種著根莖與果樹，沙地被細心整理。', market: '棕櫚葉棚下有幾張交易木桌，近岸船影隨浪搖晃。'
        },
        grassland: {
            entrance: '草原小徑穿過起伏草坡，遠處的地平線在風中敞開。', forest: '零星樹叢聚在谷地邊緣，草浪一層層延伸到遠方。', village: '低矮木屋背靠緩坡，圍欄內的草地安靜開闊。', field: '寬廣草原上野花點點，風把草梢推成綠金色波浪。', garden: '山坡上的野花隨風搖曳，幾株小樹投下疏朗樹影。', mountain: '風蝕高地層層抬升，遠處山稜被清澈天光照亮。', cave_entrance: '岩壁藏在草坡下方，洞口四周長滿耐旱灌木。', river: '淺河蜿蜒切過草甸，蘆葦與水草沿岸生長。', shore: '河流匯入海灣，寬闊水面與草甸岸線在風中相接。', castle: '古石遺址矗立在草海中央，石縫間長出耐風野草。', lake: '高原湖面映著開闊天空，湖岸草甸在微風中起伏。', farm: '山谷牧場有木欄與穀倉，草地一路延伸到坡腳。', market: '土色棚架立在兩條草原道路交叉處，附近沒有密集建築。'
        }
    };

    function seededRandom(seed) {
        let value = seed >>> 0;
        return () => {
            value = (value * 1664525 + 1013904223) >>> 0;
            return value / 4294967296;
        };
    }

    function treeGroup(x, y, scale, palette, palm, opacity) {
        if (palm) {
            return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}"><path d="M0 0 C10 -90 23 -180 8 -295" fill="none" stroke="${palette.trunk}" stroke-width="18"/><path d="M8 -294 C-45 -340 -98 -330 -133 -365 M8 -294 C-37 -377 -79 -390 -98 -424 M8 -294 C4 -378 20 -411 40 -441 M8 -294 C68 -366 112 -368 150 -392 M8 -294 C99 -330 144 -319 181 -333" fill="none" stroke="${palette.leaf}" stroke-width="15" stroke-linecap="round"/><path d="M-133 -365 l30 4 -22 19 M-98 -424 l28 17 -17 12 M40 -441 l8 29 -18 -12 M150 -392 l-17 26 -3 -20 M181 -333 l-27 17 4 -19" fill="none" stroke="${palette.leafLight}" stroke-width="9" stroke-linecap="round"/></g>`;
        }
        return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}"><path d="M-4 0 C2 -85 0 -184 6 -282 L29 -282 C23 -180 33 -85 31 0Z" fill="${palette.trunk}"/><ellipse cx="14" cy="-304" rx="82" ry="68" fill="${palette.leaf}"/><ellipse cx="-34" cy="-275" rx="64" ry="52" fill="${palette.mid}"/><ellipse cx="61" cy="-273" rx="64" ry="58" fill="${palette.leafLight}"/><ellipse cx="10" cy="-350" rx="52" ry="50" fill="${palette.mid}"/></g>`;
    }

    function featureShape(kind, palette) {
        if (kind === 'trail') return `<path d="M640 900 C720 735 690 660 760 565 C820 483 780 404 800 345 C858 403 914 488 862 580 C822 669 910 778 1020 900Z" fill="${palette.path}" opacity=".82"/><path d="M735 900 C778 727 740 647 808 557" fill="none" stroke="#e3d2a2" stroke-width="12" opacity=".24"/>`;
        if (kind === 'deepwood') return `<path d="M0 430 C280 350 440 505 700 400 C970 292 1190 470 1600 325V900H0Z" fill="${palette.foreground}" opacity=".72"/><path d="M0 640 C330 560 510 650 780 560 C1080 470 1320 608 1600 505V900H0Z" fill="${palette.ground}" opacity=".76"/>`;
        if (kind === 'village') return `<g opacity=".9"><path d="M510 556V405L655 295 800 405V556Z" fill="#76634a"/><path d="M470 407 655 260 836 407Z" fill="#453d30"/><rect x="626" y="442" width="58" height="114" fill="#322f25"/><path d="M895 570V445L1000 355 1110 445V570Z" fill="#887151"/><path d="M865 450 1000 322 1143 450Z" fill="#514332"/><rect x="972" y="478" width="47" height="92" fill="#352f25"/></g>`;
        if (kind === 'meadow') return `<path d="M0 565 C290 500 420 590 680 520 C970 438 1210 530 1600 415V900H0Z" fill="${palette.ground}"/><path d="M0 684 C320 610 478 718 786 615 C1080 518 1294 664 1600 555" fill="none" stroke="${palette.leafLight}" stroke-width="30" opacity=".42"/>`;
        if (kind === 'flowers') return `<path d="M0 600 C340 520 480 620 780 525 C1080 430 1320 560 1600 455V900H0Z" fill="${palette.ground}"/><g fill="${palette.flower}" opacity=".92"><circle cx="335" cy="680" r="10"/><circle cx="402" cy="735" r="8"/><circle cx="1210" cy="660" r="11"/><circle cx="1300" cy="742" r="9"/><circle cx="1050" cy="794" r="7"/><circle cx="530" cy="810" r="8"/><circle cx="930" cy="704" r="10"/></g>`;
        if (kind === 'ridge') return `<path d="M0 575 245 352 385 445 680 202 913 420 1154 266 1600 580V900H0Z" fill="${palette.far}"/><path d="M0 655 300 470 488 560 810 340 1050 515 1285 380 1600 620V900H0Z" fill="${palette.mid}"/><path d="M598 269 680 202 758 275 706 258 681 281 653 254Z" fill="${palette.haze}" opacity=".72"/>`;
        if (kind === 'cave') return `<path d="M390 900 C425 690 470 420 590 325 C704 236 875 236 1005 324 C1130 411 1180 690 1228 900Z" fill="#17251d"/><path d="M510 900 C555 665 580 468 665 397 C740 335 842 336 925 396 C1010 459 1051 667 1090 900Z" fill="#0b1613"/><ellipse cx="805" cy="645" rx="210" ry="160" fill="${palette.leaf}" opacity=".2"/>`;
        if (kind === 'river') return `<path d="M600 900 C730 752 672 680 795 570 C900 475 825 421 930 325 C1032 233 1010 147 1110 0H1460C1265 155 1290 270 1154 388 C1030 493 1128 576 978 692 C840 798 913 854 850 900Z" fill="${palette.water}" opacity=".92"/><path d="M695 900 C788 745 738 681 843 585 C940 493 877 430 991 325" fill="none" stroke="#d6e7cf" stroke-width="17" opacity=".38"/>`;
        if (kind === 'ruins') return `<g fill="#817c5d" opacity=".88"><path d="M510 640V385H570V640ZM630 640V332H692V640ZM750 640V380H810V640ZM870 640V300H934V640ZM990 640V388H1050V640Z"/><path d="M480 380 600 321 725 370 850 284 1080 367 1080 408 480 420Z"/><path d="M545 640H1040V693H545Z"/></g><path d="M0 690 C370 590 545 700 810 625 C1110 540 1330 670 1600 560V900H0Z" fill="${palette.foreground}" opacity=".72"/>`;
        return `<path d="M0 565 C220 496 432 565 620 512 C850 450 1040 502 1220 463 C1380 430 1490 480 1600 445V900H0Z" fill="${palette.ground}"/><path d="M0 665 C285 606 460 680 685 622 C936 558 1200 668 1600 552V900H0Z" fill="${palette.water}" opacity=".88"/><path d="M0 694 C280 631 440 708 696 650 C930 596 1225 695 1600 580" fill="none" stroke="#d8dfbd" stroke-width="13" opacity=".38"/>`;
    }

    function buildSvg(sceneKey, biome) {
        const palette = palettes[biome] || palettes.jungle;
        const kind = sceneKinds[sceneKey] || 'trail';
        const seed = [...`${sceneKey}:${biome}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const random = seededRandom(seed);
        const trees = [];
        const count = palette.sparse ? 9 : biome === 'island' ? 14 : 19;
        for (let index = 0; index < count; index++) {
            const x = Math.round(35 + random() * 1530);
            const y = Math.round(560 + random() * 205);
            const scale = (0.48 + random() * 0.92).toFixed(2);
            const opacity = (0.48 + random() * 0.46).toFixed(2);
            trees.push(treeGroup(x, y, scale, palette, biome === 'island' && index % 2 === 0, opacity));
        }
        const sun = `<circle cx="1260" cy="145" r="96" fill="${palette.sun}" opacity=".72"/><circle cx="1260" cy="145" r="174" fill="${palette.sun}" opacity=".12"/>`;
        const horizon = biome === 'island'
            ? `<path d="M0 425 C280 388 400 443 710 408 C1050 365 1310 433 1600 388V690H0Z" fill="${palette.water}" opacity=".66"/><path d="M0 498 C310 468 490 520 780 478 C1050 441 1300 493 1600 450" fill="none" stroke="#dddfb0" stroke-width="8" opacity=".4"/>`
            : biome === 'grassland'
                ? `<path d="M0 450 C280 350 520 450 760 370 C1080 260 1300 420 1600 310V695H0Z" fill="${palette.far}"/><path d="M0 524 C290 442 470 523 730 460 C1040 386 1310 515 1600 414V730H0Z" fill="${palette.mid}"/>`
                : `<path d="M0 458 C210 330 440 444 640 347 C895 222 1105 403 1300 302 C1415 242 1510 274 1600 231V730H0Z" fill="${palette.far}"/><path d="M0 530 C250 414 465 535 695 427 C940 314 1150 512 1370 398 C1460 350 1545 366 1600 337V760H0Z" fill="${palette.mid}"/>`;
        const foliage = biome === 'grassland'
            ? `<path d="M0 760Q40 704 58 760T115 754T168 760M1440 770Q1480 708 1500 770T1555 765T1600 770" fill="none" stroke="${palette.leafLight}" stroke-width="7" opacity=".7"/>`
            : `<path d="M0 95 C150 42 240 112 330 70 C420 28 466 45 520 0H0ZM1080 0 C1170 68 1260 25 1360 82 C1450 134 1510 62 1600 110V0Z" fill="${palette.foreground}" opacity=".82"/>`;
        const path = featureShape(kind, palette);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${palette.sky}"/><stop offset="1" stop-color="${palette.haze}"/></linearGradient><linearGradient id="earth" x2="0" y2="1"><stop stop-color="${palette.ground}"/><stop offset="1" stop-color="${palette.foreground}"/></linearGradient><radialGradient id="mist"><stop stop-color="${palette.haze}" stop-opacity=".7"/><stop offset="1" stop-color="${palette.haze}" stop-opacity="0"/></radialGradient><filter id="soft"><feGaussianBlur stdDeviation="24"/></filter></defs><rect width="1600" height="900" fill="url(#sky)"/>${sun}<ellipse cx="800" cy="440" rx="540" ry="145" fill="url(#mist)" filter="url(#soft)"/>${horizon}<rect y="550" width="1600" height="350" fill="url(#earth)" opacity=".78"/>${path}${trees.join('')}${foliage}<rect width="1600" height="900" fill="#102019" opacity=".1"/></svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    const art = {};
    for (const biome of Object.keys(palettes)) {
        art[biome] = {};
        for (const sceneKey of Object.keys(sceneKinds)) art[biome][sceneKey] = buildSvg(sceneKey, biome);
    }

    const junglePhotoIds = {
        entrance: 'photo-1448375240586-882707db888b',
        forest: 'photo-1441974231531-c6227db76b6e',
        village: 'photo-1473448912268-2022ce9509d8',
        field: 'photo-1500530855697-b586d89ba3ee',
        garden: 'photo-1511497584788-876760111969',
        mountain: 'photo-1472396961693-142e6e269027',
        cave_entrance: 'photo-1425913397330-cf8af2ff40a1',
        river: 'photo-1476231682828-37e571bc172f',
        castle: 'photo-1523712999610-f77fbcfc3843',
        lake: 'photo-1501785888041-af3ef285b470'
    };
    for (const [sceneKey, photoId] of Object.entries(junglePhotoIds)) {
        art.jungle[sceneKey] = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=2000&q=85`;
    }

    const caveInteriorPhoto = 'https://images.unsplash.com/photo-1759064094948-c1dbe605713e?auto=format&fit=crop&w=2000&q=85';
    const baseArt = Object.fromEntries(Object.keys(palettes).map(biome => [biome, caveInteriorPhoto]));

    window.sceneArt = {
        get(sceneKey, biome) {
            const imageKey = sceneKinds[sceneKey] ? sceneKey : sceneKey === 'farm' ? 'village' : sceneKey === 'market' ? 'garden' : 'entrance';
            return art[biome]?.[imageKey] || art.jungle[imageKey];
        },
        scenes: Object.keys(sceneKinds),
        biomes: Object.keys(palettes),
        getBase(biome) {
            return baseArt[biome] || baseArt.jungle;
        },
        titles: sceneTitles,
        descriptions: sceneDescriptions
    };
})();
