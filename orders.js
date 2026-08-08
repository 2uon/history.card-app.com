const ORDER_SETS = [
  {
    id: "ancient-prehistory-flow",
    title: "선사 시대",
    era: "고대",
    priority: "S",
    items: ["구석기 시대", "신석기 시대", "청동기 시대", "철기 시대"],
    explanation: "도구와 생활 모습의 변화를 시대 순서로 묶는다.",
    source: "한능검.md"
  },
  {
    id: "ancient-silla-kings-flow",
    title: "신라 주요 왕",
    era: "고대",
    priority: "S",
    items: ["지증왕", "법흥왕", "진흥왕", "선덕 여왕", "문무왕"],
    explanation: "신라의 체제 정비부터 삼국 통일까지의 주요 왕 순서이다.",
    source: "한능검.md"
  },
  {
    id: "ancient-balhae-kings-flow",
    title: "발해 주요 왕",
    era: "고대",
    priority: "A",
    items: ["발해 무왕", "발해 문왕", "발해 선왕"],
    explanation: "대외 팽창, 체제 정비, 전성기로 이어지는 발해 왕 순서이다.",
    source: "한능검.md"
  },
  {
    id: "goryeo-kings-flow",
    title: "고려 전기 주요 왕",
    era: "고려",
    priority: "S",
    items: ["태조 왕건", "광종", "성종", "숙종", "예종"],
    explanation: "건국과 왕권 강화, 유교 통치 체제, 여진 정벌의 흐름이다.",
    source: "한능검.md"
  },
  {
    id: "goryeo-invasions-flow",
    title: "고려 침입 세력",
    era: "고려",
    priority: "S",
    items: ["거란 침입", "여진의 위협", "몽골 침입"],
    explanation: "고려의 주요 북방 침입 세력을 시대 순으로 배열한다.",
    source: "한능검.md"
  },
  {
    id: "goryeo-mongol-resistance-flow",
    title: "고려 대몽 항쟁",
    era: "고려",
    priority: "S",
    items: ["1차 충주성 방어", "2차 처인성 항전·살리타 사살", "5차 충주산성 김윤후 항전", "삼별초 진도 용장성 항전"],
    explanation: "몽골 침입 초기의 성곽 항전부터 삼별초 항쟁까지의 순서이다.",
    source: "한능검.md"
  },
  {
    id: "goryeo-land-flow",
    title: "고려 토지 제도",
    era: "고려",
    priority: "A",
    items: ["역분전", "시정 전시과", "개정 전시과", "경정 전시과"],
    explanation: "공로 기준 지급에서 현직 관리 중심 전시과 완성까지의 흐름이다.",
    source: "한능검.md"
  },
  {
    id: "joseon-war-flow",
    title: "인조 전후 전쟁·정변",
    era: "조선",
    priority: "S",
    items: ["인조반정", "이괄의 난", "정묘호란", "병자호란"],
    explanation: "인조 즉위 뒤 국내 반란과 두 차례 호란이 이어진 순서이다.",
    source: "한능검.md"
  },
  {
    id: "joseon-land-flow",
    title: "조선 토지 제도",
    era: "조선",
    priority: "S",
    items: ["과전법", "직전법·수신전·휼양전 폐지", "관수관급제", "직전법 폐지"],
    explanation: "관리 토지 수조권이 축소되고 사라지는 흐름이다.",
    source: "한능검.md"
  },
  {
    id: "joseon-tax-flow",
    title: "조선 수취 제도",
    era: "조선",
    priority: "S",
    items: ["공법", "대동법 경기도 실시", "영정법", "균역법"],
    explanation: "전세·공납·전세·군역 개혁을 시행 시기 순서로 배열한다.",
    source: "한능검.md"
  },
  {
    id: "joseon-catholic-rebellion-flow",
    title: "천주교 박해와 민란",
    era: "조선",
    priority: "A",
    items: ["신해박해", "신유박해·황사영 백서", "홍경래의 난"],
    explanation: "정조 말부터 순조 시기의 박해와 민란 순서이다.",
    source: "한능검.md"
  },
  {
    id: "opening-major-events-flow",
    title: "개항 이후 주요 사건",
    era: "개항기",
    priority: "S",
    items: ["강화도 조약", "임오군란", "갑신정변", "동학 농민 운동", "1차 갑오개혁", "을미개혁"],
    explanation: "개항부터 개혁과 항일 의병 확산으로 이어지는 핵심 사건 순서이다.",
    source: "한능검.md"
  },
  {
    id: "opening-gabo-flow",
    title: "갑오·을미개혁",
    era: "개항기",
    priority: "S",
    items: ["1차 갑오개혁", "2차 갑오개혁", "을미개혁"],
    explanation: "군국기무처 개혁에서 홍범 14조, 단발령으로 이어지는 순서이다.",
    source: "한능검.md"
  },
  {
    id: "opening-russia-japan-flow",
    title: "러시아 이권 침탈과 러일 전쟁",
    era: "개항기",
    priority: "A",
    items: ["절영도 조차 요구", "독립협회의 반대", "용암포 점령·조차 요구", "러일 전쟁", "한일 의정서"],
    explanation: "러시아의 이권 요구와 일본의 침략 확대가 연결되는 흐름이다.",
    source: "한능검.md"
  },
  {
    id: "japanese-labor-flow",
    title: "일제 강점기 노동·농민 운동",
    era: "일제강점기",
    priority: "A",
    items: ["암태도 소작 쟁의", "조선 노농 총동맹", "조선 노동 총동맹·조선 농민 총동맹", "원산 총파업", "강주룡 을밀대 고공 농성"],
    explanation: "1920년대 전반부터 1931년까지 노동·농민 운동의 흐름이다.",
    source: "한능검.md"
  },
  {
    id: "modern-democracy-flow",
    title: "민주화 운동",
    era: "현대사",
    priority: "S",
    items: ["4·19 혁명", "5·18 민주화 운동", "6월 민주 항쟁", "6·29 민주화 선언"],
    explanation: "시민 혁명과 민주화 운동이 대통령 직선제 개헌으로 이어진 흐름이다.",
    source: "한능검.md"
  },
  {
    id: "modern-chile-fta-flow",
    title: "한·칠레 자유 무역 협정",
    era: "현대사",
    priority: "A",
    items: ["김대중 정부 때 FTA 서명", "노무현 정부 때 국회 비준", "한·칠레 FTA 발효"],
    explanation: "서명 뒤 국회 비준을 거쳐 협정이 발효되었다.",
    source: "한능검.md"
  }
];
