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
