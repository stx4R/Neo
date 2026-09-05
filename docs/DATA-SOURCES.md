# 법령 데이터 출처

조합(도착국 × 품목)마다 — 채택한 법령, 출처 URL 2개 이상, 확인 날짜,
**제외한 법령과 그 사유**를 적는다. 심사 질의응답의 근거가 되는 문서다.

## 조사 규칙

1. **모르는 건 비운다.** 확인하지 못한 필드는 `null` / 빈 배열이고 화면에서는 표시하지 않는다
2. **독립된 출처 2개 이상으로 교차 확인.** 법령 번호·시행일·핵심 변경사항이 일치해야 기록한다
3. **1차 출처(정부 관보·소관 부처)면 `sourceTier: official`**, 로펌·시험인증기관 등
   신뢰 가능한 2차만 확보되면 `secondary`. 화면에 그대로 표기한다
4. `source.lastVerified`는 **실제로 그 URL을 열어 확인한 날짜**
5. `changes[]`는 실제로 개정된 조문만. 신규 규정이면 빈 배열이고 화면에서 그 섹션이 사라진다
6. `dueDate`는 법령에 명시된 기한이 있을 때만

---

# VN — 화장품 (`data/laws/VN-cosmetics.json`)

**조사일 2026-09-06 · 법령 4건 · 액션 11건 · 1차 1 / 2차 3**

## 채택

### 1. `CIRCULAR 06/2011/TT-BYT` — 화장품 제품신고 및 관리
`VN-2011-006` · 공포 2011-01-25 · 시행 2011-04-01 · CRITICAL · `secondary`

베트남 화장품의 기본법이다. 제품신고(접수번호), 제품정보파일(PIF), 안전성,
라벨, 광고, 수출입, 시료, 검사·처분, 사업자 책임을 다룬다.
**접수번호를 받기 전에는 판매할 수 없다** — 시장 진입 자체가 여기서 막히므로 CRITICAL.
접수번호 유효기간 5년.

- <https://cosmetic.chemlinked.com/cosmepedia/vietnam-cosmetic-regulation> (시행일 2011-04-01, 5년 유효)
- <https://antlawyers.vn/library/circular-062011tt-byt-regulating-cosmetics-management-in-vietnam.html> (공포일 2011-01-25, 규율 범위 9개 항목)
- <https://cosmetic.chemlinked.com/database/view/134> (원문 DB)

`changes`는 빈 배열이다 — 개정이 아니라 현행 기본 규정이므로 대비할 이전 조문이 없다.
화면에서 WHAT CHANGED 섹션이 사라지는 것이 맞다.

**`sourceTier: secondary` 사유**: 베트남 정부 관보 원문 URL을 확보하지 못했다.
ChemLinked·ANT Lawyers 둘 다 2차 출처다. 1차 링크를 찾으면 올린다.

### 2. `CIRCULAR 34/2025/TT-BYT` — 06/2011 개정, 온라인 제출 도입
`VN-2025-034` · 공포 2025-07-03 · 시행 2025-08-18 · MEDIUM · `secondary`

- <https://www.tilleke.com/insights/vietnam-updates-regulations-on-cosmetic-notification/>
  (공포 2025-07-03 / 시행 2025-08-18, 온라인 제출, 전자·디지털 서명, 처리기한 5영업일,
  부록 14-MP 접수 권한 성 보건기관 이관 3영업일, 경과 규정)
- <https://cosmetic.chemlinked.com/news/cosmetic-news/vietnam-officially-amends-circular-062011tt-byt-providing-cosmetic-management>
  (같은 공포일·시행일)
- <https://thuvienphapluat.vn/van-ban/EN/The-thao-Y-te/Circular-34-2025-TT-BYT-amendments-to-Circular-06-2011-TT-BYT-on-management-of-cosmetics/671159/tieng-anh.aspx> (영문 원문)
- <https://pbgdpl.cantho.gov.vn/thong-tu-so-342025tt-byt-sua-doi-thong-tu-062011tt-byt-quy-dinh-ve-quan-ly-my-pham-tu-1882025> (껀터시 법제포털, 시행 2025-08-18)

세 출처가 공포일·시행일·핵심 변경 3건에서 일치한다.

**`sourceTier: secondary` 사유**: 정부 포털(껀터시)이 있지만 관보 원문이 아니라
지자체 법제교육 페이지의 소개다. 보수적으로 2차로 둔다.

### 3. `OFFICIAL LETTER 647/QLD-MP` — ASEAN 화장품 성분 부속서 갱신
`VN-2026-647` · 발신 2026-02-25 · HIGH · **`official`**

베트남 보건부 **의약품관리국(DAV)** 이 ACC 42 · ACSB 42 결과를 반영해
ASEAN 화장품 지침(ACD) 부속서를 갱신한 공문이다.

- **<https://dav.gov.vn/upload_images/files/647_QLD_MP_signed.pdf>** — DAV 공식 사이트의
  서명본 PDF. **1차 출처다.**
- <https://datafiles.hanoi.gov.vn/gov-hni/6778/VanBan/2026/3/3/...647.pdf> — 하노이시 배포본
- <https://medgate.vn/en/update-on-cosmetic-ingredient-regulations-under-the-asean-cosmetic-directive-2026/>
  (성분별 적용일 대조)

| 성분 | 처분 | 적용일 |
|---|---|---|
| Miconazole · Miconazole Nitrate | 금지(부속서 II) 추가 | 2025-11-21 |
| Genistein 0.007% · Daidzein 0.02% | 농도 제한(부속서 III) | 2027-11-17 |
| 4-Methylbenzylidene Camphor | 부속서 VII(자외선차단)에서 삭제 → 금지(부속서 II) | 2028-11-17 |

`deadline`은 **2027-11-17**로 넣었다. 세 적용일 중 아직 오지 않은 것 중 가장 이른 날이다
(미코나졸은 이미 지났고, 4-MBC는 그보다 뒤다). 화면의 D-Day가 이 날에서 나온다.

### 4. `CIRCULAR 03/2026/TT-BYT` — 화장품 광고 사전심의 폐지
`VN-2026-003` · 공포 2026-02-12 · 시행 2026-02-15 · MEDIUM · `secondary`

- <https://cosmetic.chemlinked.com/news/cosmetic-news/vietnam-abolishes-the-approval-process-for-cosmetic-advertising-content>
- <https://www.aliatlegal.com/resources/legal-updates-en/circular-no-03-2026-tt-byt-abolition-of-cosmetic-advertising-content-approval-procedures-and-shift-to-post-market-surveillance/>
- <https://en.reach24h.com/news/industry-news/cosmetic/vietnam-introduces-post-market-surveillance-cosmetics-advertising-abolishing-pre-market-approval>

세 출처가 공포일 2026-02-12 · 시행일 2026-02-15 · 사전심의 폐지 + 사후감시 전환에서 일치한다.

규제 완화인데 MEDIUM인 이유: 부담이 사라진 것이 아니라 **사전 확인에서 자기책임으로
옮겨졌다.** 사후 시장감시에 걸리면 그때는 이미 광고가 나간 뒤다.

**관련 문서**: `DECISION 590/QD-BYT`(2026-03-10)는 03/2026이 폐지한 행정절차 4건을
공표하는 문서다. 법령 레코드로 넣지 않았다 — 의무를 바꾸는 것은 통칙 쪽이고,
같은 내용을 두 건으로 세면 화면의 "규제 N건"이 부풀려진다.

## 제외 — 그리고 그 사유

### `DRAFT DECREE on Cosmetic Management` (2026년 화장품 관리 시행령 초안)

**제외했다. 아직 초안이고 문서 번호가 없다.**

베트남 정부 정책포털에 올라온 초안 PDF의 표제가 `Số: /2026/NĐ-CP`로
**번호 자리가 비어 있다.** 채택되지 않았다는 뜻이다.

- <https://xaydungchinhsach.chinhphu.vn/toan-van-du-thao-nghi-dinh-quy-dinh-ve-quan-ly-my-pham-11926022111012889.htm>
- <https://xdcs.cdnchinhphu.vn/446259493575335936/2026/5/29/6082-dt-n-qlmp-13-05-2026-full-1780043925516946931874.pdf>

2차 출처들의 시행 예정일도 서로 어긋난다 — WTO 통보(2025-09-04) 기준 "2026-07-01 시행",
CIRS는 "2025-11-04 채택 목표", cisema는 2026-02-02 공개 초안. **일치하지 않으므로
규칙 2에 따라 기록하지 않는다.**

채택되면 06/2011 · 93/2016을 대체하고 CGMP-ASEAN 의무화, 부속서 갱신,
사후 시장감시를 들여온다. **이 앱에서 가장 큰 변화가 될 법령이므로 채택 여부를 계속 본다.**

### `DECREE 93/2016/ND-CP` — 화장품 생산시설 조건

**제외했다. 수출자의 의무가 아니다.**

베트남 **국내** 화장품 생산시설의 적격 증명서 요건이다(시행 2016-07-01).
한국에서 만들어 수출하는 회사는 이 증명서를 받을 대상이 아니다.
수출자에게 실제로 걸리는 것은 신고 서류에 들어가는 **제조사 CGMP/ISO 22716 증명**인데,
그 요건은 06/2011의 신고 서류 규정에서 나온다. 그래서 06/2011의 액션으로 다뤘다.

- <https://cosmetic.chemlinked.com/cosmepedia/vietnam-cosmetic-regulation> (시행 2016-07-01)
- <https://vietnamlawmagazine.vn/cosmetic-producers-must-meet-cgmp-asean-standards-5253.html>

### `DECREE 37/2026/ND-CP` — 상품 라벨 (일반)

**화장품에도 적용되지만 이 파일에 넣지 않았다. 구조상 한계다.**

이 시행령은 품목을 가리지 않는 **일반 상품 라벨** 규정이라 식품·화장품·전기전자에
모두 걸린다. 그런데 데이터 파일이 조합별로 쪼개져 있고 법령 id는 전역에서
유일해야 한다(`/laws/[id]` 정적 생성과 id 조회가 그 전제 위에 있다).
같은 `VN-2026-037`을 두 파일에 넣으면 조합마다 액션이 달라 id 하나가 두 액션 집합을
가리키게 된다.

지금은 `VN-food.json`에만 있다. **화장품 사용자는 자기에게 걸리는 라벨 시행령을
보지 못한다 — 실제 정보 누락이다.** 여러 품목에 걸치는 법령을 어떻게 다룰지는
B6 전에 정해야 한다(§DISCREPANCIES에 남긴다).

- <https://www.ey.com/en_vn/technical/tax/tax-and-law-updates/updated-labelling-requirements-under-decree-37-2026-nd-cp>
- <https://english.luatvietnam.vn/decreeno37-2026-nd-cpdatedjanuary232026ofthegovernmentdetailinganumberofarticlesandprovidingmeasurestoorganizeandguidetheimp-424821-doc1.html>
- <https://unicustomsconsulting.com/en/new-regulations-on-goods-labeling-under-decree-no-37-2026-nd-cp/>

세 출처가 시행일 2026-01-23 · 43/2017과 111/2021 대체 · 인쇄 라벨 2년 경과규정에서 일치한다.

## HS 코드 차등이 없는 이유

4건 모두 `hsPrefixes`가 화장품 전체(`3303 3304 3305 3307 3401`)다.
차등을 만들 근거가 없었다 — 신고·성분·광고 규정은 ASEAN 화장품 지침이 정의하는
화장품 전체에 걸린다. **없는 구분을 만들어 넣지 않는다.**

성분 규제(647/QLD-MP)는 실제로는 성분 단위로 갈린다(4-MBC는 자외선차단, 이소플라본은
미백·안티에이징). 그건 HS 코드가 아니라 처방의 문제라 `hsPrefixes`로 표현할 수 없다.

---

# VN — 식품·음료 (`data/laws/VN-food.json`)

**1단계 시드에서 이관 · 법령 5건 · 액션 9건 · 1차 2 / 2차 3**

이 조합은 2차 작업 이전에 작성됐고 B2에서 새 스키마로 이관했다.
B4에서 허구 `deadline`·`dueDate`를 폐기했다(DISCREPANCIES §71).

`DECREE 37/2026/ND-CP`의 시행일 2026-01-23과 인쇄 포장재 2년 경과규정은
위 §제외 항목의 세 출처로 재확인했다. 다만 **경과 종료일이 시드 데이터는 2028-01-22,
출처 표현은 "2026-01-23부터 2년"이라 2028-01-23으로도 읽힌다.** 하루 차이는
D-Day에 영향을 주므로 B6에서 원문으로 확정한다.

나머지 4건(110/2026 · 29/2023 · 46/2026 · 15/2018)은 **1단계 시드 작성 시점의
출처만 있고 2차 작업에서 교차 재확인하지 않았다.** B6에서 이 조합을 다시 훑을 때
같은 기준으로 검증한다.

> **B6 갱신**: 이 조합의 `DECREE 110/2026`(EPR)은 식품 전용이 아니라
> 식품·화장품·전기전자에 모두 걸리는 법령이라 `VN-shared.json`으로 옮겼다.
> 아래 「VN — 공용」 절을 본다. 나머지 3건(29/2023 · 46/2026 · 15/2018)의
> 재검증은 아직 남아 있다.

---

# VN — 전기·전자 (`data/laws/VN-electronics.json`)

**조사일 2026-09-06 · 법령 5건 · 액션 16건 · 1차 1 / 2차 4**
(공용 파일의 `DECREE 37/2026` · `DECREE 110/2026`을 합치면 화면에는 7건이 뜬다)

## 이 조합에서 처음으로 HS 코드 차등이 실재한다

§83이 "차등이 실제로 존재하는 조합(전기전자의 배터리 8507 등)에서 규칙 8을 지킨다"고
남겼다. 실제로 갈렸다 — 기본 제품 4개가 서로 다른 법령 묶음을 받는다.

| 제품 | HS | 걸리는 법령 |
|---|---|---|
| 전기밥솥 | 8516.60 | 36/2026 · QCVN 4:2009 · 52/2025 · 01/2026 · 공용 2 |
| LED 전구 | 8539.52 | 36/2026 · 56/2025 · 52/2025 · 01/2026 · 공용 2 |
| 무선 이어폰 | 8518.30 | 36/2026 · 01/2026 · 공용 2 |
| 보조배터리 | 8507.60 | 36/2026 · 01/2026 · 공용 2 |

화면에서 `QCVN 4:2009`는 `제품 1`, `56/2025`도 `제품 1`, `52/2025`는 `제품 2`로 뜬다.
전 제품 해당으로 뭉개지지 않았다.

## 채택

### 1. `CIRCULAR 36/2026/TT-BKHCN` — 위험도 2단계 목록
`VN-2026-036` · 공포 2026-06-30 · 시행 2026-07-01 · CRITICAL · **`official`**

과학기술부(MST) 소관 전 품목을 **중위험 / 고위험** 두 목록으로 재편했다.
`29/2025/TT-BKHCN` 등 5개 통칙을 대체한다. 시장 진입 절차 자체가 여기서 정해지므로
CRITICAL이다.

- **<https://mic.mediacdn.vn/document/2026/7/1/tt362026-1782881420543779583110.pdf>**
  — 부처 CDN에 올라온 통칙 원문 PDF(113쪽). **1차 출처다.**
- <https://dost.hochiminhcity.gov.vn/thong-bao/thong-tu-so-362026tt-bkhcn-danh-muc-san-pham-hang-ho-co-muc-do-rui-ro-trung-binh-muc-do-rui-ro-cao-thuoc-trach-nhiem-quan-ly-cu-bo-khoa-hoc-va-cong-nghe/>
  — 호치민시 과학기술국 공고. 위 PDF의 출처이자, 고위험은 `vnsw.gov.vn` 품질검사 등록,
  중위험은 `nqi.gov.vn` 자기적합성선언이라는 절차 구분을 명시한다
- <https://luatvietnam.vn/khoa-hoc/thong-tu-36-2026-tt-bkhcn-danh-muc-san-pham-hang-hoa-rui-ro-trung-binh-va-cao-439109-d1.html>
  (공포일·시행일·대체 통칙 5건)
- <https://www.gmalabs.com/post/vietnam-circular-36-2026-risk-based-device-rules> ·
  <https://c-prav.com/2026/07/22/vietnam-introduces-risk-based-product-classification-under-circular-36-2026-tt-bkhcn/>
  (2026-07-01 이전 발급 인증서는 유효기간까지 유지)

**부속서를 원문에서 직접 확인했다.** PDF의 압축 스트림을 풀어 HS 코드와 QCVN 참조를
뽑았고, 표가 `부속서 I(고위험)` → `부속서 II(중위험 — "DANH MỤC … MỨC ĐỘ RỦI RO
TRUNG BÌNH" 표제로 시작)` 순인 것을 확인했다.

| 우리 제품 | HS | 위치 | 적용 QCVN |
|---|---|---|---|
| 전기밥솥 | 8516.60.10 (`Nồi cơm điện`) | 부속서 I — **고위험** | QCVN 4:2009/BKHCN |
| 무선 이어폰 | 8518.30.10/.20/.51/.59/.90 | 부속서 I — **고위험** | QCVN 91:2015/BTTTT 등 |
| LED 전구 | 8539.52.10/.90 | 부속서 II — **중위험** | QCVN 19:2025/BKHCN |
| 보조배터리 | 8507.60.10/.31/.90 | 부속서 II — **중위험** | QCVN 101:2020/BTTTT |

**영문 2차 출처 셋이 이 통칙을 "IT·통신·무선기기 전용"이라고 썼는데 틀렸다.**
원문 표제가 `thuộc trách nhiệm quản lý của Bộ Khoa học và Công nghệ`(과학기술부 소관
전체)이고, 부속서에 `QCVN 4:2009/BKHCN`가 52회, `QCVN 9:2012/BKHCN`가 70회 나온다.
가전·조명·연료·완구·헬멧·철근이 전부 들어 있다.
**원문을 열지 않았으면 전기밥솥을 이 법령에서 빼먹을 뻔했다.**

**남긴 정밀도**: 보조배터리가 걸린 부속서 II 항목의 품명은
`Pin Lithium cho máy tính xách tay…`(노트북·태블릿·휴대폰용 리튬배터리)라
휴대용 보조배터리가 그 문언에 정확히 드는지는 원문만으로 단정할 수 없다.
`hsPrefixes`가 4자리라 `8507`로 매칭되어 보조배터리도 노출된다.
**HS 코드(8507.60.x)는 원문 그대로이므로 과다 노출이지 허위는 아니다.**
ExtendMax는 "휴대폰·노트북·태블릿용이 아닌 배터리팩은 대상 밖"이라고 쓰는데,
2차 출처 문장 하나로 원문 부속서를 뒤집지 않는다.

### 2. `QCVN 4:2009/BKHCN` — 가전 전기안전 국가기술규정
`VN-2009-004` · 시행 2010-06-01 · CRITICAL · `secondary`

CR 마크 없이는 팔 수 없다. 시장 진입이 여기서 막히므로 CRITICAL이다.
`06/2011/TT-BYT`가 화장품에서 하는 역할을 전기전자에서 한다 —
개정이 아니라 현행 기본 규정이라 `changes`가 빈 배열이고 화면에서
WHAT CHANGED 섹션이 사라진다.

- <https://www.tuv.com/market-access-services/en/certification-filter/vietnam-cr-mark-for-safety-and-emc-of-household-appliances.html>
  (QCVN 4:2009/BKHCN + A1:2016 안전, QCVN 9:2012/BKHCN + A1:2018 EMC, 지정 시험소 시험 필수)
- <https://phucgia.com.vn/en/qcvn-04-2009-bkhcn-on-safety-for-electrical-and-electronic-equipment>
  (`21/2009/TT-BKHCN`로 공포, 13개 품목에 전기밥솥 포함, 1~6번 품목 2010-06-01 시행)
- <https://extendmax.vn/new-regulation-on-cr-safety-and-emc-approval-for-home-appliances>
  (현행 QCVN 4:2009 · 9:2012 체계, 인증 방식 1/5/7)
- 위 36/2026 원문 부속서 I이 8516.60.10에 QCVN 4:2009/BKHCN을 지정한다 — **교차 확인됨**

**`sourceTier: secondary` 사유**: 2009년 통칙 원문 URL을 확보하지 못했다.
공포 통칙 번호도 출처마다 `21/2009/TT-BKHCN` / `21/2016/TT-BKHCN`(개정)로 엇갈려
`officialRef`를 통칙 번호가 아니라 **QCVN 번호로 적었다.** 베트남 현장에서도
이 규정은 QCVN 번호로 불린다(§B-3 규칙 9).

### 3. `CIRCULAR 56/2025/TT-BKHCN` — LED 조명 QCVN 19:2025 교체
`VN-2025-056` · 공포 2025-12-31 · 시행 2026-06-01 · HIGH · `secondary`

- <https://luatvietnam.vn/khoa-hoc/thong-tu-56-2025-tt-bkhcn-quy-chuan-an-toan-va-tuong-thich-dien-tu-cho-led-423210-d1.html>
  (공포 2025-12-31 / 시행 2026-06-01, 경과규정: HS 9405.11.99만 2026-12-31까지 유예,
  2027-01-01부터 부속서 A 전 품목)
- <https://phucgia.com.vn/en/circular-no-56-2025-tt-bkhcn-qcvn-192025-bkhcn-national-technical-regulation-on-safety-and-electromagnetic-compatibility-emc-for-led-lighting-products>
  (시행 2026-06-01, QCVN 19:2019 대체)
- <https://www.vietnam-certification.com/en/vietnam-issues-updated-qcvn-192025-for-led-lighting-compliance/>
  (2027-01-01 전면 적용, 시료 그룹화·소량 수입 완화 신설)
- 36/2026 원문 부속서 II가 8539.52에 QCVN 19:2025/BKHCN을 지정한다

**`deadline`을 넣지 않았다.** 2027-01-01은 **HS 9405.11.99(조명기구)의 유예 종료일**이지
우리 제품(LED 전구 8539.52)의 기한이 아니다. 8539.52는 2026-06-01부터 이미 대상이라
`deadline: null` + 배지 `미이행`이 맞다(§81). 유예 사실은 `transitionEndsAt` 2026-12-31과
`transitionNote`에 적어 화면에 그대로 보여준다.
**여기서 2027-01-01을 `deadline`에 넣었으면 D-117이 떴을 것이고, 그건 §71이 폐기한
"화면 숫자를 맞추려고 역산한 D-Day"와 같은 종류의 거짓말이다.**

`publishedAt`이 2026-04-02라는 출처(vietnam-certification)가 하나 있었으나
luatvietnam·thuvienphapluat이 2025-12-31로 일치해 그쪽을 택했다.
통칙 번호가 `56/2025`인 것도 2025년 공포와 맞는다.

### 4. `CIRCULAR 52/2025/TT-BCT` — 에너지효율 라벨 대상 확대
`VN-2025-052` · 공포 2025-11-14 · 시행 2026-01-01 · HIGH · `secondary`

- <https://extendmax.vn/circular-52-2025-tt-bct-on-vneep-energy-labeling-in-vietnam>
  (공포 2025-11-14 / 시행 2026-01-01, 2026 의무 15개 품목에 전기밥솥·LED 램프,
  2027 의무 전환 9개 품목)
- <https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chinh-sach-moi/98726/da-co-thong-tu-52-2025-tt-bct-ve-dan-nhan-nang-luong-va-lo-trinh-thuc-hien>
  (공포일·시행일 일치, 적용 제외 대상)
- <https://www.plas.com/news/details/1344> (15개 품목 목록 일치)
- <https://enviliance.com/regions/southeast-asia/vn/vn-energy/vn-energy-product>
  (기존 체계인 `04/2017/QD-TTg`에서 전기밥솥·LED가 2020-01-01부터 의무였음을 확인)

`04/2017/QD-TTg`를 **폐지하는 것이 아니라 목록을 넓히는** 하위 통칙이라
`changes`의 before를 "04/2017/QD-TTg의 목록"으로 적었다. 총리 결정을 부처 통칙이
대체한다고 쓰면 법령 위계가 틀린다.

### 5. `CIRCULAR 01/2026/TT-BCT` — 제품 내 유해화학물질 정보공개
`VN-2026-001` · 공포·시행 2026-01-17 · HIGH · `secondary`

화학물질법과 `26/2026/ND-CP`를 이행하는 통칙. `32/2017/TT-BCT`·`17/2022/TT-BCT`를
대체한다. 완제품에 든 납·카드뮴·6가크롬을 **시장 출시 전** 국가화학물질DB
(`chemicaldata.gov.vn`)에 공개하고, 라벨·설명서·웹사이트 중 하나로 접근 가능하게 둬야 한다.

- <https://www.gmalabs.com/post/vietnam-hazardous-chemical-declaration-new-moit-circular-01-2026>
  (공포 2026-01-17, 수입자 신고 의무, 부속서 XIX 한계치 Cd 0.01% · Pb 0.1% · Cr(VI) 0.1%)
- <https://phucgia.com.vn/en/chemical-activity-hazardous-substance-control>
  (공포일 = 시행일 2026-01-17, 32/2017·17/2022 효력 상실)
- <https://www.chemradar.com/en/lawinfo/detail/fapppvlttr7k> (2026-01-17, 26/2026/ND-CP 이행)
- <https://www.complianceandrisks.com/blog/rohs-in-2026-essential-updates-from-the-eu-uzbekistan-vietnam-and-brazil/>
  (납·카드뮴·수은·6가크롬 공개 의무, 라벨 또는 웹사이트)

**한계치 수치를 `changes`에 적지 않았다.** EU RoHS와 같은 숫자인데 gmalabs 한 곳에서만
나왔고 원문 부속서 XIX를 열지 못했다. 숫자는 틀리면 바로 실무 사고가 나므로 비웠다.

## 제외 — 그리고 그 사유

### 베트남 RoHS 국가기술규정 (`QCVN 2022/BCT` 초안)

**제외했다. 2022년 초안이 아직 채택되지 않았다.**

산업무역부가 2022-08-29에 전기전자제품 유해물질 제한 QCVN 초안을 공개하며
시행일을 2026-01-01로 잡았지만, 2026-09-06 현재 승인되지 않았다.
`extendmax`는 "2026-01-01부터 RoHS·CR 인증 의무"라 쓰고
`complianceandrisks`는 "초안이 미승인 상태로 남아 있다"고 쓴다. **일치하지 않으므로
규칙 2에 따라 기록하지 않는다.** 실제로 살아 있는 의무는 위 `01/2026/TT-BCT`의
정보공개 쪽이고 그것만 넣었다.

- <https://www.complianceandrisks.com/blog/vietnam-to-enact-mandatory-rohs-requirements/>
- <https://extendmax.vn/cr-type-approval-rohs-for-electric-and-electronic-products>

채택되면 이 조합에서 가장 큰 변화가 된다. 계속 본다.

### `QCVN 4:2009` · `QCVN 9:2012`를 대체할 신규 QCVN 초안

**제외했다. 번호가 아직 `QCVN xx:202x/BKHCN`이다.**

가전 안전·EMC를 하나로 합치고 진공청소기·세탁기 등에 안전시험을 추가하는 초안인데,
ExtendMax가 제시한 로드맵(2023-07-01 / 2024-07-01)이 이미 지났는데도 번호가 붙지 않았다.
채택되지 않았다는 뜻이다. 초안이 제시한 220V/50Hz·플러그 형식(TCVN 6190:1999) 요건도
그래서 액션에 넣지 않았다.

- <https://extendmax.vn/new-regulation-on-cr-safety-and-emc-approval-for-home-appliances>

### `QCVN 101:2020/BTTTT` — 리튬배터리 (독립 법령으로는 제외)

**제외했다. 36/2026 부속서 II 안에 있다.**

리튬배터리 시험 규정이지만 지금은 `36/2026/TT-BKHCN` 부속서 II가 8507.60에
적용 QCVN으로 지정하는 구조다. 별도 법령 레코드로 세우면 같은 의무가 두 건으로 세어져
화면의 "규제 N건"이 부풀려진다 — VN-cosmetics에서 `DECISION 590/QD-BYT`를 뺀 것과
같은 이유다. 대신 36/2026의 액션 `VN-a-elec-03`이 중위험 자기적합성선언으로 다룬다.

"2026-01-01부터 QCVN 101 전 항목 시험 의무"라는 서술도 봤지만
독립된 두 번째 출처로 확인되지 않아 기록하지 않았다.

### `DECREE 55/2025/ND-CP` — 정보통신부(MIC)의 과학기술부(MST) 흡수 합병

**법령 레코드로 넣지 않았다. 수출자의 의무를 바꾸지 않는다.**

2025-03-01 부처 통합으로 형식승인 소관이 MST로 넘어간 것은 사실이지만,
기업이 해야 할 일은 달라지지 않고 접수 창구만 바뀐다. 창구 변경은 36/2026의
`vnsw.gov.vn` · `nqi.gov.vn` 액션이 이미 담고 있다.

## 서술 톤

`VN-cosmetics.json`을 본보기로 삼았다(B5 확정). `title`은 한국어 한 줄로
"무엇이 바뀌었고 왜 중요한가", `changes[].before/after`는 실제 조문 대비,
`owner`는 품질팀 / 디자인 / 영업 / 구매 / 마케팅 / 경영에서 고른다.
`dueDate`는 16건 전부 `null`이다 — 법령에 명시된 개별 액션 기한이 없다.

## `originScope` — 이 조합에도 없다

출발국(KR)에 따라 갈리는 요건이 나오지 않았다. 전기안전·EMC·에너지효율·유해물질은
전부 제품 자체의 성질이지 어디서 실려 왔는가와 무관하다.
`Dataset.hiddenByOrigin`은 0이고 S2 하단 줄은 뜨지 않는다.

---

# VN — 공용 (`data/laws/VN-shared.json`)

**법령 2건 · 액션 12건 · 1차 1 / 2차 1**

## `DECREE 110/2026/ND-CP` — EPR을 공용으로 옮겼다

**B6에서 `VN-food.json`에서 꺼내 공용 파일로 옮겼다.** §85가 만든 자리에 들어간다.

이 시행령은 포장재만이 아니라 **포장재 · 축전지/배터리 · 윤활유 · 타이어 ·
전기전자 · 도로운송수단** 여섯 군의 재활용 의무를 정하고 각 군에 별도의
재활용률을 매긴다. 식품에만 두면 화장품 사용자와 전기전자 사용자가
자기에게 걸리는 재활용 의무를 보지 못한다 — §82가 지적한 것과 같은 누락이다.

- <https://english.luatvietnam.vn/decree-no-110-2026-nd-cp-dated-april-01-2026-of-the-government-detailing-a-number-of-articles-of-the-law-on-environmental-protection-regarding-respo-430991-doc1.html>
  (공포 2026-04-01, 영문 원문)
- <https://www.bakermckenzie.com/en/insight/publications/2026/06/vietnam-new-regulations-on-extended-producer-responsibility>
  (공포 2026-04-01 / 시행 2026-05-25, 2026년분부터 `08/2022/ND-CP`를 대체)
- <https://baochinhphu.vn/doi-tuong-phai-thuc-hien-trach-nhiem-tai-che-san-pham-bao-bi-102260406111827326.htm>
  (정부 전자신문 — 대상 6군에 `điện - điện tử` 명시, 재활용률 3년 주기 조정,
  첫 조정 2029년)
- <https://grac.vn/en/epr-vietnam/> (면제 기준 연매출 300억 동, 전기전자는 별도 재활용률)

**고친 값**: 시드에 있던 `publishedAt: 2026-05-10`은 어느 출처와도 맞지 않아
**2026-04-01로 고쳤다.** `publisher`는 "베트남 정부 관보"였는데 URL이 로펌 알림이라
1차인 척하는 표기였다 — "베트남 정부"로 바꿨다(§B-3 규칙 3).
`hsPrefixes`는 `["20","21"]`에서 `[]`로 바꿨다. 재활용 의무는 HS 코드와 무관하다(§86).

**연간 신고·납부 기한은 넣지 않았다.** 출처가 3월 31일과 4월 1일로 갈린다.
`110/2026`이 `08/2022`를 대체하면서 바뀌었을 수 있는데 원문으로 확인하지 못했다.
하루 차이가 D-Day에 그대로 나오므로 비운다(§B-3 규칙 7).

**액션 id는 그대로 뒀다.** `VN-a-05` · `VN-a-06` · `VN-a-07`은 옛 명명 규칙이지만
`neo.actions.done`이 그 id를 담고 있어 바꾸면 사용자의 완료 표시가 날아간다(§52).
파일만 옮기고 id는 건드리지 않았다. 전기전자용 액션 2건을
`itemCategories: ["electronics"]`로 새로 붙였다.

**수출자 본인의 의무인가**: 의무자는 `nhà sản xuất, nhập khẩu`(생산자·수입자)로
베트남 내 수입자가 진다. 한국 수출자가 자기 베트남 법인을 통해 수입하면 직접 걸리고,
현지 유통사를 통하면 그 유통사가 진다. 어느 쪽이든 **제품·포장의 중량과 재질 자료는
수출자에게서 나온다.** 그래서 제외하지 않고, 액션을 그 자료 제공과 비용 분담 확정으로
잡았다. VN-cosmetics에서 `93/2016`(베트남 국내 생산시설 요건)을 뺀 것과는 다르다 —
그건 수출자가 애초에 대상이 될 수 없는 규정이었다.

## `DECREE 37/2026/ND-CP` — 전기전자 액션 추가

`VN-a-037-elec-01`(정격전압·소비전력·안전경고 베트남어 보조라벨)을 붙였다.
식품·화장품에 이어 세 품목이 다 찼다.

**경과 종료일 2028-01-22 vs 2028-01-23은 아직 확정하지 못했다.** 3차 지시서가
지목한 항목이고 `english.luatvietnam.vn` 원문에서 확인해야 한다.
남은 조합 작업에서 이어 처리한다.
