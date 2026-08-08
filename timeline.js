try { document.documentElement.dataset.theme = localStorage.getItem("historyMatchingTheme.v1") || "light"; } catch { document.documentElement.dataset.theme = "light"; }

const THEME_KEY = "historyMatchingTheme.v1";
    const compactRows = [
      {key:"flow",sources:["common"]},
      {key:"main",sources:["goguryeo","balhae","goryeo","joseon"]},
      {key:"branch",sources:["baekje"]},
      {key:"south",sources:["silla"]}
    ];

    const reign = (nation,text,important=[]) => `<div class="reign-strip ${nation}">${text.split(" → ").map(name => important.includes(name) ? `<b>${name}</b>` : name).join(" → ")}</div>`;
    const reignsByIndex = {
      1:{goguryeo:reign("goguryeo","동명성왕 → 유리명왕 → 대무신왕 → 민중왕 → 모본왕 → 태조왕 → 차대왕 → 신대왕 → 고국천왕 → 산상왕 → 동천왕 → 중천왕 → 서천왕 → 봉상왕",["태조왕","고국천왕"]),baekje:reign("baekje","온조왕 → 다루왕 → 기루왕 → 개루왕 → 초고왕 → 구수왕 → 사반왕 → 고이왕 → 책계왕 → 분서왕",["고이왕"]),silla:reign("silla","혁거세거서간 → 남해차차웅 → 유리이사금 → 탈해이사금 → 파사이사금 → 지마이사금 → 일성이사금 → 아달라이사금 → 벌휴이사금 → 내해이사금 → 조분이사금 → 첨해이사금 → 미추이사금 → 유례이사금")},
      2:{goguryeo:reign("goguryeo","미천왕 → 고국원왕 → 소수림왕 → 고국양왕 → 광개토대왕",["미천왕","소수림왕","광개토대왕"]),baekje:reign("baekje","비류왕 → 계왕 → 근초고왕 → 근구수왕 → 침류왕 → 진사왕 → 아신왕",["근초고왕","침류왕"]),silla:reign("silla","기림이사금 → 흘해이사금 → 내물마립간",["내물마립간"])},
      3:{goguryeo:reign("goguryeo","광개토대왕 → 장수왕 → 문자명왕",["광개토대왕","장수왕"]),baekje:reign("baekje","아신왕 → 전지왕 → 구이신왕 → 비유왕 → 개로왕 → 문주왕 → 삼근왕 → 동성왕",["개로왕","문주왕"]),silla:reign("silla","실성마립간 → 눌지마립간 → 자비마립간 → 소지마립간")},
      4:{goguryeo:reign("goguryeo","문자명왕 → 안장왕 → 안원왕 → 양원왕 → 평원왕 → 영양왕",["영양왕"]),baekje:reign("baekje","동성왕 → 무령왕 → 성왕 → 위덕왕 → 혜왕 → 법왕 → 무왕",["무령왕","성왕","무왕"]),silla:reign("silla","소지마립간 → 지증왕 → 법흥왕 → 진흥왕 → 진지왕 → 진평왕",["지증왕","법흥왕","진흥왕"])},
      5:{goguryeo:reign("goguryeo","영양왕 → 영류왕 → 보장왕",["영양왕","보장왕"]),baekje:reign("baekje","무왕 → 의자왕",["무왕","의자왕"]),silla:reign("silla","진평왕 → 선덕여왕 → 진덕여왕 → 태종무열왕 → 문무왕",["선덕여왕","태종무열왕","문무왕"])},
      7:{balhae:reign("balhae","고왕 → 무왕 → 문왕 → 폐왕 → 성왕 → 강왕 → 정왕 → 희왕 → 간왕 → 선왕 → 대이진 → 대건황 → 대현석 → 대위해 → 애왕",["고왕","무왕","문왕","선왕"]),silla:reign("silla","문무왕 → 신문왕 → 효소왕 → 성덕왕 → 효성왕 → 경덕왕 → 혜공왕 → 선덕왕 → 원성왕 → 소성왕 → 애장왕 → 헌덕왕 → 흥덕왕 → 희강왕 → 민애왕 → 신무왕 → 문성왕 → 헌안왕 → 경문왕 → 헌강왕 → 정강왕 → 진성여왕 → 효공왕 → 신덕왕 → 경명왕 → 경애왕 → 경순왕",["문무왕","신문왕","성덕왕","경덕왕","진성여왕","경순왕"])},
      8:{goguryeo:reign("goryeo","궁예 → 태조 왕건",["태조 왕건"]),baekje:reign("baekje","견훤 → 신검",["견훤"]),silla:reign("silla","효공왕 → 신덕왕 → 경명왕 → 경애왕 → 경순왕",["경순왕"])},
      9:{goryeo:reign("goryeo","태조 → 혜종 → 정종 → 광종 → 경종 → 성종 → 목종 → 현종 → 덕종 → 정종 → 문종 → 순종 → 선종 → 헌종 → 숙종 → 예종 → 인종 → 의종",["태조","광종","성종","현종","문종","숙종","예종","인종","의종"])},
      10:{goryeo:reign("goryeo","명종 → 신종 → 희종 → 강종 → 고종 → 원종",["고종","원종"])},
      11:{goryeo:reign("goryeo","충렬왕 → 충선왕 → 충숙왕 → 충혜왕 → 충목왕 → 충정왕 → 공민왕 → 우왕 → 창왕 → 공양왕",["공민왕"])},
      13:{joseon:reign("joseon","태조 → 정종 → 태종 → 세종 → 문종 → 단종 → 세조 → 예종 → 성종",["태조","태종","세종","세조","성종"])},
      14:{joseon:reign("joseon","연산군 → 중종 → 인종 → 명종 → 선조 → 광해군 → 인조 → 효종",["선조","인조"])},
      15:{joseon:reign("joseon","현종 → 숙종 → 경종 → 영조 → 정조 → 순조 → 헌종 → 철종",["숙종","영조","정조"])},
      17:{joseon:reign("joseon","고종 → 순종",["고종"])}
    };
    const standaloneKingColumns = new Set([6,12,16]);
    const card = (nation,time,title,copy) => `<article class="event-card ${nation}"><time>${time}</time><strong>${title}</strong>${copy?`<p>${copy}</p>`:""}</article>`;
    const kings = (text,important=[],extra="") => `<div class="king-strip ${extra}">${text.split(" → ").map(name=>important.includes(name)?`<b>${name}</b>`:name).join(" → ")}</div>`;
    const columns = [
      {id:"start",nav:"선사·고조선",title:"선사·고조선",date:"구석기 ~ BCE 108",width:480,color:"var(--accent)",cells:{common:[card("","선사","구석기 → 신석기 → 청동기 → 철기","도구·경제·사회 변화를 먼저 구분")],goguryeo:[card("","BCE 2333 전승","고조선","단군왕검·8조법·위만·한 무제")],baekje:[card("","철기 시대","부여·고구려·옥저·동예","제천 행사와 풍습 구분")],silla:[card("","삼한","마한·진한·변한","소도·천군·제정 분리")]}},
      {id:"three",nav:"삼국",title:"1~3세기",date:"고대 국가 성립",width:390,color:"var(--goguryeo)",cells:{common:[card("","핵심","연맹 왕국 → 중앙 집권 국가","왕권·율령·불교·관등제가 기준")],goguryeo:[card("goguryeo","태조왕 → 고국천왕","국가 체제 성장","옥저 정복·5부 / 부자 상속·진대법")],baekje:[card("baekje","고이왕","6좌평·16관등","관복 제정, 통치 체제 정비")],silla:[card("silla","내물마립간","김씨 왕위 세습","마립간 칭호, 고구려 원조")]}},
      {title:"4세기",date:"백제 전성기",width:450,color:"var(--baekje)",cells:{common:[card("","전성기 이동","4C 백제","근초고왕을 첫 기준점으로")],goguryeo:[card("goguryeo","313 미천왕","낙랑군 축출",""),card("goguryeo","372 소수림왕","불교·태학·율령","중앙 집권 체제 정비")],baekje:[card("baekje","근초고왕","마한 통합·평양성 공격","고흥의 『서기』, 해상 교류"),card("baekje","384 침류왕","불교 수용","")],silla:[card("silla","400 내물마립간","고구려의 신라 구원","왜·가야 세력 격퇴")]}},
      {title:"5세기",date:"고구려 전성기",width:500,color:"var(--goguryeo)",cells:{common:[card("","전성기 이동","5C 고구려","광개토 대왕 → 장수왕")],goguryeo:[card("goguryeo","391~413","광개토 대왕","영락·신라 구원·요동 진출"),card("goguryeo","427 장수왕","평양 천도·남진","한성 함락·충주 고구려비")],baekje:[card("baekje","475","개로왕 → 문주왕","한성 함락 뒤 웅진 천도"),card("baekje","동성왕","신라와 혼인 동맹","")],silla:[card("silla","눌지왕","나제 동맹","고구려 간섭에서 이탈"),card("silla","소지왕","우역 설치","")]}},
      {title:"6세기",date:"신라 전성기",width:560,color:"var(--silla)",cells:{common:[card("","전성기 이동","6C 신라","지증 → 법흥 → 진흥")],goguryeo:[card("goguryeo","598·612 영양왕","수의 침입 격퇴","을지문덕·살수 대첩")],baekje:[card("baekje","무령왕","22담로","왕족 파견으로 지방 통제"),card("baekje","538 성왕","사비 천도·남부여","5부 5방·관산성 전사")],silla:[card("silla","지증왕","국호·왕호·우경","우산국 복속"),card("silla","법흥왕","율령·불교 공인","병부·상대등·금관가야"),card("silla","진흥왕","한강·화랑도·순수비","대가야 병합")]}},
      {title:"7세기",date:"통일 전쟁",width:600,color:"var(--silla)",cells:{common:[card("","660 → 668 → 676","백제 멸망 → 고구려 멸망 → 나당 전쟁 승리","삼국 통일의 절대 연도")],goguryeo:[card("goguryeo","645 보장왕","안시성 전투","연개소문·당 태종"),card("goguryeo","668","고구려 멸망","안동도호부")],baekje:[card("baekje","660 의자왕","백제 멸망","황산벌·웅진도독부"),card("baekje","663","백강 전투","복신·도침·부여풍")],silla:[card("silla","654~676","태종 무열왕 → 문무왕","나당 연합·매소성·기벌포")]}},
      {title:"삼국 왕 순서",date:"회색 보조 골격",width:850,color:"var(--line-strong)",cells:{goguryeo:[kings("동명성왕 → 유리명왕 → 대무신왕 → 민중왕 → 모본왕 → 태조왕 → 차대왕 → 신대왕 → 고국천왕 → 산상왕 → 동천왕 → 중천왕 → 서천왕 → 봉상왕 → 미천왕 → 고국원왕 → 소수림왕 → 고국양왕 → 광개토대왕 → 장수왕 → 문자명왕 → 안장왕 → 안원왕 → 양원왕 → 평원왕 → 영양왕 → 영류왕 → 보장왕",["태조왕","고국천왕","미천왕","소수림왕","광개토대왕","장수왕","영양왕","보장왕"])],baekje:[kings("온조왕 → 다루왕 → 기루왕 → 개루왕 → 초고왕 → 구수왕 → 사반왕 → 고이왕 → 책계왕 → 분서왕 → 비류왕 → 계왕 → 근초고왕 → 근구수왕 → 침류왕 → 진사왕 → 아신왕 → 전지왕 → 구이신왕 → 비유왕 → 개로왕 → 문주왕 → 삼근왕 → 동성왕 → 무령왕 → 성왕 → 위덕왕 → 혜왕 → 법왕 → 무왕 → 의자왕",["고이왕","근초고왕","침류왕","개로왕","문주왕","무령왕","성왕","무왕","의자왕"])],silla:[kings("혁거세거서간 → 남해차차웅 → 유리이사금 → 탈해이사금 → 파사이사금 → 지마이사금 → 일성이사금 → 아달라이사금 → 벌휴이사금 → 내해이사금 → 조분이사금 → 첨해이사금 → 미추이사금 → 유례이사금 → 기림이사금 → 흘해이사금 → 내물마립간 → 실성마립간 → 눌지마립간 → 자비마립간 → 소지마립간 → 지증왕 → 법흥왕 → 진흥왕 → 진지왕 → 진평왕 → 선덕여왕 → 진덕여왕 → 태종무열왕 → 문무왕",["내물마립간","지증왕","법흥왕","진흥왕","선덕여왕","태종무열왕","문무왕"])]}},
      {id:"north",nav:"남북국",title:"남북국",date:"676 ~ 926",width:620,color:"var(--balhae)",cells:{common:[card("","676·698","통일 신라와 발해","남북국의 두 축")],silla:[card("silla","신문왕","통일 체제 정비","관료전·국학·9주 5소경·9서당 10정"),card("silla","신라 말","진골 갈등·호족 성장","선종·풍수지리")],balhae:[card("balhae","무왕","장문휴의 등주 공격","인안"),card("balhae","문왕","3성 6부·상경 천도","대흥"),card("balhae","선왕","해동성국","5경 15부 62주")]}},
      {title:"후삼국",date:"900 ~ 936",width:520,color:"var(--accent)",cells:{common:[card("","900~936","후삼국의 성립과 통합","후백제·후고구려·신라 → 고려")],goguryeo:[card("goryeo","901","궁예·후고구려","마진 → 태봉"),card("goryeo","918~936","왕건·고려","건국 → 후삼국 통일")],baekje:[card("baekje","900","견훤·후백제","완산주")],silla:[card("silla","935","신라의 항복","경순왕 → 고려 편입")]}},
      {id:"goryeo",nav:"고려",title:"고려 전기",date:"918 ~ 1170",width:720,color:"var(--goryeo)",cells:{common:[card("","대외 관계","거란 → 여진","서희·강감찬 → 윤관·별무반")],goryeo:[card("goryeo","태조","북진·사심관·기인","훈요 10조"),card("goryeo","광종","노비안검법·과거제","공복 제정"),card("goryeo","성종","시무 28조·12목","유교 정치"),card("goryeo","문종~예종","전시과·별무반","동북 9성")]}},
      {title:"무신 정권·몽골",date:"1170 ~ 1270",width:700,color:"var(--goryeo)",cells:{common:[card("","침입 순서","거란 → 여진 → 몽골","세기와 함께 고정")],goryeo:[card("goryeo","1170","무신 정변","정중부 → 경대승 → 이의민"),card("goryeo","최충헌·최우","교정도감·정방·서방","도방·삼별초"),card("goryeo","1231~1270","대몽 항쟁","강화 천도·처인성·충주성"),card("goryeo","1270 이후","삼별초 항쟁","진도 → 제주")]}},
      {title:"원 간섭·고려 말",date:"1270 ~ 1392",width:620,color:"var(--goryeo)",cells:{common:[card("","1388 → 1391 → 1392","위화도 회군 → 과전법 → 조선 건국","")],goryeo:[card("goryeo","원 간섭기","권문세족 성장","정동행성 이문소"),card("goryeo","공민왕","반원 자주 개혁","쌍성총관부 수복·전민변정도감"),card("goryeo","우왕~공양왕","신진 사대부 분화","역성혁명파 성장")]}},
      {title:"고려 왕 순서",date:"34왕 · 회색 보조",width:760,color:"var(--line-strong)",cells:{goryeo:[kings("태조 → 혜종 → 정종 → 광종 → 경종 → 성종 → 목종 → 현종 → 덕종 → 정종 → 문종 → 순종 → 선종 → 헌종 → 숙종 → 예종 → 인종 → 의종 → 명종 → 신종 → 희종 → 강종 → 고종 → 원종 → 충렬왕 → 충선왕 → 충숙왕 → 충혜왕 → 충목왕 → 충정왕 → 공민왕 → 우왕 → 창왕 → 공양왕",["태조","광종","성종","현종","문종","숙종","예종","인종","의종","고종","원종","공민왕"])]}},
      {id:"joseon",nav:"조선",title:"조선 전기",date:"1392 ~ 1494",width:720,color:"var(--joseon)",cells:{common:[card("","제도 완성","태종 → 세종 → 세조 → 성종","왕과 제도를 직접 연결")],joseon:[card("joseon","태종","6조 직계제·호패법","사병 혁파"),card("joseon","세종","의정부 서사제·공법","훈민정음·4군 6진"),card("joseon","세조","6조 직계제·직전법","집현전 폐지"),card("joseon","성종","경국대전·홍문관","사림 등용")]}},
      {title:"사림·붕당·양란",date:"1494 ~ 1659",width:760,color:"var(--joseon)",cells:{common:[card("","정치 흐름","사화 → 붕당 → 왜란 → 호란","선후를 한 덩어리로")],joseon:[card("joseon","연산군~명종","무오·갑자·기묘·을사사화","사림 성장"),card("joseon","선조","동인·서인·임진왜란","비변사·훈련도감"),card("joseon","광해군","중립 외교·대동법","인조반정"),card("joseon","인조","정묘호란·병자호란","친명배금")]}},
      {title:"붕당·탕평·세도",date:"1659 ~ 1863",width:780,color:"var(--joseon)",cells:{common:[card("","정치 흐름","예송 → 환국 → 탕평 → 세도","조선 후기 골격")],joseon:[card("joseon","현종","예송 논쟁","서인·남인"),card("joseon","숙종","환국·대동법 확대","상평통보"),card("joseon","영조","탕평·균역법·속대전","청계천 준설"),card("joseon","정조","규장각·장용영·신해통공","수원 화성"),card("joseon","순조~철종","세도 정치","홍경래의 난·임술 농민 봉기")]}},
      {title:"조선 왕 순서",date:"27왕 · 핵심 암기",width:900,color:"var(--joseon)",cells:{joseon:[kings("태조 → 정종 → 태종 → 세종 → 문종 → 단종 → 세조 → 예종 → 성종 → 연산군 → 중종 → 인종 → 명종 → 선조 → 광해군 → 인조 → 효종 → 현종 → 숙종 → 경종 → 영조 → 정조 → 순조 → 헌종 → 철종 → 고종 → 순종",["태조","태종","세종","세조","성종","선조","인조","숙종","영조","정조","고종"],"joseon-kings").replace("연산군","<span class='deposed'>연산군</span>").replace("광해군","<span class='deposed'>광해군</span>")]}},
      {id:"modern",nav:"개항·근현대",title:"개항·대한제국",date:"1863 ~ 1910",width:760,color:"var(--modern)",cells:{common:[card("","사건 순서","강화도 조약 → 임오군란 → 갑신정변 → 동학","연도로 고정")],joseon:[card("modern","흥선 대원군","왕권 강화·통상 수교 거부","경복궁 중건"),card("modern","1876","강화도 조약","개항"),card("modern","1882 → 1884","임오군란 → 갑신정변","제물포 조약·한성 조약"),card("modern","1894 → 1897","동학·갑오개혁 → 대한제국","광무개혁")]}},
      {title:"일제 강점기",date:"1910 ~ 1945",width:780,color:"var(--modern)",cells:{common:[card("modern","1910년대","무단 통치","토지 조사 사업·회사령"),card("modern","1919","3·1 운동","대한민국 임시정부"),card("modern","1920년대","문화 통치","산미 증식 계획·민족 유일당"),card("modern","1930~40년대","민족 말살 통치","병참 기지화·강제 동원")],joseon:[card("modern","독립운동","봉오동 → 청산리 → 자유시","의열단·한인 애국단·한국광복군")]}},
      {title:"대한민국",date:"1945 ~ 현재",width:760,color:"var(--modern)",cells:{common:[card("modern","1945 → 1948","광복 → 정부 수립","분단"),card("modern","1950~53","6·25 전쟁","정전 협정"),card("modern","1960","4·19 혁명","제2공화국"),card("modern","1980","5·18 민주화 운동",""),card("modern","1987","6월 민주 항쟁","대통령 직선제")],joseon:[card("modern","현대 정치","이승만 → 박정희 → 전두환 → 노태우","정부별 사건을 연도에 연결")]} }
    ];

    const track = document.getElementById("timelineTrack");
    const viewport = document.getElementById("timelineViewport");
    const progress = document.getElementById("progressBar");
    const currentEra = document.getElementById("currentEra");
    const nav = document.getElementById("eraNav");
    const laneFlow = document.getElementById("laneFlow");
    const laneMain = document.getElementById("laneMain");
    const laneBranch = document.getElementById("laneBranch");
    const laneSouth = document.getElementById("laneSouth");
    const laneMainBox = document.getElementById("laneMainBox");
    const laneBranchBox = document.getElementById("laneBranchBox");
    const laneSouthBox = document.getElementById("laneSouthBox");

    function laneState(index) {
      if (index === 0) return {names:["시대 흐름","고조선","여러 나라","삼한"],colors:["var(--accent)","var(--accent)","var(--line-strong)","var(--silla)"]};
      if (index <= 6) return {names:["공통·전환","고구려","백제","신라"],colors:["var(--accent)","var(--goguryeo)","var(--baekje)","var(--silla)"]};
      if (index === 7) return {names:["남북국 흐름","발해","—","통일 신라"],colors:["var(--accent)","var(--balhae)","var(--line-strong)","var(--silla)"]};
      if (index === 8) return {names:["후삼국 통합","후고구려 → 고려","후백제","신라"],colors:["var(--accent)","var(--goryeo)","var(--baekje)","var(--silla)"]};
      if (index <= 12) return {names:["시대·대외 흐름","고려","대외·전쟁","사회·문화"],colors:["var(--accent)","var(--goryeo)","var(--blue)","var(--balhae)"]};
      if (index <= 16) return {names:["정치 흐름","조선","제도·전쟁","사회·문화"],colors:["var(--accent)","var(--joseon)","var(--blue)","var(--silla)"]};
      return {names:["시대 흐름","조선 → 대한제국","개항·독립운동","대한민국"],colors:["var(--accent)","var(--joseon)","var(--modern)","var(--good)"]};
    }

    function syncLaneLabels(index) {
      const state = laneState(index);
      [laneFlow,laneMain,laneBranch,laneSouth].forEach((label,i) => label.textContent = state.names[i]);
      [laneMainBox,laneBranchBox,laneSouthBox].forEach((box,i) => box.style.setProperty("--lane-color",state.colors[i+1]));
    }

    columns.forEach((column,index) => {
      if (standaloneKingColumns.has(index)) return;
      const section = document.createElement("section");
      section.className = "era-column";
      section.style.setProperty("--width", `${column.width}px`);
      section.style.setProperty("--era-color", column.color);
      section.dataset.index = index;
      if (column.id) section.id = `era-${column.id}`;
      section.innerHTML = `<header class="era-head"><strong>${column.title}</strong><small>${column.date}</small></header>` + compactRows.map(row => {
        const items = row.sources.flatMap(source => column.cells?.[source] || []);
        const reignItems = row.sources.flatMap(source => reignsByIndex[index]?.[source] || []);
        return `<div class="timeline-cell ${items.length || reignItems.length ? "" : "inactive"}" data-lane="${row.key}">${items.join("")}${reignItems.join("")}</div>`;
      }).join("");
      track.appendChild(section);
      if (column.nav) {
        const button = document.createElement("button");
        button.type = "button"; button.textContent = column.nav; button.dataset.target = column.id;
        button.addEventListener("click", () => scrollToEra(column.id));
        nav.appendChild(button);
      }
    });

    function scrollToEra(id) {
      const target = document.getElementById(`era-${id}`);
      if (!target) return;
      viewport.scrollTo({left: target.offsetLeft, behavior:"smooth"});
    }
    function updatePosition() {
      const max = viewport.scrollWidth - viewport.clientWidth;
      progress.style.width = `${max > 0 ? viewport.scrollLeft / max * 100 : 0}%`;
      let active = "start";
      let activeTitle = "선사·고조선";
      let activeColumn = null;
      [...track.children].forEach(column => {
        if (column.offsetLeft <= viewport.scrollLeft + viewport.clientWidth * .28) activeColumn = column;
      });
      [...track.children].forEach(column => column.classList.toggle("current", column === activeColumn));
      if (activeColumn) {
        activeTitle = activeColumn.querySelector(".era-head strong")?.textContent || activeTitle;
        syncLaneLabels(Number(activeColumn.dataset.index));
      }
      [...nav.children].forEach(button => {
        const target = document.getElementById(`era-${button.dataset.target}`);
        if (target && target.offsetLeft <= viewport.scrollLeft + viewport.clientWidth * .28) active = button.dataset.target;
      });
      [...nav.children].forEach(button => button.classList.toggle("active", button.dataset.target === active));
      currentEra.textContent = activeTitle;
    }
    viewport.addEventListener("scroll", updatePosition, {passive:true});
    viewport.addEventListener("wheel", event => {
      if (!event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      viewport.scrollLeft += event.deltaY;
      event.preventDefault();
    }, {passive:false});
    let dragStart = 0, scrollStart = 0, dragging = false;
    viewport.addEventListener("pointerdown", event => { if (event.button !== 0) return; dragging=true; dragStart=event.clientX; scrollStart=viewport.scrollLeft; viewport.classList.add("dragging"); viewport.setPointerCapture(event.pointerId); });
    viewport.addEventListener("pointermove", event => { if (dragging) viewport.scrollLeft = scrollStart - (event.clientX - dragStart); });
    const stopDrag = () => { dragging=false; viewport.classList.remove("dragging"); };
    viewport.addEventListener("pointerup", stopDrag); viewport.addEventListener("pointercancel", stopDrag);
    viewport.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      viewport.scrollBy({left:(event.key === "ArrowLeft" ? -1 : 1) * viewport.clientWidth * .45,behavior:"smooth"});
      event.preventDefault();
    });
    document.getElementById("prevBtn").addEventListener("click", () => viewport.scrollBy({left:-viewport.clientWidth*.78,behavior:"smooth"}));
    document.getElementById("nextBtn").addEventListener("click", () => viewport.scrollBy({left:viewport.clientWidth*.78,behavior:"smooth"}));
    document.getElementById("resetViewBtn").addEventListener("click", () => scrollToEra("start"));

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    function syncTheme() {
      const light = document.documentElement.dataset.theme === "light";
      themeIcon.textContent = light ? "☾" : "☀";
      const label = light ? "다크" : "라이트";
      themeToggle.setAttribute("aria-label", `${label} 모드로 전환`); themeToggle.title = `${label} 모드로 전환`;
      document.querySelector('meta[name="theme-color"]').content = light ? "#f5f7f8" : "#0f151c";
    }
    themeToggle.addEventListener("click", () => { const next=document.documentElement.dataset.theme === "light" ? "dark" : "light"; document.documentElement.dataset.theme=next; try{localStorage.setItem(THEME_KEY,next)}catch{} syncTheme(); });
    syncTheme(); updatePosition();
