const CLASSIFICATION_SETS = [
  {
    id: "classify-early-polities",
    title: "초기 국가 판별",
    era: "고대",
    priority: "S",
    prompt: "두 단서가 함께 가리키는 나라를 고르세요.",
    labels: ["부여", "고구려", "옥저", "동예", "삼한"],
    cards: [
      { id: "buyeo-yeonggo", term: "12월에 영고를 열었다", clue: "왕 아래 마가·우가·저가·구가가 각각 사출도를 다스렸다.", answer: "부여", priority: "S", note: "부여는 12월 영고와 사출도로 구별한다." },
      { id: "buyeo-law", term: "형이 죽으면 형수를 아내로 맞았다", clue: "흉년이 들면 왕에게 책임을 묻기도 하였다.", answer: "부여", priority: "A", note: "형사취수제와 왕의 책임을 묻는 풍습은 부여의 단서이다." },
      { id: "goguryeo-dongmaeng", term: "10월에 동맹을 열었다", clue: "제가 회의에서 국가의 중요한 일을 결정하였다.", answer: "고구려", priority: "S", note: "고구려는 10월 동맹과 제가 회의로 판별한다." },
      { id: "goguryeo-seook", term: "혼인 뒤 신랑이 처가에서 생활하였다", clue: "큰 집마다 부경이라는 창고를 두었다.", answer: "고구려", priority: "A", note: "서옥제와 부경은 고구려의 대표 생활상이다." },
      { id: "okjeo-minmyeoneuri", term: "어린 며느리를 데려와 길렀다", clue: "왕이 없고 읍군·삼로라는 군장이 다스렸다.", answer: "옥저", priority: "S", note: "민며느리제는 옥저를 찾는 가장 강한 단서이다." },
      { id: "okjeo-goljang", term: "가족의 뼈를 추려 공동 무덤에 안치하였다", clue: "고구려에 소금과 해산물 등의 특산물을 바쳤다.", answer: "옥저", priority: "A", note: "골장제와 해산물 공납은 옥저의 단서이다." },
      { id: "dongye-mucheon", term: "10월에 무천을 열었다", clue: "다른 읍락의 경계를 침범하면 배상하게 하였다.", answer: "동예", priority: "S", note: "동예는 10월 무천과 책화로 판별한다." },
      { id: "dongye-specialties", term: "단궁·과하마·반어피가 유명하였다", clue: "같은 씨족끼리는 혼인하지 않는 풍습이 있었다.", answer: "동예", priority: "A", note: "특산물과 족외혼은 동예의 대표 단서이다." },
      { id: "samhan-sodo", term: "천군이 소도에서 제사를 주관하였다", clue: "정치 지배자와 제사장이 구분되어 있었다.", answer: "삼한", priority: "S", note: "천군과 소도는 삼한의 제정 분리를 보여 준다." },
      { id: "samhan-chief", term: "신지·읍차 등의 군장이 다스렸다", clue: "여러 소국이 연맹을 이루고 철을 화폐처럼 사용하였다.", answer: "삼한", priority: "A", note: "신지·읍차와 철의 화폐 사용은 삼한의 단서이다." }
    ]
  },
  {
    id: "classify-silla-kings",
    title: "신라 왕 업적 판별",
    era: "고대",
    priority: "S",
    prompt: "업적의 주인공을 고르세요.",
    labels: ["지증왕", "법흥왕", "진흥왕", "선덕 여왕"],
    cards: [
      { id: "jijeung-ugyeong", term: "우경을 장려하였다", clue: "국호를 신라로 정하고 왕이라는 칭호를 사용하였다.", answer: "지증왕", priority: "S", note: "우경 장려와 국호 신라 확정은 지증왕의 업적이다." },
      { id: "jijeung-dongsijeon", term: "시장 감독 기구인 동시전을 설치하였다", clue: "이사부를 보내 우산국을 복속하였다.", answer: "지증왕", priority: "S", note: "동시전 설치와 우산국 복속은 지증왕 때의 일이다." },
      { id: "beopheung-geonwon", term: "독자적 연호 건원을 사용하였다", clue: "이차돈의 순교를 계기로 불교를 공인하였다.", answer: "법흥왕", priority: "S", note: "건원과 불교 공인은 법흥왕의 핵심 업적이다." },
      { id: "beopheung-byeongbu", term: "군사 업무를 맡는 병부를 설치하였다", clue: "귀족 회의의 대표인 상대등을 두었다.", answer: "법흥왕", priority: "S", note: "병부와 상대등 설치는 법흥왕의 체제 정비이다." },
      { id: "jinheung-hwarang", term: "화랑도를 국가 조직으로 개편하였다", clue: "거칠부에게 역사서 국사를 편찬하게 하였다.", answer: "진흥왕", priority: "S", note: "화랑도 개편과 국사 편찬은 진흥왕의 업적이다." },
      { id: "jinheung-monument", term: "정복 지역에 순수비를 세웠다", clue: "한강 유역을 확보하고 대가야를 정복하였다.", answer: "진흥왕", priority: "S", note: "순수비와 한강 유역 확보는 진흥왕을 가리킨다." },
      { id: "seondeok-pagoda", term: "황룡사 9층 목탑을 세웠다", clue: "자장의 건의를 받아 주변 아홉 나라를 제압한다는 뜻을 담았다.", answer: "선덕 여왕", priority: "S", note: "황룡사 9층 목탑은 선덕 여왕 때 건립되었다." },
      { id: "seondeok-cheomseongdae", term: "첨성대를 건립하였다", clue: "신라 최초의 여왕으로 재위하였다.", answer: "선덕 여왕", priority: "A", note: "첨성대는 선덕 여왕 시기의 대표 문화유산이다." }
    ]
  },
  {
    id: "classify-balhae-kings",
    title: "발해 왕 업적 판별",
    era: "고대",
    priority: "S",
    prompt: "설명에 해당하는 발해 왕을 고르세요.",
    labels: ["무왕", "문왕", "선왕"],
    cards: [
      { id: "muwang-jangmunhyu", term: "장문휴가 당의 등주를 공격하였다", clue: "당과 대립하며 돌궐·일본과 친선 관계를 맺었다.", answer: "무왕", priority: "S", note: "장문휴의 등주 공격은 발해 무왕 때이다." },
      { id: "muwang-inan", term: "연호 인안을 사용하였다", clue: "대외 팽창을 추진해 영토를 넓혔다.", answer: "무왕", priority: "A", note: "인안은 발해 무왕의 연호이다." },
      { id: "munwang-sanggyeong", term: "수도를 상경 용천부로 옮겼다", clue: "당과 친선 관계를 맺고 문물과 제도를 받아들였다.", answer: "문왕", priority: "S", note: "상경 용천부 천도는 발해 문왕의 업적이다." },
      { id: "munwang-daeheung", term: "연호 대흥을 사용하였다", clue: "중앙 관제를 3성 6부 체제로 정비하였다.", answer: "문왕", priority: "A", note: "대흥과 3성 6부 정비는 발해 문왕의 단서이다." },
      { id: "seonwang-local", term: "5경 15부 62주의 지방 제도를 완비하였다", clue: "말갈 세력 대부분을 복속하여 최대 영토를 확보하였다.", answer: "선왕", priority: "S", note: "5경 15부 62주는 발해 선왕 때 완비되었다." },
      { id: "seonwang-haedong", term: "해동성국이라 불릴 만큼 번성하였다", clue: "요동 지역까지 진출하여 전성기를 열었다.", answer: "선왕", priority: "A", note: "해동성국은 선왕 이후 전성기의 발해를 가리킨다." }
    ]
  },
  {
    id: "classify-goryeo-kings",
    title: "고려 왕 정책 판별",
    era: "고려",
    priority: "S",
    prompt: "정책을 시행한 왕을 고르세요.",
    labels: ["광종", "성종", "숙종", "예종", "인종"],
    cards: [
      { id: "gwangjong-slave", term: "노비안검법을 실시하였다", clue: "불법으로 노비가 된 이를 양인으로 회복해 호족 세력을 약화하였다.", answer: "광종", priority: "S", note: "노비안검법은 광종의 왕권 강화 정책이다." },
      { id: "gwangjong-exam", term: "쌍기의 건의를 받아 과거제를 시행하였다", clue: "광덕·준풍이라는 독자적 연호를 사용하였다.", answer: "광종", priority: "S", note: "과거제 시행과 광덕·준풍은 광종의 단서이다." },
      { id: "seongjong-12mok", term: "전국 주요 지역에 12목을 설치하였다", clue: "최승로의 시무 28조를 받아들였다.", answer: "성종", priority: "S", note: "12목과 시무 28조는 성종의 유교 정치 정비이다." },
      { id: "seongjong-gun", term: "지방에 10도와 군현 체제를 정비하였다", clue: "국자감을 설치하여 유학 교육을 장려하였다.", answer: "성종", priority: "A", note: "지방 제도 정비와 국자감 설치는 성종 때이다." },
      { id: "sukjong-byeolmuban", term: "윤관의 건의로 별무반을 편성하였다", clue: "여진의 기병에 대응하기 위한 특수 부대였다.", answer: "숙종", priority: "S", note: "별무반은 고려 숙종 때 편성되었다." },
      { id: "sukjong-currency", term: "주전도감을 설치하였다", clue: "해동통보를 발행해 화폐 유통을 추진하였다.", answer: "숙종", priority: "S", note: "주전도감과 해동통보는 숙종의 경제 정책이다." },
      { id: "yejong-nine", term: "동북 9성을 쌓아 여진을 몰아냈다", clue: "윤관이 별무반을 이끌고 정벌에 나섰다.", answer: "예종", priority: "S", note: "동북 9성 축조는 예종 때의 일이다." },
      { id: "yejong-seven", term: "국학에 전문 강좌인 7재를 설치하였다", clue: "관학 진흥을 위해 양현고를 두었다.", answer: "예종", priority: "A", note: "7재와 양현고는 예종의 교육 진흥책이다." },
      { id: "injong-myo", term: "묘청이 서경 천도를 주장하였다", clue: "김부식이 이끄는 관군이 반란을 진압하였다.", answer: "인종", priority: "S", note: "묘청의 서경 천도 운동은 인종 때 일어났다." },
      { id: "injong-samguk", term: "김부식이 삼국사기를 편찬하였다", clue: "이자겸의 난으로 왕권이 크게 흔들렸다.", answer: "인종", priority: "A", note: "삼국사기 편찬과 이자겸의 난은 인종 때이다." }
    ]
  },
  {
    id: "classify-goryeo-wars",
    title: "고려 대외 항쟁 판별",
    era: "고려",
    priority: "S",
    prompt: "단서가 가리키는 침입 세력을 고르세요.",
    labels: ["거란", "여진", "몽골", "왜구"],
    cards: [
      { id: "khitan-seohui", term: "서희가 소손녕과 외교 담판을 벌였다", clue: "그 결과 강동 6주를 확보하였다.", answer: "거란", priority: "S", note: "서희의 담판과 강동 6주는 거란의 1차 침입과 연결된다." },
      { id: "khitan-gang", term: "강감찬이 귀주에서 크게 승리하였다", clue: "개경을 방어하기 위해 나성을 쌓는 계기가 되었다.", answer: "거란", priority: "S", note: "귀주 대첩은 거란의 3차 침입 때 거둔 승리이다." },
      { id: "jurchen-special", term: "신기군·신보군·항마군을 편성하였다", clue: "기병 전력이 강한 북방 세력에 대응하기 위해서였다.", answer: "여진", priority: "S", note: "별무반은 여진 정벌을 위해 조직되었다." },
      { id: "jurchen-nine", term: "윤관이 동북 지역에 9성을 쌓았다", clue: "방어가 어렵고 반환 요구가 이어져 돌려주었다.", answer: "여진", priority: "S", note: "동북 9성은 여진 정벌의 결과이다." },
      { id: "mongol-cheoin", term: "김윤후가 처인성에서 적장을 사살하였다", clue: "그 적장은 한국사 시험에서 살리타로 표기한다.", answer: "몽골", priority: "S", note: "처인성 전투에서 몽골 장수 살리타가 사살되었다." },
      { id: "mongol-island", term: "최우 정권이 수도를 강화도로 옮겼다", clue: "장기 항전을 위해 팔만대장경을 조판하였다.", answer: "몽골", priority: "S", note: "강화도 천도와 팔만대장경 조판은 몽골 침입기이다." },
      { id: "waegu-jinpo", term: "최무선이 화포로 진포에서 승리하였다", clue: "화통도감을 설치해 만든 화약 무기를 사용하였다.", answer: "왜구", priority: "S", note: "진포 대첩은 최무선이 왜구를 격퇴한 전투이다." },
      { id: "waegu-gwaneumpo", term: "정지가 관음포에서 크게 승리하였다", clue: "고려 말 해안 지역을 약탈하던 세력을 격퇴하였다.", answer: "왜구", priority: "A", note: "관음포 전투에서 정지가 왜구를 격파하였다." }
    ]
  },
  {
    id: "classify-joseon-kings",
    title: "조선 왕 정책 판별",
    era: "조선",
    priority: "S",
    prompt: "정책과 사건이 가리키는 왕을 고르세요.",
    labels: ["세조", "성종", "인조", "숙종", "정조", "철종"],
    cards: [
      { id: "sejo-jikjeon", term: "현직 관리에게만 수조권을 지급하는 직전법을 시행하였다", clue: "6조 직계제를 실시해 왕권을 강화하였다.", answer: "세조", priority: "S", note: "직전법과 6조 직계제는 세조의 정책이다." },
      { id: "sejo-wongak", term: "원각사지 10층 석탑을 조성하였다", clue: "경국대전 편찬을 시작하였다.", answer: "세조", priority: "A", note: "원각사지 10층 석탑은 세조 때 조성되었다." },
      { id: "seongjong-gwansu", term: "관수관급제를 시행하였다", clue: "경국대전을 완성하여 반포하였다.", answer: "성종", priority: "S", note: "관수관급제와 경국대전 완성은 성종 때이다." },
      { id: "seongjong-hongmun", term: "홍문관을 두어 경연을 활성화하였다", clue: "사림을 등용해 훈구 세력을 견제하였다.", answer: "성종", priority: "A", note: "홍문관과 사림 등용은 성종의 통치와 연결된다." },
      { id: "injo-yeongjeong", term: "풍흉과 관계없이 전세를 1결당 4두로 고정하였다", clue: "영정법이라 부르는 전세 제도이다.", answer: "인조", priority: "S", note: "영정법은 인조 때 실시되었다." },
      { id: "injo-war", term: "정묘호란과 병자호란을 겪었다", clue: "남한산성에서 항전한 뒤 삼전도의 굴욕을 당하였다.", answer: "인조", priority: "S", note: "두 차례 호란과 삼전도의 굴욕은 인조 때이다." },
      { id: "sukjong-coin", term: "상평통보를 전국적으로 유통하였다", clue: "금위영을 설치해 5군영 체제를 완성하였다.", answer: "숙종", priority: "S", note: "상평통보 유통과 금위영 설치는 숙종 때이다." },
      { id: "sukjong-hwanguk", term: "환국을 거듭하며 붕당 구도를 바꾸었다", clue: "백두산정계비가 세워진 시기이기도 하다.", answer: "숙종", priority: "A", note: "환국 정치와 백두산정계비는 숙종 때의 단서이다." },
      { id: "jeongjo-sinhae", term: "육의전을 제외한 시전 상인의 금난전권을 폐지하였다", clue: "이 조치를 신해통공이라 한다.", answer: "정조", priority: "S", note: "신해통공은 정조의 상업 정책이다." },
      { id: "jeongjo-gyujang", term: "규장각과 장용영을 설치하였다", clue: "수원 화성을 건설하고 초계문신제를 시행하였다.", answer: "정조", priority: "S", note: "규장각·장용영·수원 화성은 정조의 핵심 단서이다." },
      { id: "cheoljong-samjeong", term: "삼정이정청을 설치하였다", clue: "임술 농민 봉기가 전국으로 확산된 뒤 대책을 마련하였다.", answer: "철종", priority: "S", note: "삼정이정청은 철종 때 임술 농민 봉기 수습을 위해 설치되었다." },
      { id: "cheoljong-jinsan", term: "진주에서 시작된 농민 봉기가 전국으로 번졌다", clue: "삼정의 문란이 가장 큰 배경이었다.", answer: "철종", priority: "A", note: "임술 농민 봉기는 철종 때 일어났다." }
    ]
  },
  {
    id: "classify-joseon-offices",
    title: "조선 관청 기능 판별",
    era: "조선",
    priority: "S",
    prompt: "설명에 해당하는 관청을 고르세요.",
    labels: ["사간원", "사헌부", "홍문관", "승정원", "비변사"],
    cards: [
      { id: "sagan-remonstrance", term: "왕의 잘못을 지적하는 간쟁을 맡았다", clue: "관리 임명에 의견을 내는 서경권을 행사한 3사의 하나이다.", answer: "사간원", priority: "S", note: "사간원은 간쟁과 논박을 담당하였다." },
      { id: "sagan-daegan", term: "헌납과 정언이 소속되었다", clue: "사헌부와 함께 대간이라 불렸다.", answer: "사간원", priority: "A", note: "헌납·정언은 사간원의 관직이다." },
      { id: "saheon-audit", term: "관리의 비리를 감찰하고 풍속을 바로잡았다", clue: "대사헌이 이 관청의 수장이었다.", answer: "사헌부", priority: "S", note: "감찰과 대사헌은 사헌부를 가리킨다." },
      { id: "saheon-officials", term: "대사헌·집의·장령·지평이 소속되었다", clue: "3사 가운데 관리 감찰 기능이 중심이었다.", answer: "사헌부", priority: "A", note: "대사헌 이하 관직은 사헌부 소속이다." },
      { id: "hongmun-gyeongyeon", term: "왕에게 경연을 열어 유교 경전을 강론하였다", clue: "왕의 자문 기관이며 옥당이라고도 불렸다.", answer: "홍문관", priority: "S", note: "경연과 옥당은 홍문관의 결정적 단서이다." },
      { id: "hongmun-scholar", term: "학문 연구와 정책 자문을 담당하였다", clue: "성종 때 집현전을 계승하는 성격으로 설치되었다.", answer: "홍문관", priority: "A", note: "학술·자문과 경연을 맡은 관청은 홍문관이다." },
      { id: "seungjeong-secretary", term: "왕명을 받아 각 관청에 전달하였다", clue: "6승지가 업무를 나누어 맡은 왕의 비서 기관이었다.", answer: "승정원", priority: "S", note: "왕명 출납과 6승지는 승정원의 단서이다." },
      { id: "seungjeong-diary", term: "업무 기록이 승정원일기로 남아 있다", clue: "국왕과 관료 사이의 문서 전달을 담당하였다.", answer: "승정원", priority: "A", note: "승정원일기는 승정원의 업무 기록이다." },
      { id: "bibyeonsa-defense", term: "국방 문제를 논의하기 위해 임시로 설치되었다", clue: "을묘왜변 뒤 상설 기구가 되었다.", answer: "비변사", priority: "S", note: "비변사는 명종 때 을묘왜변을 계기로 상설화되었다." },
      { id: "bibyeonsa-late", term: "조선 후기에 군사뿐 아니라 국정 전반을 총괄하였다", clue: "흥선 대원군 집권기에 폐지되었다.", answer: "비변사", priority: "A", note: "후기 최고 권력 기구로 확대된 관청은 비변사이다." }
    ]
  },
  {
    id: "classify-reforms",
    title: "근대 개혁안 판별",
    era: "개항기",
    priority: "S",
    prompt: "개혁 내용을 시행한 시기를 고르세요.",
    labels: ["1차 갑오개혁", "2차 갑오개혁", "을미개혁", "광무개혁"],
    cards: [
      { id: "gabo1-finance", term: "탁지아문으로 재정을 일원화하였다", clue: "군국기무처가 개혁을 주도하였다.", answer: "1차 갑오개혁", priority: "S", note: "탁지아문과 군국기무처는 1차 갑오개혁의 단서이다." },
      { id: "gabo1-status", term: "공사 노비제를 폐지하였다", clue: "과부의 재가를 허용하고 신분제를 없앴다.", answer: "1차 갑오개혁", priority: "S", note: "신분제·공사 노비제 폐지는 1차 갑오개혁 때이다." },
      { id: "gabo2-hongbeom", term: "홍범 14조를 반포하였다", clue: "의정부를 내각으로 바꾸고 8아문을 7부로 개편하였다.", answer: "2차 갑오개혁", priority: "S", note: "홍범 14조와 7부 개편은 2차 갑오개혁의 단서이다." },
      { id: "gabo2-local", term: "전국을 23부 337군으로 개편하였다", clue: "사법권을 행정권에서 분리해 재판소를 설치하였다.", answer: "2차 갑오개혁", priority: "S", note: "23부제와 재판소 설치는 2차 갑오개혁 때이다." },
      { id: "eulmi-hair", term: "단발령을 시행하였다", clue: "태양력을 사용하고 종두법을 실시하였다.", answer: "을미개혁", priority: "S", note: "단발령·태양력·종두법은 을미개혁의 단서이다." },
      { id: "eulmi-school", term: "소학교를 설치하고 우편 사무를 다시 시작하였다", clue: "건양이라는 연호를 사용하였다.", answer: "을미개혁", priority: "A", note: "건양 연호와 소학교 설치는 을미개혁 때이다." },
      { id: "gwangmu-land", term: "양전 사업을 실시하고 지계를 발급하였다", clue: "구본신참의 원칙 아래 자주적 근대화를 추진하였다.", answer: "광무개혁", priority: "S", note: "양전·지계와 구본신참은 광무개혁의 핵심 단서이다." },
      { id: "gwangmu-army", term: "원수부를 설치해 황제가 군권을 장악하였다", clue: "상공업 진흥과 근대 시설 확충을 추진하였다.", answer: "광무개혁", priority: "A", note: "원수부 설치는 대한제국 광무개혁의 내용이다." }
    ]
  },
  {
    id: "classify-foreign-pressure",
    title: "개항 전후 사건 판별",
    era: "개항기",
    priority: "S",
    prompt: "단서에 해당하는 사건을 고르세요.",
    labels: ["병인양요", "신미양요", "운요호 사건", "강화도 조약"],
    cards: [
      { id: "byeongin-french", term: "프랑스 함대가 강화도를 침략하였다", clue: "양헌수가 정족산성에서 승리하였다.", answer: "병인양요", priority: "S", note: "프랑스군과 정족산성의 양헌수는 병인양요의 단서이다." },
      { id: "byeongin-books", term: "외규장각 도서가 약탈되었다", clue: "천주교 탄압을 구실로 침략이 일어났다.", answer: "병인양요", priority: "S", note: "외규장각 도서 약탈은 병인양요 때이다." },
      { id: "sinmi-american", term: "미군이 광성보를 공격하였다", clue: "어재연이 수자기를 지키며 항전하였다.", answer: "신미양요", priority: "S", note: "광성보·어재연·수자기는 신미양요의 단서이다." },
      { id: "sinmi-stele", term: "전국에 척화비를 세우는 계기가 되었다", clue: "제너럴 셔먼호 사건을 구실로 침략하였다.", answer: "신미양요", priority: "S", note: "제너럴 셔먼호와 척화비는 신미양요와 연결된다." },
      { id: "unyo-provocation", term: "일본 군함이 강화도 초지진의 포격을 유도하였다", clue: "조선을 강제로 개항시키기 위한 무력 도발이었다.", answer: "운요호 사건", priority: "S", note: "운요호 사건은 강화도 조약 체결의 직접 계기이다." },
      { id: "unyo-before-treaty", term: "불평등 조약 체결 직전에 일어난 무력 충돌이다", clue: "일본은 포함 측량을 구실로 강화도 연안에 접근하였다.", answer: "운요호 사건", priority: "A", note: "강화도 조약의 구실이 된 사건은 운요호 사건이다." },
      { id: "ganghwa-treaty", term: "조선을 자주국이라 규정하였다", clue: "해안 측량권과 치외 법권을 일본에 허용하였다.", answer: "강화도 조약", priority: "S", note: "자주국 규정·해안 측량권·치외 법권은 강화도 조약 조항이다." },
      { id: "ganghwa-ports", term: "부산 외에 원산과 인천을 개항하기로 하였다", clue: "일본과 맺은 최초의 근대적 불평등 조약이다.", answer: "강화도 조약", priority: "S", note: "3개 항구 개항은 강화도 조약의 내용이다." }
    ]
  },
  {
    id: "classify-enlightenment-organizations",
    title: "계몽·국권 수호 운동 판별",
    era: "개항기",
    priority: "S",
    prompt: "활동을 전개한 단체·운동을 고르세요.",
    labels: ["독립협회", "대한자강회", "신민회", "국채 보상 운동"],
    cards: [
      { id: "independence-club-island", term: "러시아의 절영도 조차 요구를 저지하였다", clue: "만민 공동회를 열어 자주 국권과 민권을 주장하였다.", answer: "독립협회", priority: "S", note: "절영도 조차 반대와 만민 공동회는 독립협회의 활동이다." },
      { id: "independence-club-assembly", term: "관민 공동회에서 헌의 6조를 결의하였다", clue: "의회 설립 운동을 전개하였다.", answer: "독립협회", priority: "A", note: "헌의 6조와 의회 설립 운동은 독립협회의 활동이다." },
      { id: "daehanjagang-education", term: "교육 진흥과 식산흥업을 강조하였다", clue: "대한제국 말기에 전국에 지회를 설치한 애국 계몽 단체였다.", answer: "대한자강회", priority: "A", note: "교육·산업 진흥과 전국 지회는 대한자강회의 단서이다." },
      { id: "daehanjagang-gojong", term: "고종 강제 퇴위 반대 운동을 전개하였다", clue: "이 활동을 빌미로 일제에 의해 해산되었다.", answer: "대한자강회", priority: "A", note: "고종 강제 퇴위 반대 운동은 대한자강회가 전개하였다." },
      { id: "sinmin-bookstore", term: "태극서관을 운영해 계몽 서적을 보급하였다", clue: "오산 학교와 대성 학교 설립을 지원하였다.", answer: "신민회", priority: "S", note: "태극서관·오산 학교·대성 학교는 신민회의 실력 양성 활동이다." },
      { id: "sinmin-base", term: "국외 독립운동 기지 건설을 추진하였다", clue: "105인 사건으로 조직이 사실상 해체되었다.", answer: "신민회", priority: "S", note: "독립운동 기지 건설과 105인 사건은 신민회의 단서이다." },
      { id: "debt-daegu", term: "김광제와 서상돈이 대구에서 시작하였다", clue: "국민의 힘으로 일본에 진 빚을 갚아 국권을 지키려 하였다.", answer: "국채 보상 운동", priority: "S", note: "김광제·서상돈과 대구는 국채 보상 운동의 핵심 단서이다." },
      { id: "debt-newspaper", term: "대한매일신보가 모금 활동을 적극 지원하였다", clue: "여성들도 반지와 비녀를 내놓으며 참여하였다.", answer: "국채 보상 운동", priority: "A", note: "대한매일신보의 지원과 국민 모금은 국채 보상 운동의 특징이다." }
    ]
  },
  {
    id: "classify-colonial-organizations",
    title: "일제강점기 단체 판별",
    era: "일제강점기",
    priority: "S",
    prompt: "활동과 인물이 가리키는 단체를 고르세요.",
    labels: ["독립의군부", "대한광복회", "신간회", "의열단"],
    cards: [
      { id: "uigungbu-im", term: "임병찬이 고종의 밀명을 받아 조직하였다", clue: "복벽주의를 내세우며 국권 반환 요구서를 보내려 하였다.", answer: "독립의군부", priority: "S", note: "임병찬·복벽주의·국권 반환 요구서는 독립의군부의 단서이다." },
      { id: "uigungbu-monarchy", term: "왕정을 회복하려는 복벽주의를 추구하였다", clue: "의병 전쟁을 준비하다 조직이 발각되었다.", answer: "독립의군부", priority: "A", note: "복벽주의를 내세운 국내 비밀 결사는 독립의군부이다." },
      { id: "gwangbok-park", term: "박상진이 총사령으로 활동하였다", clue: "군자금 모집과 친일 부호 처단을 추진하였다.", answer: "대한광복회", priority: "S", note: "박상진·군자금 모집·친일파 처단은 대한광복회의 단서이다." },
      { id: "gwangbok-republic", term: "공화정 수립을 목표로 한 비밀 결사였다", clue: "만주에 군관 학교를 세우려 하였다.", answer: "대한광복회", priority: "A", note: "공화정 지향과 군관 학교 계획은 대한광복회의 활동이다." },
      { id: "singan-jeongu", term: "정우회 선언을 계기로 결성되었다", clue: "민족주의와 사회주의 진영의 연합 단체였다.", answer: "신간회", priority: "S", note: "정우회 선언과 민족 유일당 운동은 신간회 결성의 배경이다." },
      { id: "singan-gwangju", term: "광주 학생 항일 운동의 진상 조사단을 파견하였다", clue: "전국에 지회를 둔 합법적 민족 협동 전선이었다.", answer: "신간회", priority: "S", note: "광주 학생 항일 운동 지원은 신간회의 대표 활동이다." },
      { id: "uiyeol-kim", term: "김원봉이 만주 지린에서 조직하였다", clue: "신채호가 조선 혁명 선언을 작성해 활동 지침을 제시하였다.", answer: "의열단", priority: "S", note: "김원봉과 조선 혁명 선언은 의열단의 단서이다." },
      { id: "uiyeol-direct", term: "식민 통치 기관을 폭파하고 요인을 처단하려 하였다", clue: "나석주·김익상·김상옥 등이 의거를 전개하였다.", answer: "의열단", priority: "S", note: "일제 기관 파괴와 요인 처단은 의열단의 직접 행동 노선이다." }
    ]
  },
  {
    id: "classify-independence-armies",
    title: "독립군 부대 판별",
    era: "일제강점기",
    priority: "S",
    prompt: "인물과 전투가 가리키는 부대를 고르세요.",
    labels: ["대한 독립군", "한국 독립군", "조선 혁명군", "조선 의용대"],
    cards: [
      { id: "daehandoklip-hong", term: "홍범도가 이끌었다", clue: "일본군을 유인해 봉오동 전투에서 승리하였다.", answer: "대한 독립군", priority: "S", note: "홍범도와 봉오동 전투는 대한 독립군의 핵심 연결이다." },
      { id: "daehandoklip-base", term: "북간도를 근거지로 국내 진공 작전을 전개하였다", clue: "군무도독부군 등과 연합해 일본군을 격파하였다.", answer: "대한 독립군", priority: "A", note: "북간도와 봉오동 전투는 대한 독립군을 가리킨다." },
      { id: "hanguk-jicheong", term: "지청천이 이끌었다", clue: "중국 호로군과 연합해 쌍성보·대전자령에서 승리하였다.", answer: "한국 독립군", priority: "S", note: "지청천·쌍성보·대전자령은 한국 독립군의 단서이다." },
      { id: "hanguk-north", term: "북만주에서 중국군과 연합 작전을 전개하였다", clue: "1930년대 대전자령 전투에서 일본군을 격파하였다.", answer: "한국 독립군", priority: "S", note: "북만주와 대전자령 전투는 한국 독립군을 가리킨다." },
      { id: "joseonhyeok-yang", term: "양세봉이 이끌었다", clue: "중국 의용군과 연합해 영릉가·흥경성에서 싸웠다.", answer: "조선 혁명군", priority: "S", note: "양세봉·영릉가·흥경성은 조선 혁명군의 단서이다." },
      { id: "joseonhyeok-south", term: "남만주에서 중국군과 연합 작전을 전개하였다", clue: "국민부 계열의 군사 조직으로 활동하였다.", answer: "조선 혁명군", priority: "A", note: "남만주와 국민부 계열은 조선 혁명군의 단서이다." },
      { id: "uiyongdae-wuhan", term: "김원봉이 중국 우한에서 창설하였다", clue: "중국 관내에서 조직된 최초의 한인 무장 부대였다.", answer: "조선 의용대", priority: "S", note: "김원봉·우한·중국 관내는 조선 의용대의 핵심 단서이다." },
      { id: "uiyongdae-propaganda", term: "대일 선전 활동과 포로 심문을 수행하였다", clue: "일부는 화북으로 이동하고 일부는 한국광복군에 합류하였다.", answer: "조선 의용대", priority: "A", note: "중국 관내 선전 활동은 조선 의용대의 특징이다." }
    ]
  },
  {
    id: "classify-modern-governments",
    title: "현대 정부 정책 판별",
    era: "현대사",
    priority: "A",
    prompt: "정책과 사건이 가리키는 정부를 고르세요.",
    labels: ["이승만 정부", "박정희 정부", "전두환 정부", "노태우 정부", "김대중 정부"],
    cards: [
      { id: "rhee-amendment", term: "발췌 개헌으로 대통령 직선제를 채택하였다", clue: "이후 사사오입 개헌으로 초대 대통령의 중임 제한을 없앴다.", answer: "이승만 정부", priority: "S", note: "발췌 개헌과 사사오입 개헌은 이승만 정부의 단서이다." },
      { id: "rhee-419", term: "3·15 부정 선거에 항의하는 시위가 일어났다", clue: "김주열의 희생으로 확산된 4·19 혁명 뒤 대통령이 하야하였다.", answer: "이승만 정부", priority: "S", note: "3·15 부정 선거와 4·19 혁명은 이승만 정부 말기의 사건이다." },
      { id: "park-council", term: "국가재건최고회의를 중심으로 군정을 실시하였다", clue: "경제 개발 5개년 계획을 추진하였다.", answer: "박정희 정부", priority: "S", note: "국가재건최고회의와 경제 개발 계획은 박정희 정부의 단서이다." },
      { id: "park-yushin", term: "유신 헌법을 공포하였다", clue: "민청학련 사건과 인혁당 재건위 사건으로 반대 세력을 탄압하였다.", answer: "박정희 정부", priority: "A", note: "유신 체제와 민청학련 사건은 박정희 정부 때이다." },
      { id: "chun-gukbowi", term: "국가보위비상대책위원회를 설치하였다", clue: "언론 통폐합을 단행하고 삼청교육대를 운영하였다.", answer: "전두환 정부", priority: "S", note: "국보위와 언론 통폐합은 신군부·전두환 정부의 단서이다." },
      { id: "chun-june", term: "대통령 간선제를 유지하려는 4·13 호헌 조치를 발표하였다", clue: "6월 민주 항쟁의 결과 직선제 개헌을 수용하였다.", answer: "전두환 정부", priority: "S", note: "4·13 호헌 조치와 6월 민주 항쟁은 전두환 정부 때이다." },
      { id: "roh-nord", term: "7·7 선언과 북방 외교를 추진하였다", clue: "남북한이 유엔에 동시에 가입하였다.", answer: "노태우 정부", priority: "S", note: "7·7 선언·북방 외교·남북 유엔 동시 가입은 노태우 정부의 단서이다." },
      { id: "roh-agreement", term: "남북 기본 합의서를 채택하였다", clue: "한반도 비핵화 공동 선언도 함께 발표하였다.", answer: "노태우 정부", priority: "S", note: "남북 기본 합의서와 비핵화 공동 선언은 노태우 정부 때이다." },
      { id: "kimdj-welfare", term: "국민기초생활보장법을 제정하였다", clue: "외환 위기 극복을 위해 노사정위원회를 구성하였다.", answer: "김대중 정부", priority: "A", note: "국민기초생활보장법과 노사정위원회는 김대중 정부의 정책이다." },
      { id: "kimdj-summit", term: "첫 남북 정상 회담을 개최하였다", clue: "6·15 남북 공동 선언을 발표하였다.", answer: "김대중 정부", priority: "S", note: "첫 남북 정상 회담과 6·15 공동 선언은 김대중 정부 때이다." }
    ]
  }
];
