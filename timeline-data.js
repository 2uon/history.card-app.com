(function () {
  function slug(value) {
    return value.trim().replace(/\s+/g, "-").replace(/[^\w가-힣·-]/g, "-").replace(/-+/g, "-");
  }
  const LANES = [
    { key: "main", sources: ["goguryeo", "balhae", "goryeo", "joseon"] },
    { key: "branch", sources: ["silla"] },
    { key: "south", sources: ["baekje"] }
  ];
  const ROW_Y = { main: 102, branch: 306, south: 510 };
  const COLORS = {
    prehistory: "var(--accent)",
    goguryeo: "var(--goguryeo)",
    baekje: "var(--baekje)",
    silla: "var(--silla)",
    balhae: "var(--balhae)",
    goryeo: "var(--goryeo)",
    joseon: "var(--joseon)",
    modern: "var(--modern)",
    blue: "var(--blue)"
  };

  const era = (config) => ({
    width: 720,
    color: COLORS.goguryeo,
    labels: ["고구려", "신라", "백제"],
    ...config
  });
  const flow = (nation, title, notes = [], options = {}) => ({
    kind: "flow",
    id: options.id || slug(`${nation}-${title}`),
    nation,
    name: title,
    date: options.date || "",
    notes,
    important: options.important ?? true,
    isolated: options.isolated || false
  });
  const ruler = (nation, name, options = {}) => ({
    kind: "ruler",
    id: options.id || slug(`${nation}-${name}`),
    nation,
    name,
    date: options.date || "",
    notes: options.notes || [],
    important: options.important || false
  });
  const marker = (nation, name, date, options = {}) => ({
    kind: "milestone",
    id: options.id || slug(`${nation}-${name}`),
    nation,
    name,
    date,
    notes: options.notes || [],
    important: true
  });
  const minor = (nation, names) => names.map((name) => ruler(nation, name));

  const COLUMNS = [
    era({
      id: "prehistory",
      nav: "선사",
      title: "선사 시대",
      date: "구석기 → 신석기 → 청동기 → 철기",
      width: 980,
      color: COLORS.prehistory,
      labels: ["선사 시대", "—", "—"],
    connect: { main: true, branch: false, south: false },
      lanes: {
        main: [
          flow("prehistory", "구석기", ["이동 생활", "사냥과 채집", "뗀석기", "주먹도끼"]),
          flow("prehistory", "신석기", ["정착 생활", "농경과 목축 시작", "간석기", "빗살무늬 토기", "가락바퀴·뼈바늘"]),
          flow("prehistory", "청동기", ["계급 발생", "군장 등장", "비파형 동검", "고인돌", "민무늬 토기"]),
          flow("prehistory", "철기", ["철제 농기구", "세형 동검", "잔무늬 거울", "명도전·반량전"])
        ]
      }
    }),
    era({
      id: "start",
      nav: "고조선",
      title: "고조선",
      date: "청동기 문화 속 성립 ~ BCE 108",
      width: 650,
      color: COLORS.prehistory,
      labels: ["고조선", "—", "—"],
    connect: { main: true, branch: false, south: false },
      lanes: {
        main: [
          flow("prehistory", "단군 조선", ["청동기 문화", "단군왕검", "제정일치"]),
          flow("prehistory", "위만 조선", ["철기 본격 수용", "중계 무역", "8조법"]),
          marker("prehistory", "고조선 멸망", "BCE 108", { notes: ["한 무제의 침략", "한 군현 설치"] })
        ]
      }
    }),
    era({
      id: "early-states",
      nav: "초기 국가",
      title: "철기·초기 국가",
      date: "BCE 1세기 전후",
      width: 820,
      color: COLORS.goguryeo,
      labels: ["부여·초기 고구려", "삼한", "옥저·동예"],
      connect: { main: false, branch: false, south: false },
      lanes: {
        main: [
          flow("goguryeo", "부여", ["사출도", "영고", "1책 12법"], { isolated: true }),
          flow("goguryeo", "초기 고구려", ["5부족 연맹", "제가 회의", "동맹"], { isolated: true })
        ],
        branch: [
          flow("silla", "삼한", ["마한", "진한", "변한", "소도와 천군"], { isolated: true })
        ],
        south: [
          flow("baekje", "옥저", ["민며느리제", "골장제"], { isolated: true }),
          flow("baekje", "동예", ["무천", "책화"], { isolated: true })
        ]
      }
    }),
    era({
      id: "three",
      nav: "삼국",
      title: "시조~3세기",
      date: "BCE 57 ~ 3세기",
    width: 1420,
    color: COLORS.goguryeo,
    labels: ["고구려", "신라", "백제"],
    laneOffsets: { branch: 0, main: 40, south: 80 },
    lanes: {
        main: [
          ruler("goguryeo", "동명성왕", { important: true, date: "BCE 37", notes: ["고구려 건국"] }),
          ...minor("goguryeo", ["유리명왕", "대무신왕", "민중왕", "모본왕"]),
          ruler("goguryeo", "태조왕", { important: true, notes: ["국가 체제 성장", "옥저 정복", "계루부 고씨 왕위 세습"] }),
          ...minor("goguryeo", ["차대왕", "신대왕"]),
          ruler("goguryeo", "고국천왕", { important: true, notes: ["부자 상속", "진대법"] }),
          ...minor("goguryeo", ["산상왕", "동천왕", "중천왕", "서천왕", "봉상왕"])
        ],
        branch: [
          ruler("silla", "혁거세거서간", { important: true, date: "BCE 57", notes: ["신라 건국"] }),
          ...minor("silla", ["남해차차웅", "유리이사금", "탈해이사금", "파사이사금", "지마이사금", "일성이사금", "아달라이사금", "벌휴이사금", "내해이사금", "조분이사금", "첨해이사금", "미추이사금", "유례이사금"])
        ],
        south: [
          ruler("baekje", "온조왕", { important: true, date: "BCE 18", notes: ["백제 건국"] }),
          ...minor("baekje", ["다루왕", "기루왕", "개루왕", "초고왕", "구수왕", "사반왕"]),
          ruler("baekje", "고이왕", { important: true, notes: ["6좌평", "16관등", "관복 제정", "통치 체제 정비"] }),
          ...minor("baekje", ["책계왕", "분서왕"])
        ]
      }
    }),
    era({
      title: "4세기",
      date: "백제 전성기",
    width: 820,
    color: COLORS.baekje,
    laneOffsets: { branch: 596 },
    lanes: {
        main: [
          ruler("goguryeo", "미천왕", { important: true, notes: ["낙랑군 축출"] }),
          ruler("goguryeo", "고국원왕", { important: true, notes: ["371 평양성 전투 전사"] }),
          ruler("goguryeo", "소수림왕", { important: true, notes: ["불교 수용", "태학 설립", "율령 반포"] }),
          ruler("goguryeo", "고국양왕"),
          ruler("goguryeo", "광개토대왕", { important: true, date: "391~413", notes: ["영락", "요동 진출", "신라 구원"] })
        ],
        branch: [
          ...minor("silla", ["기림이사금", "흘해이사금"]),
          ruler("silla", "내물마립간", { important: true, notes: ["김씨 왕위 세습", "마립간 칭호", "고구려 원조"] })
        ],
        south: [
          ...minor("baekje", ["비류왕", "계왕"]),
          ruler("baekje", "근초고왕", { important: true, notes: ["마한 통합", "371 평양성 공격", "고흥 『서기』", "해상 교류"] }),
          ruler("baekje", "근구수왕"),
          ruler("baekje", "침류왕", { important: true, notes: ["불교 수용"] }),
          ...minor("baekje", ["진사왕", "아신왕"])
        ]
      }
    }),
    era({
      title: "5세기",
      date: "고구려 전성기",
      width: 1040,
      color: COLORS.goguryeo,
      lanes: {
        main: [
          ruler("goguryeo", "장수왕", { important: true, date: "413~491", notes: ["평양 천도", "남진 정책", "475 한성 함락", "충주 고구려비"] }),
          ruler("goguryeo", "문자명왕")
        ],
        branch: [
          ...minor("silla", ["실성마립간"]),
          ruler("silla", "눌지마립간", { important: true, notes: ["나제 동맹", "고구려 간섭에서 이탈"] }),
          ruler("silla", "자비마립간"),
          ruler("silla", "소지마립간", { important: true, notes: ["우역 설치"] })
        ],
        south: [
          ...minor("baekje", ["전지왕", "구이신왕", "비유왕"]),
          ruler("baekje", "개로왕", { important: true, notes: ["475 한성 함락"] }),
          ruler("baekje", "문주왕", { important: true, notes: ["웅진 천도"] }),
          ruler("baekje", "삼근왕"),
          ruler("baekje", "동성왕", { important: true, notes: ["신라와 혼인 동맹"] })
        ]
      }
    }),
    era({
      title: "6세기",
      date: "신라 전성기",
      width: 1100,
      color: COLORS.silla,
      lanes: {
        main: [
          ...minor("goguryeo", ["안장왕", "안원왕", "양원왕", "평원왕"]),
          ruler("goguryeo", "영양왕", { important: true, notes: ["수의 침입 격퇴", "살수 대첩"] })
        ],
        branch: [
          ruler("silla", "지증왕", { important: true, notes: ["국호 신라", "왕호 사용", "우산국 복속"] }),
          ruler("silla", "법흥왕", { important: true, notes: ["율령 반포", "불교 공인", "병부", "상대등", "금관가야 병합"] }),
          ruler("silla", "진흥왕", { important: true, notes: ["한강 장악", "화랑도", "순수비", "대가야 병합"] }),
          ruler("silla", "진지왕"),
          ruler("silla", "진평왕")
        ],
        south: [
          ruler("baekje", "무령왕", { important: true, notes: ["22담로", "지방 통제"] }),
          ruler("baekje", "성왕", { important: true, notes: ["사비 천도", "남부여", "5부 5방", "관산성 전사"] }),
          ...minor("baekje", ["위덕왕", "혜왕", "법왕"]),
          ruler("baekje", "무왕", { important: true, notes: ["익산 미륵사"] })
        ]
      }
    }),
    era({
      title: "7세기",
      date: "통일 전쟁",
      width: 980,
      color: COLORS.silla,
      connect: { main: true, branch: true, south: true },
      breakAfter: { main: true, south: true },
      transitionAfter: { main: true, south: true },
      lanes: {
        main: [
          ruler("goguryeo", "영류왕"),
          ruler("goguryeo", "보장왕", { important: true, notes: ["안시성 전투", "연개소문"] }),
          marker("goguryeo", "고구려 멸망", "668", { notes: ["안동도호부"] })
        ],
        branch: [
          ruler("silla", "선덕여왕", { important: true, notes: ["첨성대", "황룡사 9층 목탑"] }),
          ruler("silla", "진덕여왕"),
          ruler("silla", "태종무열왕", { important: true, date: "654~661", notes: ["나당 연합", "백제 멸망", "황산벌"] }),
          ruler("silla", "문무왕", { important: true, date: "661~681", notes: ["고구려 멸망", "나당 전쟁", "매소성", "기벌포"] })
        ],
        south: [
          ruler("baekje", "의자왕", { important: true, notes: ["황산벌", "백제 멸망"] }),
          marker("baekje", "백제 멸망", "660", { notes: ["웅진도독부"] }),
          marker("baekje", "백제 부흥 운동", "660~663", { notes: ["복신·도침·부여풍", "백강 전투"] })
        ]
      }
    }),
    era({
      id: "north",
      nav: "남북국",
      title: "남북국",
      date: "676 ~ 926",
      width: 2100,
      color: COLORS.balhae,
      labels: ["발해", "통일 신라", "—"],
    connect: { main: true, branch: true, south: false },
      breakAfter: { main: true },
      transitionBefore: { main: true },
      transitionAfter: { main: true },
      lanes: {
        main: [
          ruler("balhae", "고왕", { important: true, date: "698", notes: ["발해 건국", "동모산", "천통"] }),
          ruler("balhae", "무왕", { important: true, notes: ["장문휴의 등주 공격", "인안"] }),
          ruler("balhae", "문왕", { important: true, notes: ["3성 6부", "상경 천도", "대흥"] }),
          ...minor("balhae", ["폐왕", "성왕", "강왕", "정왕", "희왕", "간왕"]),
          ruler("balhae", "선왕", { important: true, notes: ["해동성국", "5경 15부 62주"] }),
          ...minor("balhae", ["대이진", "대건황", "대현석", "대위해", "대인선"]),
          marker("balhae", "발해 멸망", "926")
        ],
        branch: [
          ruler("silla", "신문왕", { important: true, notes: ["관료전", "국학", "9주 5소경", "9서당 10정"] }),
          ...minor("silla", ["효소왕"]),
          ruler("silla", "성덕왕", { important: true, notes: ["정전 지급"] }),
          ...minor("silla", ["효성왕"]),
          ruler("silla", "경덕왕", { important: true, notes: ["불국사", "석굴암", "녹읍 부활"] }),
          ...minor("silla", ["혜공왕", "선덕왕"]),
          ruler("silla", "원성왕", { important: true, notes: ["독서삼품과"] }),
          ...minor("silla", ["소성왕", "애장왕", "헌덕왕", "흥덕왕", "희강왕", "민애왕", "신무왕", "문성왕", "헌안왕", "경문왕", "헌강왕", "정강왕"]),
          ruler("silla", "진성여왕", { important: true, notes: ["원종·애노의 난", "호족 성장", "선종", "풍수지리"] })
        ]
      }
    }),
    era({
      id: "later-three",
      title: "후삼국",
      date: "900 ~ 936",
      width: 980,
      color: COLORS.goryeo,
      labels: ["후고구려 → 고려", "신라", "후백제"],
    connect: { main: true, branch: true, south: false },
      transitionBefore: { main: true, south: true },
      lanes: {
        main: [
          ruler("goryeo", "궁예", { important: true, date: "901", notes: ["후고구려 건국", "마진", "태봉"] }),
          ruler("goryeo", "태조 왕건", { important: true, date: "918~943", notes: ["고려 건국", "후삼국 통일", "북진 정책", "사심관", "기인", "훈요 10조"] })
        ],
        branch: [
          ...minor("silla", ["효공왕", "신덕왕", "경명왕", "경애왕"]),
          ruler("silla", "경순왕", { important: true, date: "927~935", notes: ["고려에 귀부"] }),
          marker("silla", "신라 멸망", "935")
        ],
        south: [
          ruler("baekje", "견훤", { important: true, date: "900", notes: ["후백제 건국", "완산주"] }),
          ruler("baekje", "신검"),
          marker("baekje", "후백제 멸망", "936")
        ]
      }
    }),
    era({
      id: "goryeo",
      nav: "고려",
      title: "고려 전기",
      date: "943 ~ 1170",
      width: 2440,
      color: COLORS.goryeo,
      labels: ["고려", "대외·전쟁", "사회·문화"],
      lanes: {
        main: [
          ruler("goryeo", "혜종"),
          ruler("goryeo", "정종", { id: "goryeo-jeongjong-3" }),
          ruler("goryeo", "광종", { important: true, notes: ["노비안검법", "과거제", "공복 제정"] }),
          ...minor("goryeo", ["경종"]),
          ruler("goryeo", "성종", { important: true, notes: ["시무 28조", "12목", "유교 정치"] }),
          ...minor("goryeo", ["목종"]),
          ruler("goryeo", "현종", { important: true, notes: ["거란 침입 격퇴", "귀주 대첩", "초조대장경"] }),
          ruler("goryeo", "덕종"),
          ruler("goryeo", "정종", { id: "goryeo-jeongjong-10" }),
          ruler("goryeo", "문종", { important: true, notes: ["문벌 귀족 전성기", "경정 전시과"] }),
          ...minor("goryeo", ["순종", "선종", "헌종"]),
          ruler("goryeo", "숙종", { important: true, notes: ["별무반", "해동통보"] }),
          ruler("goryeo", "예종", { important: true, notes: ["여진 정벌", "동북 9성", "국학 7재"] }),
          ruler("goryeo", "인종", { important: true, notes: ["이자겸의 난", "묘청의 서경 천도 운동"] }),
          ruler("goryeo", "의종", { important: true, notes: ["무신 정변"] })
        ]
      }
    }),
    era({
      title: "무신 정권·몽골",
      date: "1170 ~ 1270",
      width: 1180,
      color: COLORS.goryeo,
      labels: ["고려", "대외·전쟁", "사회·문화"],
      lanes: {
        main: [
          ruler("goryeo", "명종", { important: true, notes: ["망이·망소이", "김사미·효심"] }),
          ruler("goryeo", "신종", { important: true, notes: ["만적의 난"] }),
          ruler("goryeo", "희종", { important: true, notes: ["최충헌: 교정도감", "최씨 무신 정권"] }),
          ...minor("goryeo", ["강종"]),
          ruler("goryeo", "고종", { important: true, notes: ["최우: 정방·서방", "대몽 항쟁", "강화 천도", "처인성", "팔만대장경"] }),
          ruler("goryeo", "원종", { important: true, notes: ["삼별초 항쟁", "강화 → 진도 → 제주"] })
        ]
      }
    }),
    era({
      title: "원 간섭·고려 말",
      date: "1270 ~ 1392",
      width: 1250,
      color: COLORS.goryeo,
      labels: ["고려", "대외·전쟁", "사회·문화"],
      lanes: {
        main: [
          ruler("goryeo", "충렬왕", { important: true, notes: ["원 간섭기", "정동행성", "권문세족", "공녀"] }),
          ...minor("goryeo", ["충선왕", "충숙왕", "충혜왕", "충목왕", "충정왕"]),
          ruler("goryeo", "공민왕", { important: true, notes: ["반원 자주 개혁", "쌍성총관부 수복", "전민변정도감"] }),
          ruler("goryeo", "우왕", { important: true, notes: ["위화도 회군"] }),
          ruler("goryeo", "창왕"),
          ruler("goryeo", "공양왕", { important: true, notes: ["과전법", "조선 건국 직전"] }),
          marker("goryeo", "고려 멸망", "1392")
        ]
      }
    }),
    era({
      id: "joseon",
      nav: "조선",
      title: "조선 전기",
      date: "1392 ~ 1494",
      width: 1400,
      color: COLORS.joseon,
      labels: ["조선", "제도·전쟁", "사회·문화"],
      lanes: {
        main: [
          ruler("joseon", "태조", { important: true, notes: ["조선 건국", "한양 천도", "경복궁"] }),
          ruler("joseon", "정종"),
          ruler("joseon", "태종", { important: true, notes: ["6조 직계제", "호패법", "사병 혁파"] }),
          ruler("joseon", "세종", { important: true, notes: ["의정부 서사제", "공법", "훈민정음", "4군 6진"] }),
          ...minor("joseon", ["문종", "단종"]),
          ruler("joseon", "세조", { important: true, notes: ["6조 직계제", "직전법", "집현전 폐지"] }),
          ...minor("joseon", ["예종"]),
          ruler("joseon", "성종", { important: true, notes: ["경국대전", "홍문관", "사림 등용"] })
        ]
      }
    }),
    era({
      title: "사림·붕당·양란",
      date: "1494 ~ 1659",
      width: 1440,
      color: COLORS.joseon,
      labels: ["조선", "제도·전쟁", "사회·문화"],
      lanes: {
        main: [
          ruler("joseon", "연산군", { important: true, notes: ["무오사화", "갑자사화"] }),
          ruler("joseon", "중종", { important: true, notes: ["기묘사화", "조광조의 개혁"] }),
          ...minor("joseon", ["인종"]),
          ruler("joseon", "명종", { important: true, notes: ["을사사화", "비변사 상설", "임꺽정의 난"] }),
          ruler("joseon", "선조", { important: true, notes: ["동인·서인", "임진왜란", "비변사 기능 강화", "훈련도감"] }),
          ruler("joseon", "광해군", { important: true, notes: ["중립 외교", "대동법", "인조반정"] }),
          ruler("joseon", "인조", { important: true, notes: ["정묘호란", "병자호란", "친명배금"] }),
          ruler("joseon", "효종", { important: true, notes: ["북벌 정책", "나선 정벌"] })
        ]
      }
    }),
    era({
      title: "붕당·탕평·세도",
      date: "1659 ~ 1863",
      width: 1350,
      color: COLORS.joseon,
      labels: ["조선", "제도·전쟁", "사회·문화"],
      lanes: {
        main: [
          ruler("joseon", "현종", { important: true, notes: ["예송 논쟁"] }),
          ruler("joseon", "숙종", { important: true, notes: ["환국", "대동법 확대", "상평통보"] }),
          ruler("joseon", "경종"),
          ruler("joseon", "영조", { important: true, notes: ["탕평", "균역법", "속대전"] }),
          ruler("joseon", "정조", { important: true, notes: ["규장각", "장용영", "신해통공", "수원 화성"] }),
          ruler("joseon", "순조", { important: true, notes: ["세도 정치", "홍경래의 난"] }),
          ruler("joseon", "헌종"),
          ruler("joseon", "철종", { important: true, notes: ["임술 농민 봉기", "삼정이정청"] })
        ]
      }
    }),
    era({
      id: "modern",
      nav: "개항·근현대",
      title: "개항·대한제국",
      date: "1863 ~ 1910",
      width: 1380,
      color: COLORS.modern,
      scale: { start: 1863, end: 1910 },
      labels: ["조선 → 대한제국", "개항·개혁", "항일 운동"],
      connect: { main: true, branch: false, south: false },
      lanes: {
        main: [
          ruler("joseon", "고종", { important: true, date: "1863~1907", notes: ["흥선 대원군", "강화도 조약", "임오군란", "갑신정변", "동학 농민 운동", "대한제국"] }),
          ruler("joseon", "순종", { important: true, date: "1907~1910", notes: ["한일 병합 조약"] }),
          marker("joseon", "국권 피탈", "1910")
        ],
        branch: [
          flow("modern", "개화 정책 추진", ["통리기무아문", "별기군", "영선사", "조사 시찰단"], { date: "1880년대" }),
          flow("modern", "갑신정변", ["급진 개화파", "14개조 개혁 정강"], { date: "1884" }),
          flow("modern", "갑오·을미개혁", ["군국기무처", "홍범 14조", "단발령"], { date: "1894~1896" })
        ],
        south: [
          flow("modern", "위정척사 운동", ["이항로", "최익현", "영남 만인소"], { date: "1880년대" }),
          flow("modern", "을미의병", ["을미사변", "단발령"], { date: "1895" }),
          flow("modern", "을사의병", ["을사늑약 반대"], { date: "1905" }),
          flow("modern", "정미의병", ["군대 해산", "13도 창의군"], { date: "1907" }),
          flow("modern", "애국 계몽 운동", ["보안회", "대한자강회", "신민회", "국채 보상 운동"], { date: "1905~1910" })
        ]
      }
    }),
    era({
      title: "일제 강점기",
      date: "1910 ~ 1945",
      width: 1380,
      color: COLORS.modern,
      scale: { start: 1910, end: 1945 },
      labels: ["식민 통치", "국내 민족 운동", "국외·무장 투쟁"],
      connect: { main: true, branch: false, south: false },
      lanes: {
        main: [
          flow("modern", "무단 통치", ["조선 총독부", "헌병 경찰", "태형령", "토지 조사 사업", "회사령"], { date: "1910년대" }),
          flow("modern", "문화 통치", ["보통 경찰제", "치안 유지법", "산미 증식 계획"], { date: "1920년대" }),
          flow("modern", "민족 말살 통치", ["황국 신민화", "창씨개명", "국가 총동원법", "징병·징용"], { date: "1930~40년대" })
        ],
        branch: [
          flow("modern", "3·1 운동 → 대한민국 임시정부", ["민족 대표 33인", "한성 정부", "상하이 통합"], { date: "1919" }),
          flow("modern", "실력 양성 운동", ["물산 장려", "민립 대학 설립", "문맹 퇴치"], { date: "1920년대" }),
          flow("modern", "신간회·근우회", ["민족 유일당 운동", "광주 학생 항일 운동 지원"], { date: "1927" }),
          flow("modern", "광주 학생 항일 운동", ["학생 중심", "전국 확산"], { date: "1929" }),
          flow("modern", "조선어 학회 사건", ["한글 연구", "민족 문화 수호"], { date: "1942" })
        ],
        south: [
          flow("modern", "봉오동 → 청산리", ["홍범도", "김좌진", "간도 참변"], { date: "1920" }),
          flow("modern", "자유시 참변", ["독립군 세력의 시련"], { date: "1921" }),
          flow("modern", "3부와 통합 운동", ["참의부", "정의부", "신민부", "국민부", "혁신의회"], { date: "1920년대" }),
          flow("modern", "의열단·한인 애국단", ["의열단: 김원봉", "한인 애국단: 이봉창·윤봉길"], { date: "1919·1931" }),
          flow("modern", "한국 광복군", ["지청천", "대일 선전 포고", "국내 진공 작전"], { date: "1940" })
        ]
      }
    }),
    era({
      title: "대한민국",
      date: "1945 ~ 2008",
      width: 2480,
      color: COLORS.modern,
      scale: { start: 1945, end: 2008 },
      labels: ["정부·대통령", "민주화 운동", "남북 관계"],
      connect: { main: false, branch: false, south: false },
      lanes: {
        main: [
          ruler("modern", "광복·군정", { important: true, date: "1945~1948", notes: ["38도선", "미소 군정", "5·10 총선거"] }),
          ruler("modern", "이승만", { important: true, date: "1948~1960", notes: ["정부 수립", "제헌 헌법", "6·25 전쟁", "발췌 개헌", "사사오입 개헌"] }),
          ruler("modern", "윤보선·장면", { important: true, date: "1960~1961", notes: ["제2공화국", "내각 책임제"] }),
          ruler("modern", "박정희", { important: true, date: "1963~1979", notes: ["경제 개발 5개년 계획", "한일 협정", "3선 개헌", "7·4 남북 공동 성명", "유신 헌법"] }),
          ruler("modern", "최규하", { important: true, date: "1979~1980", notes: ["10·26 사태", "12·12 군사 반란"] }),
          ruler("modern", "전두환", { important: true, date: "1980~1988", notes: ["5·18 민주화 운동", "언론 통폐합", "6월 민주 항쟁", "6·29 선언(노태우 발표)"] }),
          ruler("modern", "노태우", { important: true, date: "1988~1993", notes: ["북방 외교", "남북 유엔 동시 가입", "남북 기본 합의서"] }),
          ruler("modern", "김영삼", { important: true, date: "1993~1998", notes: ["금융 실명제", "지방 자치 전면 실시", "민주노총 창립"] }),
          ruler("modern", "김대중", { important: true, date: "1998~2003", notes: ["국민기초생활보장법", "노사정위원회", "국가인권위원회", "개성 공업 지구 합의", "한·칠레 FTA 서명"] }),
          ruler("modern", "노무현", { important: true, date: "2003~2008", notes: ["한·칠레 FTA 비준·발효", "호주제 폐지", "친일반민족행위진상규명위원회", "개성 공업 지구"] })
        ],
        branch: [
          flow("modern", "4·19 혁명", ["3·15 부정 선거", "이승만 하야", "제2공화국"], { date: "1960" }),
          flow("modern", "부마 민주 항쟁", ["유신 체제 붕괴의 배경"], { date: "1979" }),
          flow("modern", "5·18 민주화 운동", ["신군부 저항", "광주 시민"], { date: "1980" }),
          flow("modern", "6월 민주 항쟁", ["4·13 호헌 조치", "6·29 선언", "대통령 직선제"], { date: "1987" })
        ],
        south: [
          flow("modern", "7·4 남북 공동 성명", ["자주", "평화", "민족 대단결"], { date: "1972" }),
          flow("modern", "남북 이산가족 상봉", ["서울·평양 교환 방문"], { date: "1985" }),
          flow("modern", "남북 유엔 동시 가입", ["남북 기본 합의서", "한반도 비핵화 공동 선언"], { date: "1991" }),
          flow("modern", "6·15 남북 공동 선언", ["첫 남북 정상 회담"], { date: "2000" }),
          flow("modern", "10·4 남북 공동 선언", ["남북 관계 발전", "평화 번영"], { date: "2007" })
        ]
      }
    })
  ];

  window.TIMELINE_DATA = { LANES, ROW_Y, COLORS, COLUMNS };
})();
