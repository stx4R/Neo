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

**재검증 2026-09-06 · 법령 4건 · 액션 8건 · 1차 2 / 2차 2**
(공용 파일의 `DECREE 37/2026` · `DECREE 110/2026`을 합치면 화면에는 6건이 뜬다)

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

**위 인용문은 재검증 이전의 상태를 남긴 것이다.**
경과 종료일은 원문으로 확정했고(「VN — 공용」 절), `29/2023`은 폐지됐다.
아래 「재검증 2026-09-06」이 이 조합의 현재 내용이다.

---

## 재검증 2026-09-06 — 무엇이 바뀌었나

| 법령 | 조치 |
|---|---|
| `CIRCULAR 29/2023` | **폐지 확인 → 데이터셋에서 뺐다.** `THÔNG TƯ 30/2026/TT-BYT`가 대체 |
| `CIRCULAR 30/2026` | **신규.** 29/2023을 대체한 현행 영양성분 표시 통칙 |
| `DECREE 46/2026` | 보류 유효 확인. 출처를 정부 문서포털로, `publishedAt`을 고침 |
| `DECREE 15/2018` | 관보 원문 확보 → `secondary`에서 `official`로. 액션 2건 신설 |
| `CIRCULAR 24/2019` | **신규.** 식품첨가물 허용목록·최대사용량 |

### 1. `THÔNG TƯ 30/2026/TT-BYT` — 29/2023을 대체한다
`VN-2026-030` · 공포 2026-07-09 · 시행 2026-07-10 · HIGH · `secondary`

**이 조합에서 가장 값이 컸던 발견이다.** 시드 데이터의 `CIRCULAR 29/2023`은
2026-07-10부로 효력을 잃었다. 그대로 뒀으면 폐지된 통칙을 현행 의무로 보여줬을 것이다.

- <https://luatvietnam.vn/y-te/thong-tu-30-2026-tt-byt-huong-dan-ghi-thanh-phan-va-gia-tri-dinh-duong-tren-nhan-thuc-pham-440000-d1.html>
  (공포 2026-07-09 / 시행 2026-07-10, 서명 Đỗ Xuân Tuyên 차관.
  `Thông tư số 29/2023/TT-BYT … hết hiệu lực kể từ ngày Thông tư này có hiệu lực thi hành`)
- <https://thuvienphapluat.vn/van-ban/Thuong-mai/Thong-tu-30-2026-TT-BYT-huong-dan-noi-dung-cach-ghi-thanh-phan-dinh-duong-tren-nhan-thuc-pham-713960.aspx>
  (같은 공포일·시행일)
- <https://suckhoedoisong.vn/bo-y-te-5-thong-tin-dinh-duong-bat-buoc-phai-ghi-tren-nhan-thuc-pham-169260712100544345.htm>
  (보건부 기관지 — 필수 5종과 적용 제외 목록)
- <https://luatvietnam.vn/tin-van-ban-moi/thong-tin-dinh-duong-bat-buoc-phai-ghi-tren-nhan-thuc-pham-186-110310-article.html>
  (제5조 필수 5종, `thay thế Thông tư 29/2023/TT-BYT kể từ ngày 10/7/2026`)

필수 5종은 **에너지 · 단백질 · 탄수화물 · 지방 · 나트륨**이고, 음료·가당 가공유·
가당 식품은 총당류를, 튀김 식품은 포화지방을 더한다. 단위는 kcal / g / mg,
기준은 100g·100ml 또는 1회 제공량이다.

**이 조합에서 처음으로 HS 차등이 생겼다.** 통칙이 적용 제외를 명시한다 —
단일 원료 식품, 천연광천수·병입음용수, 식용소금, 식초, 향미료, 식품효소,
무첨가 차·커피, 건강보호식품, **주류**, 소규모 사업자 제품.
그래서 `hsPrefixes`를 `["16","17","18","19","20","21","2202"]`로 적었다.
22류를 통째로 넣지 않은 것은 `2201`(병입음용수)과 `2203`~`2208`(주류)이 명시적
제외 대상이기 때문이다. 청량음료 `2202`만 남긴다.

**시드의 `hsPrefixes: ["2008","2103"]`은 틀렸다.** 유자청(2007.99)이 빠져 있었는데
잼·과일가공품은 단일 원료 식품이 아니라 적용 대상이다.

`sourceTier`는 `secondary`다 — 보건부 통칙은 관보(`congbao.chinhphu.vn`)에 실리지 않고,
소관 기관인 식품안전국(`vfa.gov.vn`)은 조사 시점에 접속되지 않았다(`ECONNREFUSED`).
`vasep.com.vn`이 올린 원문 PDF는 받았으나 서브셋 폰트라 텍스트가 나오지 않았다.

**액션 id `VN-a-08` · `VN-a-09`는 그대로 뒀다.** 법령이 바뀌어도 할 일의 종류
(시험성적서 확보 · 라벨 반영)는 같고, `neo.actions.done`이 그 id를 담는다(§52 · §92).
`lawId`만 `VN-2026-030`으로 돌리고 제목을 5종 기준으로 고쳤다.

### 2. `DECREE 46/2026/ND-CP` — 보류가 아직 유효하다
`VN-2026-046` · 공포·시행 2026-01-26 · MEDIUM · `official`

- **<https://vanban.chinhphu.vn/?pageid=27160&docid=216827>** — 정부 문서포털.
  서명본 원문 PDF(`datafiles.chinhphu.vn/cpp/files/vbpq/2026/01/46-ndcp.signed.pdf`)를 건다.
  **1차 출처다**
- <https://baochinhphu.vn/tiep-tuc-ap-dung-nghi-dinh-15-2018-nd-cp-ve-an-toan-thuc-pham-cho-den-khi-co-quy-dinh-moi-102260408123934123.htm>
  (정부 전자신문 2026-04-08)
- <https://nhandan.vn/tiep-tuc-tam-ngung-ap-dung-nghi-dinh-so-462026nd-cp-post954080.html>
  (인민일보 2026-04-08)

**`heldAt` `2026-04-06`은 실재 날짜였다.** 두 정부 매체가 일치한다 —
`Nghị quyết 15/2026/NQ-CP ngày 06/4/2026`이 `Nghị định 46/2026/NĐ-CP`(2026-01-26)와
`Nghị quyết 66.13/2026/NQ-CP`(2026-01-27)의 효력을 정지시켰다. 해제 시점은 날짜가
아니라 조건이다 — `cho đến khi Luật An toàn thực phẩm (sửa đổi) và Nghị định
hướng dẫn … có hiệu lực thi hành`. 개정 식품안전법과 그 시행령이 시행될 때까지다.

앞선 `Nghị quyết 09/2026/NQ-CP`(2026-02-04)는 2026-04-15까지로 기한을 끊었는데
`15/2026`이 그것을 대체하며 무기한으로 바꿨다. **2026-09-06 현재 보류 유효.**

**고친 값**: `publishedAt`이 `2026-01-12`였는데 어느 출처와도 맞지 않는다 —
시행령 자체가 `26/01/2026`자다. `2026-01-26`으로 고쳤다.
`publisher` `"베트남 정부 관보"`도 `"베트남 정부"`로 바꿨다(§93).
`hsPrefixes`는 `["20","21"]`에서 식품 전 범위로 넓혔다 — 식품안전법 시행령은
품목을 가리지 않는다.

**액션은 여전히 0건이다.** 효력이 정지된 시행령의 액션은 지금 할 일이 아니다(§73).
재시행에 대비한 사전 준비를 액션으로 적으면 그건 우리가 지어낸 일이 된다.

### 3. `DECREE 15/2018/ND-CP` — 관보 원문을 찾았다
`VN-2018-015` · 공포·시행 2018-02-02 · MEDIUM · **`official`**

- **<https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-15-2018-nd-cp-25858.htm>**
  — 관보 제375+376호(2018-02-15). PDF·DOC 원문 링크 보유. **1차 출처다**
- 위 `46/2026`의 두 정부 매체가 `Nghị định số 15/2018/NĐ-CP … tiếp tục có hiệu lực`로
  현행 유효를 확인한다

**`sourceTier`를 `secondary`에서 `official`로 올렸다.** 시드는 URL이 `chemlinked.com`
(상용 컴플라이언스 매체)인데 `publisher`가 `"베트남 정부 관보"`였다 — §93이 EPR에서
지적한 것과 같은 위반이다. 이번엔 관보 원문을 확보했으므로 URL 쪽을 올렸다.

**`riskLevel`을 `low`에서 `medium`으로 올렸다.** 46/2026이 보류된 지금 **이 시행령이
베트남에 식품을 넣는 유일한 경로**다. 자가공표를 마치지 않으면 통관이 안 된다.
보류 중인 46/2026이 `medium`인데 실제로 밟아야 하는 절차가 `low`인 것은 앞뒤가 안 맞았다.

**액션 2건을 새로 붙였다.** 시드는 `actionIds: []`라 배지도 액션도 없는 휴면 법령이었다 —
"현행 유지"라는 제목만 있고 사용자가 할 일이 없었다. 자가공표 서류 작성과
등록공표 대상 판정은 실제로 해야 하는 일이다.

`Nghị định 155/2018/NĐ-CP`(2018-11-12)가 이 시행령을 개정했으나 `changes`에 넣지 않았다.
2018년 개정이라 "무엇이 바뀌었나"로 보여줄 최근 변경이 아니다(§B-3 규칙 6).

### 4. `THÔNG TƯ 24/2019/TT-BYT` — 식품첨가물
`VN-2019-024` · 공포 2019-08-30 · 시행 2019-10-16 · MEDIUM · `secondary`

법령 3건으로는 목표(4~6)에 미달해 보충한 건이다. 소스·장류는 첨가물이 들어가는
가공식품이라 이 조합에 실제로 걸린다.

- <https://thuvienphapluat.vn/van-ban/The-thao-Y-te/Thong-tu-24-2019-TT-BYT-quy-dinh-ve-quan-ly-va-su-dung-phu-gia-thuc-pham-360857.aspx>
  (공포 2019-08-30 / 시행 2019-10-16)
- <https://english.luatvietnam.vn/y-te/circular-24-2019-tt-byt-prescribing-the-management-and-use-of-food-additives-176882-d1.html>
  (같은 날짜, 영문)
- <https://dms.gov.vn/tin-chi-tiet/-/chi-tiet/thong-tu-so-24-2019-tt-byt-400-loai-phu-gia-thuc-pham-%C4%91uoc-phep-su-dung-trong-thuc-pham-19253-1.html>
  (시장관리국 — 허용 첨가물 400종)
- <https://sonla.dms.gov.vn/en/tin-chi-tiet/-/chi-tiet/thong-tu-17-2023-tt-byt-sua-%C4%91oi-va-bai-bo-mot-so-van-ban-ve-an-toan-thuc-pham-70001-2607.html>
  (개정 통칙 `17/2023/TT-BYT` 2023-09-25 — 부록 2B에 18종 추가, 제3조 8항·제5조 4항 개정,
  제5조 5·6항 신설)

`changes`는 `17/2023`의 개정분만 적었다. **허용 첨가물 400종의 구체 목록과
품목별 최대사용량(ML) 수치는 넣지 않았다** — 부록을 원문으로 열지 못했고,
숫자는 틀리면 바로 실무 사고가 난다(전기전자 `01/2026`에서 한계치를 비운 것과 같다).

`sourceTier: secondary`. 보건부 통칙이라 관보에 없고 `vfa.gov.vn`이 접속되지 않았다.

## 제외 — 그리고 그 사유

### `Luật An toàn thực phẩm (sửa đổi)` — 개정 식품안전법

**제외했다. 2026-09-06 현재 국회 제출 전 초안이다.**

`46/2026`의 보류를 푸는 열쇠가 이 법인데, 2026-07-09에 기초안 개요(khung)가
통과됐을 뿐이고 제16대 국회 첫 회기 통과를 목표로 입법계획에 올라 있는 단계다.
시행일이 없으므로 `scheduled`로도 넣을 수 없다.

- <https://suckhoedoisong.vn/hoan-thien-luat-an-toan-thuc-pham-sua-doi-day-manh-phan-cap-chuyen-doi-so-cat-giam-thu-tuc-hanh-chinh-169260723200850983.htm>
- <https://baochinhphu.vn/bo-sung-du-an-luat-an-toan-thuc-pham-sua-doi-vao-chuong-trinh-lap-phap-nam-2026-102260116173546446.htm>

VN-cosmetics에서 화장품 관리 시행령 초안을 뺀 것과 같은 이유다.

### `THÔNG TƯ 11/2026/TT-BCT` · `THÔNG TƯ 31/2026/TT-BCT` — 식품 이력추적

**둘 다 제외했다. 우리 제품이 적용 대상인지 원문으로 확인하지 못했다.**

경과가 복잡하다. 산업무역부가 `11/2026/TT-BCT`(2026-02-27 공포 / 2026-04-16 시행)로
식품 이력추적을 규정했다가 `Quyết định 906/QĐ-BCT`(2026-04-15)로 2026-07-01까지
효력을 정지시켰고, 그 사이 `31/2026/TT-BCT`(2026-06-11 공포 / 2026-07-01 시행)가 나왔다.
31/2026의 적용 범위는 **`sản phẩm, hàng hóa có mức độ rủi ro cao thuộc phạm vi
quản lý của Bộ Công Thương`** — 산업무역부 소관 **고위험** 품목이다.

빼기로 한 이유 둘:

1. **31/2026이 11/2026을 폐지하는지 2차 출처가 말하지 않는다.** 어느 쪽이 살아 있는지
   확정하지 못했다
2. **소스·장류·조미김이 산업무역부 소관 고위험 목록에 드는지 확인하지 못했다.**
   베트남 식품 관할은 보건부·산업무역부·농업부로 갈리고 소스류의 소관이 갈린다.
   부속서를 확보해야 하는데 `datafiles.chinhphu.vn`의 원문 PDF 두 건
   (`2026/6/31-bct.pdf` · `2026/3/11-bct.pdf`)이 **전부 스캔 이미지라 텍스트가 나오지 않았다.**
   `36/2026`에서 통했던 zlib 추출이 여기서는 통하지 않는다

§89가 가르친 것의 뒤집힌 적용이다. 그때는 2차 출처가 범위를 **좁게** 말해 원문으로
넓혔다. 여기서는 원문을 못 열었으므로 **넓게 넣지 않는다.** 이력추적 의무에는
실재 기한(생산시설 2026-12-01 · 수입시설 2027-03-01, `11/2026` 기준)이 붙어 있어
넣었으면 화면에 D-Day가 떴을 것이다. 그게 우리 제품의 날짜인지 모르는 채로 넣으면
§91이 폐기한 것과 같은 종류의 거짓말이 된다.

- <https://vanban.chinhphu.vn/?pageid=27160&docid=218415> (`31/2026`, 서명본 PDF)
- <https://vanban.chinhphu.vn/?docid=217126&pageid=27160> (`11/2026`, 서명본 PDF)
- <https://moit.gov.vn/tin-tuc/bo-cong-thuong-ban-hanh-thong-tu-quy-dinh-truy-xuat-nguon-goc-thuc-pham.html>
- <https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chinh-sach-moi/110749/tam-ngung-hieu-luc-thong-tu-11-2026-tt-bct-truy-xuat-nguon-goc-thuc-pham-den-ngay-01-7-2026>

**다음 작업자에게**: 원문 PDF에 OCR을 걸거나 `thuvienphapluat.vn`의 `van-ban` 페이지
(WebFetch가 403을 받는다)를 다른 경로로 열면 부속서를 확인할 수 있다.
확인되면 이 조합에 실재 D-Day가 생긴다.

## `originScope` — 이 조합에도 없다

기본 제품 넷 중 동물성 식품이 없다. 수출국 정부 발행 위생증명서와 수출시설 등록은
동물성 원료 식품에 걸리는데 소스·장류·조미김·유자청은 전부 식물성이다.
채울 근거가 없다. 3차 지시서가 예상한 대로 **미국 식품(FSVP·시설등록)** 쪽에서
나올 가능성이 높다.


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

**법령 2건 · 액션 12건 · 1차 1 / 2차 1** (`37/2026`은 2026-09-06 관보 원문으로 재확인)

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

## `DECREE 37/2026/ND-CP` — 경과 종료일을 원문으로 확정했다 (2026-09-06)

**2028-01-22가 아니라 2028-01-23이다.** D-503에서 D-504로 하루 움직였다.

관보 원문을 열어 조문을 직접 읽었다.

- **<https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-37-2026-nd-cp-468865.htm>**
  — 관보 제93호(2026-02-09). PDF·DOCX 원문 링크 보유. **1차 출처다.**
  `sourceTier: official`이 이제 실제로 성립한다
- <https://vanban.chinhphu.vn/?pageid=27160&docid=216764> — 정부 문서포털.
  서명본 `37-1.signed.pdf`와 부속서 `37-pl.pdf`

**서명본 PDF는 스캔 이미지라 텍스트가 나오지 않았다.** 관보의 DOCX를 받아
zip 로컬 헤더를 훑고 `word/document.xml`을 `inflateRawSync`로 풀어 266,344자를 얻었다.
전기전자에서 쓴 PDF zlib 추출이 막힐 때의 우회로다 — 관보는 DOCX를 같이 올린다.

읽은 조문 둘:

```
Điều 97. Hiệu lực thi hành
1. Nghị định này có hiệu lực thi hành kể từ ngày ký ban hành.

Điều 98. Quy định chuyển tiếp
4. Nhãn hàng hóa, bao bì thương phẩm … đã được sản xuất, in ấn trước thời điểm
   Nghị định này có hiệu lực được tiếp tục sử dụng, nhưng không quá 02 năm
   kể từ ngày Nghị định này có hiệu lực thi hành.
```

시행일은 **서명일 그날**(2026-01-23)이고, 경과규정은 **달력 날짜를 적지 않는다** —
"시행일부터 2년을 넘기지 않는다"뿐이다. 그래서 2차 출처가 갈렸다.
`mondial.vn`은 `Cách tính hiện tại là không quá 23/01/2028`로 23일을 적고,
`luatvietan.vn`은 `đến tháng 01/2028`로 뭉갠다.

**2028-01-23을 택한 근거**: 평이한 독법으로 2026-01-23의 2년 뒤가 2028-01-23이고,
"không quá 02 năm"(2년을 넘지 않는다)이므로 그날까지는 아직 2년 안이다.
민법(2015) 제147조 2항이 첫날을 세지 않아 기산일이 2026-01-24가 되고,
제148조 3항으로 마지막 해의 대응일에 끝나는 계산도 같은 날에 닿는다.
**시드의 2028-01-22는 하루를 두 번 뺀 값이다.**

`transitionNote`도 고쳤다. 달력 날짜만 적으면 그 날짜가 법령에 쓰여 있는 것처럼
읽히므로, 법이 실제로 뭐라고 쓰는지(시행일부터 2년)를 앞에 두고 계산 결과를 뒤에 붙였다.

**`changes`의 세 번째 항목을 원문에 맞게 조였다.** "위험도 등급에 따라 표시 항목이
달라짐"이라고만 적혀 있었는데, 제53조가 정하는 것은 더 구체적이다.

```
Điều 53. Nội dung ghi trong nhãn điện tử
1. 저위험 상품 — 제42조 1항의 필수 표시항목 전부를 전자라벨로 대체할 수 있다
2. 중·고위험 상품 — 다음은 반드시 물리적 라벨(nhãn vật lý)에 표시한다:
   a) 상품명  b) 책임 조직·개인의 명칭과 주소  c) 원산지  d) 경고 정보
   đ) 나머지 필수 항목은 전자라벨로 표시할 수 있다
```

수출자에게 이것이 실제 차이다 — "전자라벨이 허용된다"가 아니라
**"우리 제품 위험도에서는 네 항목을 여전히 인쇄해야 한다"**가 실행 정보다.
같은 원문에서 최소 글자 크기 `0,9 mm`(제52조 3항)도 확인했다.

---

# JP — 식품·음료 (`data/laws/JP-food.json`)

**조사일 2026-09-06 · 법령 5건 · 액션 15건 · 1차 5 / 2차 0**

첫 일본 조합이다. VN과 달리 **1차 출처만으로 5건을 다 채웠다** — 소비자청(`caa.go.jp`)과
후생노동성(`mhlw.go.jp`)이 소관 규정의 원문·해설을 직접 올린다.
베트남처럼 로펌·법률DB를 거칠 이유가 없었다.

## 이 조합이 데이터셋에 처음 넣은 것 둘

1. **`customs` 카테고리 법령** — `食品衛生法 第27条`(수입신고)이 첫 건이다.
   `Category` 타입에 `customs`가 있고 `CATEGORY_LABEL`에 `통관·관세`가 있는데
   실제 데이터가 없어 그 경로를 아무도 밟지 않았다. **밟자마자 버그가 나왔다** —
   DISCREPANCIES §101을 본다
2. **실재 D-Day가 있는 비(非)베트남 법령** — `내閣府令34/2026`의 알레르겐 경과조치
   2028-03-31이 D-572로 뜬다

## 채택

### 1. `内閣府令 第34号` — 食品表示基準 일부개정
`JP-2026-034` · 공포·시행 2026-04-01 · HIGH · **`official`**

카슈넛이 특정원재료(표시 의무)가 됐다. 경과조치 **2028-03-31**.

- **<https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/assets/food_labeling_cms201_260401_34.pdf>**
  — 소비자청이 올린 개정 내각부령 원문 PDF. **1차 출처다**
- <https://www.caa.go.jp/policies/policy/food_labeling/food_labeling_act/>
  (법령 목록 페이지. 위 PDF와 신구대조표 `..._260401_07.pdf`를 건다)
- <https://www.city.sendai.jp/sekatsuese-shokuhin/cashew-pistachio.html> ·
  <https://www.city.fukuoka.lg.jp/hofuku/hokensho/shokuhinanzen/allergy_hyouji.html>
  (센다이시·후쿠오카시 — 특정원재료 9품목, 경과조치 令和10년 3월 31일)
- <https://www.aussie-fan.co.jp/quality/mailmagazine/shokuhinhyojikijun-kaisei20260401>
  (별표 제3·4·5·19·20·22 개정, 알레르기 경과조치 2028-03-31 / 개별품목 2030-03-31)
- <https://www.label-bank.co.jp/blog/foodlabel/202604foodlabel> ·
  <https://foocom.net/secretariat/foodlabeling/26173/>
  (냉동식품 표시 위치, 개별품목 42품목)

**정식 명칭**은 `食品表示基準及び食品表示法第６条第８項に規定するアレルゲン、消費期限…
を定める内閣府令の一部を改正する内閣府令`(内閣府令第34号)이라 길다.
화면에는 `内閣府令34/2026`으로 적었다.

**원문 PDF는 열어 보았으나 텍스트가 나오지 않았다** — 압축 스트림이 2개뿐이고
본문이 이미지다. 그래서 내용은 **독립 출처 5곳(지자체 2 · 전문매체 3)** 의 교차확인으로
확정했고, `sourceTier: official`은 **URL이 소관 부처의 원문이라는 사실**에 근거한다
(§1-13). 관보 DOCX 우회로(§97)는 내각부령에는 쓸 수 없었다 — 부령은 관보에 실려도
`congbao` 같은 DOCX 병기 관행이 없다.

**`deadline`을 2028-03-31로 잡은 근거**: 이 개정에는 경과조치가 둘이다.
알레르겐 표시분이 2028-03-31, 개별품목 표시규칙분이 2030-03-31이다.
**알레르겐 쪽만 `deadline`에 넣었다.** 카슈넛 표시는 사전포장 식품 전체에 걸려
우리 제품 넷이 전부 대상이지만, 개별품목 규칙 42건에 우리 제품이 드는지는
확인하지 못했다(아래 참조). §91 규칙 — **그 날짜가 우리 제품의 날짜인지 확인한 뒤에 넣는다.**

**남긴 정밀도**: 개정된 42품목의 전체 목록을 확보하지 못했다. 확인된 예시는
`缶詰`·`トマト加工品`·`農産物漬物` 셋뿐이고, 유자청이 `ジャム類`로,
김치양념 소스가 `農産物漬物`로 걸리는지는 단정할 수 없다.
그래서 `changes`에는 "42품목의 개별규정을 개정하거나 삭제"라고만 적고
품목명을 우리 제품에 연결하지 않았다. 확인되면 이 조합에 HS 차등이 생긴다.

### 2. `食品衛生法 第12条` — 지정첨가물 외 사용 금지
`JP-1947-012` · 현행 조문 시행 2020-06-01 · **CRITICAL** · `official`

이 조합에서 가장 위험한 법령이다. 일본은 국가가 지정한 첨가물만 쓸 수 있고,
미지정 첨가물이 들어가면 **통관에서 폐기 또는 반송**된다. 라벨을 고쳐서 될 일이 아니라
**배합을 바꿔야 하는 문제**라 대응 기간이 가장 길다(액션 8주).

- **<https://www.caa.go.jp/policies/policy/standards_evaluation/food_additives>**
  — 소비자청 식품첨가물 소관 페이지. **1차 출처다.**
  `原則として、食品衛生法第12条に基づいて、内閣総理大臣の指定を受けた添加物
  (指定添加物)だけを使用することができます`
- <https://www.maff.go.jp/j/shokusan/sanki/soumu/attach/pdf/bunkakai-153.pdf>
  (농림수산성 — 일본식품첨가물협회 자료. 지정첨가물 472품목, 사용 가능한 것은
  지정첨가물·기존첨가물·천연향료·일반음식물첨가물 4종뿐)

**id와 `effectiveDate`에 대해**: `食品衛生法`은 昭和22년 법률 제233호(1947)라
id 연도를 1947로 두고 번호는 **조문 번호(第12条 → `012`)** 를 썼다.
`食品衛生法 第27条`(`JP-1947-027`)도 같은 규칙이다 — 같은 법률에서 나온 두 의무를
id로 구분해야 하는데, 조문 번호가 가장 자연스러운 식별자다.

`effectiveDate`는 **2020-06-01**로 적었다. 1947년 제정일을 쓰면 화면에
`1948.01.01 시행`이 뜨는데 그건 지금의 조문 체계가 아니다. 平成30년 법률 제46호
개정법이 시행되며 현행 조문 번호(第12条·第27条)가 성립한 날이 2020-06-01이다.
**의무 자체는 그보다 오래됐다는 사실은 숨기지 않는다** — `changes`가 빈 배열이라
화면에서 WHAT CHANGED 섹션이 사라지고, 이 법령이 "바뀐 것"이 아니라
"원래 지켜야 하는 것"으로 읽힌다(VN `QCVN 4:2009`와 같은 처리).

### 3. `器具・容器包装PL制度` — 합성수지 포장재 포지티브리스트
`JP-2018-046` · 완전시행 2025-06-01 · HIGH · `official`

- **<https://www.caa.go.jp/policies/policy/standards_evaluation/appliance/positive_list_new>**
  — 소비자청 「2025년 6월 1일 이후」 페이지. **1차 출처다**
- <https://www.caa.go.jp/policies/policy/standards_evaluation/appliance/positive_list>
  (「2025년 5월 31일까지」 — 경과조치 기간의 규정을 따로 남긴 페이지)
- <https://www.bfss.co.jp/media/column/kanri03> ·
  <https://www.asahi-so.co.jp/cat_topics/519/>
  (경과조치 만료 2025-05-31, 6월 1일 완전시행)

2020-06-01 도입 후 **5년 경과조치가 2025-05-31로 끝났다.** 지금은 별표 제1에
수록된 물질만 쓸 수 있다. 제1표가 합성수지 기재(폴리머) 21종, 제2표가 첨가제 840건
(令和6년 9월 27일 개정 기준)이다. 대상 재질은 **합성수지뿐**이고 종이·금속·고무·유리는
빠진다 — 유자청 유리병은 이 법령의 대상이 아니지만 뚜껑 라이너가 합성수지면 걸린다.

**`hsPrefixes`를 식품 전 범위로 뒀다.** 포장재 규제라 제품 HS로 갈리지 않는다.
공용 파일이 아니므로 빈 배열은 쓸 수 없다(§86).

`sourceTier: official`이고 `changes`에 경과조치 종료를 적었다 —
**이건 실제로 "바뀐 것"이다.** 2025-05-31까지는 시행 전과 같은 원재료를 계속 쓸 수 있었다.

### 4. `告示 第499号` — 잔류농약 포지티브리스트
`JP-2005-499` · 공포 2005-11-29 · 시행 2006-05-29 · HIGH · `official`

고춧가루·마늘·유자 같은 농산물 원료를 쓰는 이 조합에 실제로 걸린다.
**일본에 기준이 없는 농약은 일률기준 0.01ppm이 상한**이라, 한국에서 합법적으로 쓴
농약이 일본에서 위반이 되는 전형적인 함정이다.

- **<https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/zanryu/index.html>**
  — 후생노동성 잔류농약 페이지. 기준값 일람과 불검출 농약 목록. **1차 출처다**
- <https://www.caa.go.jp/policies/policy/standards_evaluation/pesticide_residues>
  (소비자청 — 2024년 식품위생기준행정 이관 후의 소관 페이지)
- <https://www.maff.go.jp/j/syouan/johokan/risk_comm/r_kekka_nouyaku/h180522/pdf/ref_data1.pdf>
  (농림수산성이 배포한 후생노동성 설명자료 — 平成17년 후생노동성 고시 제499호로
  758종의 잔류기준, 제497호로 일률기준 0.01ppm)

**연도 변환에 주의했다.** 검색 요약 하나가 `平成18年5月29日`을 2018-05-29로 옮겼는데
平成18년은 **2006년**이다(平成 원년 = 1989). 시행일을 2006-05-29로 적었다.

### 5. `食品衛生法 第27条` — 수입신고
`JP-1947-027` · 현행 조문 시행 2020-06-01 · MEDIUM · `official` · **첫 `customs` 법령**

신고 의무자는 일본 수입자이지만 **원재료표·제조공정표를 만드는 것은 수출자**다.
그래서 제외하지 않았다 — EPR에서 "의무자는 수입자이나 자료는 수출자에게서 나온다"고
판단한 것과 같은 기준이다.

- **<https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000144562.html>**
  — 후생노동성 식품등 수입절차. **1차 출처다.**
  `貨物の到着予定日の7日前から検疫所窓口において輸入届出を受け付けています`
- <https://www.forth.go.jp/keneki/tokyo/kanshi_hp/a002.html>
  (도쿄검역소 — 가공식품은 원재료·제조공정 설명서 필요)

## 제외 — 그리고 그 사유

### `加工食品の原料原産地表示制度` — 원료원산지 표시

**제외했다. 수입품은 대상이 아니다.**

2022-04-01 완전시행된 이 제도는 **국내에서 제조한 가공식품**에 걸린다.
수입품은 `原産国名`(원산국명)만 적으면 되고 원료의 원산지까지 적을 의무가 없다.
한국에서 만들어 완제품으로 수출하는 이 조합에는 해당하지 않는다.

- <https://www.nsouzai-kyoukai.or.jp/news/20220207/> (일본총채협회)
- <https://www.foods-ch.com/anzen/1641550553519/>

**규칙 8(HS 차등)을 지키려고 걸리지도 않는 법령을 넣지 않는다.**
VN-cosmetics에서 `93/2016`(베트남 국내 생산시설 요건)을 뺀 것과 같다.

### `HACCP に沿った衛生管理` — HACCP 의무화

**제외했다. 의무자가 일본 국내 영업자다.**

2021-06-01 완전의무화됐지만 대상은 `日本国内の食品等事業者`다. 미국 FSVP나 EU처럼
**수출국 시설 등록·수출국 정부 증명을 요구하지 않는다.** 한국 수출자가 직접 지는
의무가 아니라 뺐다. 수입자가 HACCP 체계를 갖추는 것은 수입자 쪽 일이다.

이 판단이 `originScope`가 이 조합에도 비어 있는 이유이기도 하다.

### `検査命令`(식품위생법 제26조 3항) — 검사명령

**제외했다. 2026-09-06 현재 한국산에 걸린 검사명령이 없다.**

후생노동성이 유지하는 검사명령 목록을 확인했다. 현재 게시된 최신 건은
2026-05-08자 **인도산 소르굼(아플라톡신)** 이고 **한국 항목은 없다.**
없는 것을 있다고 적지 않는다. 검사명령은 위반 적발 시 수시로 추가되므로
다음 재검증 때 다시 본다.

- <https://www.mhlw.go.jp/stf/newpage_73027.html> (검사명령 실시 공고)

### `栄養強化目的の添加物の表示免除規定の廃止`

**이번 개정에 넣지 않았다. 2차 출처가 갈린다.**

한 출처는 이 변경을 2026-04-01 개정의 일부라 하고, 다른 출처는 2025-03-28 공포분이라
한다(경과조치는 둘 다 2030-03-31로 일치). 소비자청 개정 원문이 이미지라 확인하지 못했다.
`changes`에 넣지 않고 남긴다 — **일치하지 않으면 기록하지 않는다**(§B-3 규칙 2).

우리 제품 관련성도 낮다. 강화 목적의 비타민·미네랄·아미노산을 쓰는 제품이 아니다.

## HS 차등 — 이 조합에는 없다

법령 5건이 전부 식품 전 범위다.

- 라벨 개정(알레르겐)·지정첨가물·잔류농약은 사전포장 식품 전체에 걸린다
- 포장재 PL은 제품 HS가 아니라 **포장 재질**로 갈린다. `hsPrefixes`로 표현할 수 없다
- 수입신고는 전 품목이다

VN-cosmetics(§83)와 같은 상황이다. **차등을 만들 근거가 없어서 만들지 않았다.**
개별품목 표시규칙 42품목의 목록을 확보하면 `内閣府令34/2026`에서 차등이 생길 수 있다.

## `originScope` — 이 조합에도 없다

일본은 식품 수입에 **수출국 정부 발행 위생증명서나 수출국 시설 등록을 요구하지 않는다**
(축산물·복어 등 일부 품목 제외). 우리 제품 넷은 그 예외에 들지 않는다.
3차 지시서가 예상한 "일본 식품(수출시설 등록)"은 **이 제품군에는 해당하지 않았다** —
축산물 가공품 조합이었으면 달랐을 것이다.

---

# JP — 화장품 (`data/laws/JP-cosmetics.json`)

**조사일 2026-09-06 · 법령 5건 · 액션 13건 · 1차 3 / 2차 2**
(공용 파일 2건을 합치면 화면에는 7건이 뜬다)

## 이 조합의 성격 — 라벨이 아니라 처방과 등록이 벽이다

베트남 화장품은 제품신고(`06/2011`)가 관문이었다. 일본은 관문이 **셋**이다.

1. **한국 제조소가 외국제조업자로 신고돼 있어야 한다** — 회사 등록의 문제
2. **처방이 화장품기준을 통과해야 한다** — 배합 자체를 바꿔야 할 수 있다
3. **전성분을 일본어 표시명칭으로 옮겨야 한다** — 한국 성분명이 그대로 통하지 않는다

셋 다 라벨 수정으로 끝나지 않아 대응 기간이 길다(각 6~8주 액션이 있다).

## 채택

### 1. `化粧品基準` — 배합금지·배합제한 성분
`JP-2000-331` · 平成12년 후생성고시 제331호 · CRITICAL · **`official`**

- **<https://www.mhlw.go.jp/content/000491511.pdf>** — 후생노동성이 올린 화장품기준
  전문 PDF. **1차 출처다**
- <https://www.mhlw.go.jp/web/t_doc?dataId=81aa1263&dataType=0&pageNo=1>
  (후생노동성 법령 데이터베이스 — 고시 본문)
- <https://www.boken.or.jp/find_tests/chemical_analysis/cosmetic/1125/> ·
  <https://www.boken.or.jp/find_tests/chemical_analysis/cosmetic/1124/>
  (보켄품질평가기구 — 배합금지 목록과 배합제한 목록)
- <https://www.jcia.org/user/public/knowledge/glossary/ingredient>
  (일본화장품공업회 — 배합 가능한 법정색소·방부제·자외선흡수제)

**네거티브리스트(배합금지)와 배합제한, 그리고 방부제·자외선흡수제·타르색소의
포지티브리스트**로 구성된다. 한국에서 합법인 성분이 일본에서 금지이거나
상한이 낮은 경우가 이 조합의 핵심 위험이라 CRITICAL로 뒀다.

**`changes`를 비웠다.** 가장 최근 개정은 `令和6년 후생노동성고시 제243호`(2024-07-12)로
시스테아민염산염을 **씻어내는 헤어세트료**에 100g 중 8.63g까지 허용한 것인데,
우리 기본 제품 넷(크림·립틴트·클렌징폼·샴푸) 중 헤어세트료가 없다.
**우리에게 걸리지 않는 개정을 WHAT CHANGED에 띄우면 화면이 거짓말을 한다**(§B-3 규칙 5·6).
기준 자체가 살아 있다는 사실은 이 문서에 남긴다.

- <https://www.mhlw.go.jp/web/t_doc?dataId=00tc8641&dataType=1&pageNo=1> (2024년 개정 통지)

### 2. `薬機法 第13条の3` — 외국제조업자 신고
`JP-1960-013` · 昭和35년 법률 제145호 · CRITICAL · `official`

**이 조합에서 수출자가 직접 지는 유일한 등록 의무다.**
한국 제조소가 PMDA를 거쳐 후생노동대신에게 신고돼 있지 않으면
일본 수입자가 제조판매업 허가를 갖고 있어도 그 제품을 팔 수 없다.

- **<https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iyakuhin/keshouhin/index.html>**
  — 후생노동성 화장품·의약부외품 페이지. **1차 출처다**
- <https://www.jetro.go.jp/world/qa/04M-010768.html>
  (JETRO — 화장품 수입 절차 전반. 수입자의 `化粧品製造販売業許可`(제12조),
  포장·표시·보관을 하면 `化粧品製造業許可`(제13조), 외국제조업자는 제13조의3,
  품목별 `化粧品製造販売届`)

**`effectiveDate`를 2014-11-25로 적었다.** 薬事法이 `医薬品医療機器等法`으로
전면 개정돼 시행된 날이다. 1960년 제정일을 쓰면 화면에 `1960.08.10 시행`이 뜨는데
그건 지금의 조문 체계가 아니다 — JP-food의 `食品衛生法` 두 건과 같은 처리다(§103).

**id 번호는 조문 번호다** — `第13条の3` → `013`, `第61条` → `061`, `第66条` → `066`.
같은 법률에서 셋을 뽑았으므로 법률 번호(145)로는 가를 수 없다.

### 3. `厚生省令 第30号` — 법정 타르색소
`JP-1966-030` · 昭和41년 8월 31일 후생성령 제30호 · HIGH · `official`

- **<https://laws.e-gov.go.jp/law/341M50000100030>** — e-Gov 법령검색(총무성 운영)의
  성령 원문. **1차 출처다**
- <https://www.boken.or.jp/find_tests/chemical_analysis/cosmetic/1121/>
  (화장품에 쓸 수 있는 색소의 분류 — 점막 사용 여부로 갈린다,
  적색219호·황색204호는 `毛髪及び爪のみに使用される化粧品に限り`)
- <https://cosmetic-ingredients.org/colorants/certified-colors/> (법정색소 83종)
- <https://www.tmiph.metro.tokyo.lg.jp/files/k_yakuji/k_kanshi/i-sinsa/cosmetics/hinmoku/taru.pdf>
  (도쿄도가 올린 성령 전문 PDF — 텍스트 추출은 실패했다)

**e-Gov는 SPA라 WebFetch로 본문을 읽지 못했다.** URL은 정부 원문이므로
`sourceTier: official`이지만(§1-13), 내용은 보켄품질평가기구와 화장품성분온라인으로
교차확인했다. §102가 정리한 대로 **등급은 출처의 신원이지 우리가 읽어냈는지가 아니다.**

**남긴 정밀도**: 별표가 몇 개이고 각각이 무엇을 허용하는지는 출처마다 서술이 엇갈려
`changes`나 `title`에 별표 번호를 쓰지 않았다. 확정된 사실 셋만 적었다 —
83종만 허용 / 점막에 쓰이는 화장품은 범위가 더 좁다 / 적색219호·황색204호는 모발·손톱 전용.

### 4. `薬機法 第61条` — 전성분 표시
`JP-1960-061` · HIGH · `secondary`

- <https://www.tmiph.metro.tokyo.lg.jp/k_yakuji/i-kanshi/c_label/>
  (도쿄도 건강안전연구센터 — 법정표시 항목 5호와 근거 조문.
  성분표시는 후생노동성고시 제332호, 배열 규칙은 의약심발 제163호·의약감마발 제220호)
- <https://health-beauty-soleil.jp/cosme-hyouji/> ·
  <https://marketstyles.co.jp/regulations/regulations_02_03/> (법정표시 항목 확인)

직접 용기·직접 피포에 **제조판매업자명·주소 / 판매명 / 제조번호 / 전성분 / 사용기한**을
적어야 한다. 성분은 **일본화장품공업회의 표시명칭 목록**을 따르고
**배합량 내림차순**으로, 1% 이하 성분과 착색제는 순서가 자유롭다.

**`sourceTier: secondary`.** 도쿄도는 지자체다. VN-cosmetics에서 지자체 정부 포털을
보수적으로 `secondary`로 둔 것과 같은 기준이다(§1-13). 근거가 되는 고시 제332호의
원문 URL은 확보하지 못했다.

### 5. `薬機法 第66条` — 허위·과대광고 금지
`JP-1960-066` · MEDIUM · `secondary`

- <https://www.pref.kyoto.jp/yakumu/koukoku/yakihoujyoubun.html>
  (교토부 약무과 — 광고 관련 薬機法 조문 발췌)
- <https://www.jcia.org/user/common/download/business/advertising/JCIA20200615_ADguide.pdf>
  (일본화장품공업연합회 화장품등의 적정광고 가이드라인)
- <https://www.kokusen.go.jp/wko/pdf/wko-202509_09.pdf>
  (국민생활센터 — 薬機法 광고규제 해설)

화장품이 표방할 수 있는 효능효과는 후생노동성 의약식품국장 통지가 정한 **56항목**뿐이다.
한국에서 쓰던 문구가 그대로는 위법이 되는 전형적인 함정이라 액션을 문구 재작성으로 잡았다.
56항목 중 마지막 `(56) 건조에 의한 잔주름을 눈에 띄지 않게`는 **일본향장품학회
기능평가 가이드라인에 따른 시험을 통과한 제품만** 표방할 수 있어 별도 액션으로 뺐다.

`sourceTier: secondary` — 지자체 페이지이고, 56항목 통지의 후생노동성 원문 URL은
확보하지 못했다.

## 제외 — 그리고 그 사유

### `医薬部外品`(약용 화장품) 승인

**제외했다. 우리 기본 제품이 표방 대상이 아니다.**

`薬用シャンプー`·`薬用洗顔料`처럼 **약용을 표방하면** 화장품이 아니라 의약부외품이 되어
품목별 제조판매 **승인**(신고가 아니다)이 필요하고 심사에 수개월이 걸린다.
기본 제품 넷은 약용 표방이 없는 일반 화장품이라 대상이 아니다.

다만 **경계가 문구 하나로 갈린다** — 샴푸에 `フケ・かゆみを防ぐ`를 붙이면 의약부외품이 된다.
그래서 이 사실을 `薬機法 第66条`의 액션(문구 재작성)에 녹였다. 별도 법령으로 세우면
지금 걸리지 않는 규제를 걸리는 것처럼 보여주게 된다.

### `薬機法` 2025년 개정 (令和7년 5월 21일 공포)

**제외했다. 화장품에 걸리는 부분이 확인되지 않는다.**

2026-05-01·2026-11-20 등으로 단계 시행되는 큰 개정이지만 확인된 내용은
**의약품 판매제도**(요지도의약품 온라인 판매, 지정남용방지의약품), 공급 안정 체제 의무,
약감증명 제도 법제화다. 화장품 제조판매·수입 절차를 바꾸는 조항을 찾지 못했다.

없는 것을 있다고 적지 않는다. 다음 재검증에서 시행 규칙이 나오면 다시 본다.

- <https://regulatory-j.com/act_implementation_20260501/>
- <https://www.mhlw.go.jp/stf/web_magazine/closeup/20.html>

## HS 차등 — 이 조합에도 없다

법령 5건이 전부 화장품 전 범위다. VN-cosmetics(§83)와 같은 결론이지만 **이유가 다르다.**

일본 화장품 규제는 실제로 제품을 가른다 — 화장품기준의 배합상한과 법정색소의 허용범위가
**① 점막에 사용되는 것(립 제품) ② 점막에 쓰이지 않고 씻어내지 않는 것(크림)
③ 씻어내는 것(클렌징폼·샴푸)** 으로 갈린다. 우리 제품 넷이 그 셋에 정확히 흩어진다.

**그런데 그 축은 HS 코드가 아니라 사용 부위다.** `3304`는 립틴트(3304.10)와
수분크림(3304.99)을 같이 담고, 씻어내는지 여부는 어느 HS 자릿수에도 나타나지 않는다.
없는 구분을 만드는 대신 **액션 문구에 넣었다** — `점막용·씻어내는 제품은 상한이 다르다`,
`립 제품의 색소를 점막 사용 가능 범위로 좁혀 재확인`.

§83이 화장품에서 "성분 규제는 처방의 문제라 hsPrefixes로 표현할 수 없다"고 한 것과
같은 벽이다. **차등이 없는 것이 아니라 HS로 표현할 수 없는 차등이다.**

## `originScope` — 이 조합에도 없다

외국제조업자 신고는 출발국을 가리지 않는다. 어느 나라 제조소든 같은 절차다.

---

# JP — 공용 (`data/laws/JP-shared.json`)

**조사일 2026-09-06 · 법령 2건 · 액션 5건 · 1차 1 / 2차 1**

둘 다 포장재 규제다. 식품·화장품·전기전자 포장에 모두 걸려 §85가 만든 자리에 들어간다.
`hsPrefixes`는 빈 배열이다 — 포장 규제는 제품 HS와 무관하다(§86).

## `資源有効利用促進法` — 식별표시 의무
`JP-1991-048` · 平成3년 법률 제48호 · 식별표시 시행 2001-04-01 · HIGH · `official`

**수출자가 직접 실행하는 의무다.** 프라마크(플라스틱)·종이마크를 **포장 도안에 인쇄**해야
하므로 한국에서 인쇄판을 만들 때 들어가야 한다. 일본 수입자가 대신 해 줄 수 없다.

- **<https://www.meti.go.jp/policy/recycle/main/admin_info/law/02/faq.html>**
  — 경제산업성 3R정책 「용기포장 식별표시 Q&A」. **1차 출처다**
- <https://www.meti.go.jp/policy/recycle/main/data/pamphlet/pdf/pamphlet_mark_gimu.pdf>
  (경제산업성 — 마크 표시 규격 안내)
- <https://www.jcpra.or.jp/law/display.html> (용리법과 식별표시의 관계)
- <https://www.pprc.gr.jp/pla-mark/about.html> (프라마크 대상 범위)

**주의**: `curl`이 `meti.go.jp`에 403을 돌려준다. 기본 User-Agent를 막는다.
브라우저 UA를 붙이면 200이다. **URL이 죽은 것이 아니다.**

## `容器包装リサイクル法` — 재상품화 의무
`JP-1995-112` · 平成7년 법률 제112호 · 완전시행 2000-04-01 · MEDIUM · `secondary`

- <https://www.jcpra.or.jp/law/duty/specified/> (일본용기포장리사이클협회 — 지정법인.
  `特定容器利用事業者`·`特定容器製造等事業者`·`特定包装利用事業者`의 정의,
  소규모사업자 적용제외 기준)
- <https://www.env.go.jp/recycle/yoki/dd_3_docdata/docdata_01.html> (환경성 — 지정법인)
- <https://www.maff.go.jp/j/shokusan/recycle/youki/attach/pdf/index-89.pdf> (농림수산성 안내)

**의무자는 한국 수출자가 아니다.** 확인한 사실이다 — 일본에 거점이 없는 해외 제조자는
`特定事業者`가 아니고, 용기포장을 붙인 상품을 **수입해 파는 일본 사업자**가 의무를 진다.
적용제외는 제조업 기준 종업원 20명 이하 **또는** 매출 2.4억 엔 이하,
상업·서비스업 기준 5명 이하 **또는** 7천만 엔 이하다.

**그래도 넣었다.** 수입자가 재상품화 의무량을 산정하려면 **재질별 포장 중량 자료**가
필요하고 그건 수출자에게서만 나온다. VN `DECREE 110/2026`(EPR)에서
"의무자는 수입자이나 자료는 수출자에게서 나온다"고 판단한 것과 같은 기준이다.
액션 제목도 그 사실을 숨기지 않는다 — `의무자는 일본 수입자지만 자료는 수출자가 낸다`.

`sourceTier: secondary`. 지정법인은 부처가 아니다. 환경성·농림수산성 페이지가 있으나
둘 다 법을 소개하는 안내 자료라 원문이 아니다.

## 제외 — `プラスチック資源循環促進法`

**제외했다. 대상이 다르다.**

2022-04 시행된 이 법의 `特定プラスチック使用製品` 12품목은 포크·스푼·빨대·칫솔·
옷걸이처럼 **소매·숙박·음식 사업자가 무상 제공하는 물품**이다.
한국에서 완제품을 수출하는 이 데이터셋의 사용자에게 걸리는 조항을 찾지 못했다.

---

# JP — 전기·전자 (`data/laws/JP-electronics.json`)

**조사일 2026-09-06 · 법령 4건 · 액션 12건 · 1차 4 / 2차 0**
(공용 파일 2건을 합치면 화면에는 6건이 뜬다)

## 데이터셋에서 가장 강한 HS 차등이 여기서 나왔다

법령 넷이 제품 넷을 **서로 다르게** 가른다. 원문 목록에서 품목명을 직접 확인해 얻은 결과다.

| 법령 | 걸리는 제품 | hsPrefixes |
|---|---|---|
| 電気用品安全法 | 전기밥솥 · LED 전구 · 보조배터리 | `8507` `8516` `8539` |
| 省エネ法 | 전기밥솥 · LED 전구 | `8516` `8539` |
| 家庭用品品質表示法 | **전기밥솥만** | `8516` |
| 電波法 (技適) | **무선 이어폰만** | `8518` |

화면에서 `제품 3 / 2 / 1 / 1`로 뜬다. VN-electronics의 `제품 4 / 1 / 2 / 1`(§90)보다도
갈래가 뚜렷하다 — **무선 이어폰은 전안법 대상이 아니고, 전기밥솥은 네 법령 중 셋에 걸린다.**

## 채택

### 1. `電気用品安全法` — PSE
`JP-1961-234` · 昭和36년 법률 제234호 · 시행 2001-04-01 · CRITICAL · **`official`**

- **<https://www.meti.go.jp/policy/consumer/seian/denan/non_specified_electrical.html>**
  — 경제산업성 「특정전기용품 이외의 전기용품(341품목) 일람」. **1차 출처다.**
  **HTML을 내려받아 품목명을 직접 검색했다**
- <https://www.meti.go.jp/policy/consumer/seian/denan/specified_electrical.html>
  (특정전기용품 116품목 — 우리 제품은 여기 없다)
- **<https://www.meti.go.jp/policy/consumer/seian/denan/mlb_faq.html>**
  — 경제산업성 모바일배터리 FAQ. **1차 출처다.** 사업자 의무와 적용 기술기준
- <https://www.meti.go.jp/policy/consumer/seian/denan/file/PSE_gaiyo.pdf>
  (2026년 2월판 제도 개요)

**원문 목록에서 확인한 품목 셋** (§90의 부속서 확인과 같은 작업이다):

```
 96  電気がま            電気がま及び電気ジャー
289  エル・イー・ディー・ランプ  定格消費電力が1W以上のものであつて、一の口金を有するものに限る
341  リチウムイオン蓄電池   単電池一個当たりの体積エネルギー密度が400Wh/L以上のものに限り、
                          自動車用・原動機付自転車用・医療用機械器具用・産業用機械器具用を除く
```

**무선 이어폰은 341품목 어디에도 없다.** 전안법이 아니라 전파법 소관이다.
2차 출처만 봤으면 "전자제품이니 PSE"로 뭉갰을 것이다.

**세 제품 모두 `特定電気用品以外`(원형 PSE)** 라 등록검사기관의 적합성검사는 필요 없다.
대신 제3조 사업신고, 제8조 기술기준 적합 확인과 **외관·출력전압 전수검사 + 3년 기록보존**,
제27조 표시 의무가 걸린다. FAQ 원문 그대로다.

보조배터리의 기술기준은 `별표 제12`의 `J62368-1(2023)[JIS C 62368-1:2021+추보1(2022)]`이고
리튬이온축전지 기준 `J62133-2(2021)[JIS C62133-2:2020]` 적용도 가능하다.

`changes`를 비웠다. 리튬이온축전지가 대상에 들어온 것은 2008년이고, 지금 예정된 개정은
아직 법이 아니다(아래 제외 참조).

### 2. `電波法` — 기술기준적합증명(기적마크)
`JP-1950-131` · 昭和25년 법률 제131호 · 시행 1950-06-01 · CRITICAL · `official`

**무선 이어폰 하나만 걸린다.** 블루투스 모듈이 있으면 등록증명기관의
`技術基準適合証明` 또는 양산용 `工事設計認証`을 받아야 하고, 없으면 판매는커녕
일본 국내에서 전파를 내는 것 자체가 위법이다.

- **<https://www.tele.soumu.go.jp/j/adm/monitoring/summary/qa/giteki_mark/>**
  — 총무성 전파이용포털 「기적마크 Q&A」. **1차 출처다**
- <https://www.jet.or.jp/law/wave/index.html> (전기안전환경연구소 — 전파법 검사·인증)
- <https://www.musen-connect.co.jp/blog/course/other/japan-radio-law-basic/>
  (기적마크 표시 의무와 기적번호)

**액션 기간을 10주로 잡았다.** 이 조합에서 가장 긴 리드타임이다 — 인증이 양산 전에
끝나야 하는데 모듈을 바꾸면 처음부터 다시다. 그래서 설계변경 절차에 재인증 판정을
명문화하는 액션을 따로 뒀다.

### 3. `省エネ法` — 톱러너 제도
`JP-1979-049` · 昭和54년 법률 제49호 · 톱러너 시행 1999-04-01 · HIGH · `official`

- **<https://www.enecho.meti.go.jp/category/saving_and_new/saving/enterprise/equipment/>**
  — 자원에너지청 「에너지소비기기 제조사업자등의 성에너지법 규제」. **1차 출처다**
- <https://www.enecho.meti.go.jp/about/special/johoteikyo/shoene_led.html>
  (자원에너지청 — LED 조명이 성에너지 기준 대상에 들어온 경위)
- <https://www.eccj.or.jp/machinery/toprunner/toprunner.pdf> (성에너지센터 — 톱러너 기준 해설)
- <https://ja.wikipedia.org/wiki/トップランナー方式>
  (1998년 6월 개정으로 도입, 1999년 4월 시행 — 위 두 출처와 일치)

대상 32품목에 **ジャー炊飯器**(전기밥솥)와 **電球形LEDランプ**가 들어 있다.
의무자는 `製造事業者等`인데 여기에 **수입사업자가 포함된다.**

**`deadline`을 넣지 않았다.** 「電球形LEDランプ에 2027년도를 목표연도로 하는 새 기준」이라는
서술을 한 곳에서 봤지만 **독립 출처 하나뿐이고**, 「2027년도」는 회계연도라 종료일이
2028-03-31인지도 확인하지 못했다. §B-3 규칙 2·7 — 확인되지 않은 날짜는 넣지 않는다.
목표연도가 확정되면 이 조합에 실재 D-Day가 생긴다.

### 4. `家庭用品品質表示法` — 전기기계기구 품질표시규정
`JP-1962-104` · 昭和37년 법률 제104호 · 시행 1962-10-01 · MEDIUM · `official`

**전기밥솥 하나만 걸린다.** 대상 17품목 중 `ジャー炊飯器`가 5번이고
LED 전구·이어폰·보조배터리는 없다.

- **<https://www.caa.go.jp/policies/policy/representation/household_goods/law/law_06/>**
  — 소비자청 「전기기계기구 품질표시규정」. **1차 출처다.**
  17품목 목록과 밥솥의 표시 9항목을 여기서 직접 확인했다
- <https://www.caa.go.jp/policies/policy/representation/household_goods/list> (대상 품목 일람)
- <https://www.shouhiseikatu.metro.tokyo.lg.jp/torihiki/hyoji/documents/kahyohandbook3003.pdf>
  (도쿄도 가정용품품질표시법 핸드북 — 전기기계기구 편)

밥솥의 표시 9항목: **최대취반용량 · 구분명 · 증발수량 · 연간소비전력량 ·
1회당 취반시 소비전력량 · 1시간당 보온시 소비전력량 · 1시간당 타이머예약시 소비전력량 ·
1시간당 대기시 소비전력량 · 사용상 주의**.

**성에너지법과 항목이 겹친다.** 소비전력량 계열은 성에너지법의 산정과 같은 측정에서 나온다.
그래도 법령을 합치지 않았다 — 소관 부처가 다르고(소비자청 / 자원에너지청)
성에너지법은 LED 전구에도 걸리는데 이 법은 안 걸린다.

## 제외 — 그리고 그 사유

### ⚠ `電気用品安全法` 모바일배터리 규제 강화 (2027년 3월 예정)

**제외했다. 아직 법이 아니다. 다음 재검증에서 가장 먼저 볼 항목이다.**

경제산업성이 모바일배터리를 `特定電気用品以外`(원형 PSE)에서 **`特定電気用品`(마름모 PSE)**
로 옮기려 하고 있다. 그렇게 되면 **등록검사기관의 적합성검사가 추가로 의무화**되고,
기술기준도 이물혼입·전극 감김 어긋남 방지 등 제조품질 관리까지 넓어진다.
사고 보고가 2021년 51건에서 2025년 192건으로 늘어난 것이 배경이다.

**보도된 일정은 2026년도 내 정령·성령 개정, 2027년 3월 시행 「예정」이다.**
2026-09-06 현재 경제산업성 모바일배터리 FAQ는 여전히 제3조 신고·제8조 전수검사
체계만 설명하고 개정을 언급하지 않는다. **공포되지 않은 것을 `scheduled`로 넣으면
없는 시행일을 지어내야 한다.**

VN RoHS 초안(§제외)·화장품 관리 시행령 초안·개정 식품안전법과 같은 처리다.
다만 **영향이 크다** — 마름모 PSE가 되면 리드타임이 몇 달 늘어난다.

- <https://www.meti.go.jp/shingikai/sankoshin/hoan_shohi/seihin_anzen/pdf/017_02_00.pdf>
  (산업구조심의회 제품안전소위 令和7년 3월 21일 「제품안전규제의 재검토」)
- <https://www.nikkei.com/article/DGXZQOUA312JN0R30C26A8000000/> (2026-08 보도)
- <https://voltechno.com/blog/pse-2026-transition/>

### `J-Moss`(자원유효이용촉진법 특정화학물질 함유표시)

**제외했다. 대상 7품목에 우리 제품이 없다.**

일본판 RoHS로 불리지만 **함유 표시 제도이지 사용 제한이 아니고**, 대상은
PC·에어컨·TV·냉장고·세탁기·전자레인지·의류건조기 7품목뿐이다.
밥솥·LED전구·이어폰·보조배터리는 대상이 아니다.

- <https://home.jeita.or.jp/eps/epsJmoss.html> · <https://ja.wikipedia.org/wiki/J-MOSS>

**EU RoHS를 아는 담당자가 "일본에도 RoHS가 있다"로 넘겨짚기 쉬운 지점이라 사유를 남긴다.**

### `家電リサイクル法`

**제외했다. 대상은 에어컨·TV·냉장고·세탁기 4품목뿐이다.**

### `消費生活用製品安全法`의 특정제품(PSC 마크)

**제외했다. 특정제품 목록에 우리 제품이 없다.** 유아용 침대·라이터·욕조용 온수순환기 등이다.

### 리튬이온전지 국제운송(UN38.3 · IMDG SP188)

**제외했다. 일본의 수입 규제가 아니다.**

보조배터리를 배로 보내려면 UN38.3 시험성적서와 IMDG 코드 특별규정 188 충족이 필요한 것은
맞지만, 이것은 **국제 운송 기준**이고 일본 법령으로는 위험물선박운송및저장규칙이 받는다.
확보한 출처가 물류업체 블로그와 공사(公社) 안내뿐이라 1차 근거가 없고,
무엇보다 **일본이 한국 수출자에게 부과하는 요건이 아니다** — 선적 단계의 요건이라
출발국·경유지 규정이 함께 걸린다. 이 데이터셋의 범위 밖으로 판단했다.

## `originScope` — 이 조합에도 없다

PSE도 기적도 성에너지도 출발국을 가리지 않는다. 어느 나라에서 만들었든 같은 절차다.

---

# US — 식품·음료 (`data/laws/US-food.json`)

**조사일 2026-09-06 · 법령 6건 · 액션 17건 · 1차 5 / 2차 1**

## 이 조합이 처음 채운 것 둘

1. **실기한 D-116** — FDA 식품시설 등록 격년 갱신 창구가 **2026.10.01~12.31**이다.
   데이터셋에서 가장 급한 날짜다
2. **`originScope`** — 한미 FTA 원산지증명은 출발국이 한국일 때만 걸린다.
   §69가 만든 `hiddenByOrigin` 경로가 여기서 처음 실행된다

## 채택

### 1. `21 CFR 1 Subpart H` — 식품시설 등록·격년 갱신
`US-2003-225` · 시행 2003-12-12 · **CRITICAL** · **`deadline: 2026-12-31`** · `official`

- **<https://www.fda.gov/food/online-registration-food-facilities/food-facility-registration-user-guide-biennial-registration-renewal>**
  — FDA 갱신 사용자 안내. **1차 출처다.**
  `beginning on October 1 and ending on December 31 of each even-numbered year`
  `If a registration is not renewed by 11:59 PM on December 31 of the even-numbered year,
  the registration is considered expired and will be removed from your account`
- <https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/registration-food-facilities-and-other-submissions>

**미국에 식품을 수출하는 모든 해외 시설이 FDA에 등록하고 미국 대리인(U.S. Agent)을
지정해야 한다.** 등록이 소멸하면 제품이 항구에서 멈춘다.

**`deadline`을 2026-12-31로 넣은 근거**: FDA가 달력 날짜를 문장으로 명시한다.
§91이 요구하는 "우리 제품의 날짜인가"도 충족한다 — 품목을 가리지 않고 모든 해외
식품시설에 걸린다. 액션 `US-a-225-01`에는 **`dueDate`도 넣었다.**
데이터셋에서 `dueDate`가 `null`이 아닌 첫 액션이다(§71 이후 처음).

### 2. `FASTER Act · 21 CFR 101` — 참깨가 9번째 주요 알레르겐
`US-2021-101` · 서명 2021-04-23 · 시행 2023-01-01 · HIGH · `official`

**이 조합에서 우리 제품에 가장 직접 걸리는 변경이다.** 조미김에는 참깨·참기름이 들어가고
장류에도 흔하다.

- **<https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101>**
  — 미국 연방규정집 원문. **1차 출처다**
- <https://www.fda.gov/food/food-allergies/faster-act-sesame-ninth-major-food-allergen>
- <https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-questions-and-answers-regarding-food-allergen-labeling-edition-5>
  (알레르겐 표시 Q&A 제5판)
- <https://www.canr.msu.edu/news/the-faster-act-sesame-as-major-food-allergen> (미시간주립대 확장)

**라벨 표시만이 아니다.** 주요 알레르겐이 되면 교차접촉 방지 등 제조 요건이 같이 걸린다.
FDA가 "참깨를 일부러 넣고 라벨로 갈음하는" 회피 행위를 지적하는 지침을 냈기에
액션에 처방 기준 명문화를 넣었다.

`id`를 `US-2021-101`로 한 것은 FASTER Act 서명 연도(2021)에 근거 조문 번호(21 CFR **101**)를
붙인 것이다. 일본에서 조문 번호를 id 번호로 쓴 것과 같은 규칙이다(§103).

### 3. `21 CFR 108.25 · 114` — 산성화식품
`US-1979-114` · 공포 1979-03-16 (44 FR 16235) · 시행 1979-05-15 · HIGH · `official`
**hsPrefixes `["2103"]` — 이 조합의 유일한 HS 차등이다**

- **<https://www.fda.gov/food/registration-food-facilities-and-other-submissions/establishment-registration-process-filing-acidified-and-low-acid-canned-foods-lacf>**
  — FDA 산성화식품·저산성통조림 등록/공정신고 페이지. **1차 출처다.**
  `Form FDA 2541e`로 용기 규격별 살균공정(scheduled process)을 신고한다
- <https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-114> (21 CFR 114 원문)
- <https://www.eurofinsus.com/food-testing/resources/acidified-foods-definitions-and-regulations/>
  (`acidified foods`의 정의 — 수분활성도 0.85 초과 + 평형 pH 4.6 이하)
- <https://extension.psu.edu/acidified-and-low-acid-food-regulatory-requirements>
  (21 CFR 108·113·114가 1979-05-15에 발효)

**소스·장류(2103)만 걸린다.** 조미김은 건조식품이라 수분활성도가 0.85를 넘지 않고,
유자청은 산을 첨가하지 않은 산성식품(acid food)이라 산성화식품 정의에 들지 않는다.

**단정하지 않은 것**: 고추장의 실제 평형 pH가 4.6 이하인지, 산을 첨가하는지는
제조사 처방에 달렸다. 4.6을 넘으면 산성화식품이 아니라 **저산성식품(LACF)** 이 되어
요건이 더 무거워진다. 그래서 첫 액션을 "pH와 수분활성도를 재라"로 잡았다 —
**어느 쪽인지 정하는 것 자체가 첫 번째 할 일이다.**

### 4. `21 CFR 1 Subpart L (FSVP)` — 해외공급자 검증
`US-2017-500` · 최종규칙 2015-11-27 · 최초 준수일 2017-05-30 · HIGH · `official`

- **<https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-foreign-supplier-verification-programs-fsvp-importers-food-humans-and-animals>**
  — FDA FSMA 최종규칙 페이지. **1차 출처다**
- <https://www.fda.gov/food/food-safety-modernization-act-fsma/final-rule-foreign-supplier-verification-programs-fsvp-key-requirements>

**의무자는 미국 수입자다.** 그래도 넣었다 — 수입자가 검증하려면 **위해분석·예방관리
문서와 현장평가 수용을 수출자가 내놔야 한다.** VN EPR·JP 容リ法과 같은 기준이다(§108).

### 5. `21 CFR 1 Subpart I` — 수입식품 사전신고
`US-2003-276` · 시행 2003-12-12 · MEDIUM · `official` · `customs`

- **<https://www.fda.gov/industry/fda-import-process/prior-notice-imported-foods>** — **1차 출처다**
- <https://www.fda.gov/industry/prior-notice-imported-foods/filing-prior-notice-imported-foods>

FDA가 도착 전에 사전신고를 접수·확인해야 항구에서 풀린다. 제출 창구는
CBP의 ABI/ACE로 최대 도착 30일 전, FDA PNSI로 최대 15일 전이다.

### 6. `KORUS FTA · 19 CFR 10` — 한미 FTA 원산지증명
`US-2012-010` · 발효 2012-03-15 · MEDIUM · `secondary` · **`originScope: ["KR"]`**

**데이터셋 최초의 `originScope`다.** 한미 FTA 특혜관세는 **출발국이 한국일 때만** 성립한다.
일본·베트남 출발 프로필에서는 이 법령이 목록에서 빠지고 S2 하단에
`출발국 KR 외에는 수출국별 요건 데이터가 아직 없습니다`가 뜬다(§69).

- <https://www.customs.go.kr/ftaportalkor/cm/cntnts/cntntsView.do?mi=3318&cntntsId=997>
  (관세청 FTA포털 — 한-미 FTA 원산지증명 실무. 자율발급, 5년 보관)
- <https://www.cbp.gov/trade/free-trade-agreements/korea> (미국 CBP — KORUS)

**`sourceTier: secondary`인 이유**: 출처가 **한국 관세청**이다. 미국의 요건을 설명하는
한국 정부 자료는 1차가 아니다. CBP 페이지는 살아 있으나 원산지증명 실무 절차를
이 수준으로 적지 않는다. §1-13의 기준 — **소관 당국의 원문일 때만 `official`이다.**

원산지증명서는 **정해진 서식이 없고 수출자가 직접 작성**한다. 그 대신 CBP의 사후검증에
대비해 BOM·제조공정도·원재료 수급명세를 5년 보관해야 하고, 없으면 특혜가 취소되고
MFN 관세와 이자·과태료가 붙는다.

## 제외 — 그리고 그 사유

### `FSMA 204` 식품 이력추적 규칙

**제외했다. 우리 제품이 Food Traceability List에 없다.**

준수일도 원래 2026-01-20에서 **2028-07-20으로 30개월 연기**됐다
(2025-08-07 연방관보 최종규칙, 그리고 2026 회계연도 지속예산법이 그 전 집행을 금지).

FTL은 치즈·껍질달걀·견과버터·신선 채소과일·수산물·즉석 델리샐러드를 담는다.
소스·조미김·고추장·유자청은 목록에 없다. **"목록 식품을 원재료로 담은 식품"도 대상인데,
고추장의 고춧가루는 FTL의 `Peppers (fresh)`가 아니라 건조·발효품이다.**

- <https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods>
- <https://www.federalregister.gov/documents/2025/08/07/2025-14967/requirements-for-additional-traceability-records-for-certain-foods-compliance-date-extension>

**다음 재검증에서 볼 것**: FDA가 FTL을 개정하면 장류·소스가 들어올 수 있다.

### `"Healthy"` 영양강조표시 최종규칙

**제외했다. 쓸 때만 걸리는 임의 표시다.**

2025-04-28 발효, 준수일 **2028-02-25**. 그런데 `healthy`를 라벨에 **쓰겠다고 정한 제품에만**
적용된다. 안 쓰면 아무 의무가 없다. 모든 제품에 걸리는 것처럼 `deadline`을 붙이면
D-Day가 거짓이 된다.

- <https://www.fda.gov/food/hfp-constituent-updates/fda-finalizes-updated-healthy-nutrient-content-claim>

### 전면 표시(Front-of-Package) 영양표시

**제외했다. 아직 제안규칙이다.** 2025-01-16 제안, FDA는 2026년 봄 최종규칙을 예고했으나
2026-09-06 현재 최종규칙 공표가 확인되지 않는다. 준수일은 최종규칙 발효 후
연매출 1천만 달러 이상 3년 / 미만 4년이라 지금은 계산할 수 없다.

### 한국산 대상 Import Alert

**제외했다. 우리 제품군에 걸린 것이 없다.**

FDA의 국가별 Import Alert 목록에서 한국 항목 49건을 확인했다. 수산물·주스·버섯
(팽이버섯 리스테리아)·산성화식품·통조림·식품첨가물·알레르겐 미표시 등인데
**소스·조미김·장류·과일가공품을 지목한 알림은 없다.**

없는 것을 있다고 적지 않는다. Import Alert는 적발 시 수시로 추가되므로 재검증 항목이다.

- <https://www.accessdata.fda.gov/cms_ia/country_KR.html>

## `originScope` — 예상은 맞았고 이유는 달랐다

3차 지시서는 **"미국 식품(FSVP·시설등록)에서 나올 가능성이 높다"** 고 예상했다.
**그 둘은 아니었다.** FSVP도 시설등록도 출발국을 가리지 않는다 —
미국 밖 어느 나라에서 오든 똑같이 걸린다.

실제로 나온 것은 **FTA**였다. 특혜관세는 협정 상대국에서 출발한 물품에만 성립하므로
`originScope`가 정확히 이 경우를 위한 필드다.

---

# US — 화장품 (`data/laws/US-cosmetics.json`)

**조사일 2026-09-06 · 법령 5건 · 액션 13건 · 1차 5 / 2차 0**
(공용 파일 3건을 합치면 화면에는 8건이 뜬다)

## MoCRA 하나가 이 조합의 대부분이다

2022-12-29에 제정된 **화장품규제현대화법(MoCRA)** 이 미국 화장품 규제를 통째로 바꿨다.
그전까지 화장품은 **FDA 등록 의무가 없는** 유일한 FDA 규제 품목이었다 —
자율 프로그램(VCRP)뿐이었다. 지금은 시설등록·제품리스팅·안전성 입증·부작용 보고가
전부 의무다.

법령 5건 중 넷이 MoCRA 조항이라 `id` 번호를 **조항 번호**로 썼다
(`US-2022-605` · `607` · `608` · `609`). 일본에서 조문 번호를 쓴 것과 같은 규칙이다(§103).

## 채택

### 1. `MoCRA §607` — 시설등록·제품리스팅
`US-2022-607` · 준수일 2023-12-29 · **CRITICAL** · `official`

- **<https://www.fda.gov/cosmetics/registration-listing-cosmetic-product-facilities-and-products>**
  — FDA 등록·리스팅 페이지. **1차 출처다.**
  `Every person who is required to register a facility must renew such registration
  biennially (i.e., every two years)`
- <https://www.fda.gov/cosmetics/registration-listing-cosmetic-product-facilities-and-products/cosmetics-direct>
  (제출 포털 Cosmetics Direct)

**`deadline`을 넣지 않았다.** 갱신 주기는 2년인데 **기준일이 시설의 최초 등록일**이라
회사마다 다르다. FDA 예시가 그대로다 — `registration on February 20, 2024 requires
renewal by February 20, 2026`. 데이터에 특정 날짜를 넣으면 모든 사용자에게
남의 날짜를 보여주게 된다. 대신 `transitionNote`에 규칙을 적고
액션에 "갱신일 확인"을 넣었다.

**소규모 사업자 면제에 구멍이 있다.** MoCRA는 일정 규모 이하 사업자를 시설등록에서
면제하지만, **점막에 접촉하는 제품**을 만드는 시설에는 면제가 적용되지 않는다.
기본 제품 중 **립 틴트가 점막 접촉**이라 이 조합에서는 면제를 기대할 수 없다.
액션에 그대로 적었다.

### 2. `MoCRA §608` — 안전성 입증
`US-2022-608` · 준수일 2023-12-29 · HIGH · `official`

### 3. `MoCRA §605` — 심각한 부작용 보고
`US-2022-605` · 준수일 2023-12-29 · HIGH · `official`

인지 후 **15영업일 내** FDA 보고, 기록은 **6년 보관**이다.

### 4. `MoCRA §609` — 라벨 부작용 접수 연락처
`US-2022-609` · 준수일 **2024-12-29** · MEDIUM · `official`

미국 내 주소·전화 또는 전자적 연락 수단을 라벨에 넣어야 한다.
§605~608보다 1년 늦은 것은 MoCRA가 라벨 조항에만 2년 유예를 뒀기 때문이다.

- **<https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra>**
  — FDA MoCRA 개요. **1차 출처다.** §605~609의 내용을 여기서 확인했다
- <https://biorius.com/cosmetic-regulations/usa-cosmetic-regulations/mocra-cosmetics/> ·
  <https://www.wiley.law/alert-Time-Flies-Cosmetic-Manufacturing-Facilities-are-Due-for-FDA-Registration-Renewal>
  (준수일 2023-12-29 / 라벨 2024-12-29, 갱신 첫 회 2026-07-01)

**FDA 개요 페이지는 조항 내용을 적지만 날짜를 적지 않는다.** 날짜는 법 제정일
(2022-12-29)에서 1년·2년으로 산정되는 값이라 **독립 출처 3곳의 서술로 확정했다.**

### 5. `21 CFR 73 · 74 · 82` — 색소첨가물
`US-1960-073` · 색소첨가물 개정법 1960-07-12 · HIGH · `official`

**한국 수출자가 가장 자주 걸리는 지점이다.** 미국은 색소를 두 층으로 규제한다.

1. **승인된 색소만** 쓸 수 있다 (21 CFR 73 = 인증 면제, 74·82 = 인증 대상)
2. 74·82 색소는 **FDA가 배치(batch)를 인증한 것**만 쓸 수 있다 —
   색소 제조사가 FDA 색소인증과에 배치 샘플을 보내 인증서를 받는다.
   **한국에서 받은 인증으로 갈음되지 않는다**

거기에 사용 부위 제한이 겹친다 —
`Color additives that are permitted for general use may not be used in the area of the eye
… unless such use is specified in the color additive regulations`.
**일반용 승인이 눈가 사용 허가를 뜻하지 않는다.**

- **<https://www.fda.gov/industry/color-additives/color-additives-and-cosmetics-fact-sheet>**
  — FDA 화장품 색소 팩트시트. **1차 출처다**
- <https://www.fda.gov/industry/color-additives/summary-color-additives-use-united-states-foods-drugs-cosmetics-and-medical-devices>
- <https://www.fda.gov/industry/color-certification/color-certification-faqs> (배치인증 절차)

## 제외 — 그리고 그 사유

### `MoCRA §606` GMP 규칙

**제외했다. 제안규칙조차 나오지 않았다.**

MoCRA는 FDA가 2024-12-29까지 GMP 제안규칙(NPRM)을 내도록 정했는데 지키지 못했고,
2026년 통합규제일정에서 **「장기 과제(Long-Term Actions)」로 옮겨져 시한이 사라졌다.**
폐기된 것은 아니지만 1년 내 제안 예정이 없다.

### 향료 알레르겐 표시 규칙 (`MoCRA §609` 위임분)

**제외했다. 2026년 5월 제안 예정 단계다.**

`fragrance`로 뭉뚱그려 적던 향료 성분을 개별 표시하게 하는 규칙인데
FDA 일정상 제안이 2026-05, 최종은 빨라야 2027년이다. 시행일이 없다.

### 활석(talc) 석면 시험 규칙

**제외했다. 제안규칙이 철회됐다.**

2024-12-27 제안됐다가 **2025-11-28에 FDA가 철회**했다. 수정 제안을 내겠다고 했으나
시점이 정해지지 않았다. 우리 기본 제품에 활석 함유품도 없다.

- <https://www.registrarcorp.com/blog/cosmetics/mocra/mocra-unified-agenda/> ·
  <https://www.foley.com/insights/publications/2026/03/how-mocra-is-reshaping-fda-oversight-of-cosmetics-in-2026/>
- <https://www.govinfo.gov/content/pkg/FR-2025-11-28/pdf/2025-21581.pdf> (철회 고시)

**셋 다 MoCRA가 FDA에 위임한 하위규칙이다.** 법은 있는데 규칙이 없다 —
`scheduled`로도 넣을 수 없다. 다음 재검증에서 향료 알레르겐 규칙을 먼저 본다.

### 주(州) 단위 규제 (캘리포니아 Prop 65 · 주별 PFAS 금지)

**제외했다. 이 데이터셋은 연방·국가 단위 규제를 담는다.**

실제로 걸리는 규제이지만 주마다 목록과 시행일이 달라 **하나의 `deadline`으로 표현할 수 없고**,
`hsPrefixes`로도 `originScope`로도 나눌 수 없다. 도착국을 `US`로 잡은 이 데이터 모델이
담을 수 있는 단위가 아니다. **모델의 한계이지 규제가 없어서가 아니다.**

## HS 차등 — 없다. JP-화장품과 같은 이유다

법령 5건이 전부 화장품 전 범위다. 실제 차등의 축은 **점막 접촉 여부**(MoCRA 면제 예외)와
**눈가·립 사용 여부**(색소 규정)인데, `3304`가 립 틴트(3304.10)와 수분크림(3304.99)을
같이 담아 HS로 가를 수 없다. §107이 일본 화장품에서 내린 결론과 정확히 같다.

**화장품은 두 나라 모두에서 HS 차등이 성립하지 않는다.** 우연이 아니다 —
화장품 규제는 **어디에 바르는가**로 갈리는데 HS 분류는 **무엇인가**로 갈린다.

---

# US — 공용 (`data/laws/US-shared.json`)

**조사일 2026-09-06 · 법령 3건 · 액션 7건 · 1차 2 / 2차 1**

## ⚠ `KORUS FTA`를 US-food에서 공용으로 옮겼다

2-e에서 `US-2012-010`(한미 FTA 원산지증명)을 `US-food.json`에 넣었는데
**이 법령은 품목을 가리지 않는다.** 화장품도 전기전자도 특혜관세를 받는다.
§92가 EPR에서, §82가 라벨 시행령에서 지적한 것과 **같은 누락**이다.

`US-shared.json`으로 옮기고 `itemCategories`를 세 품목으로,
`hsPrefixes`를 `[]`로 바꿨다(§86). **액션 id `US-a-010-01`·`US-a-010-02`는 그대로다**(§15 · §52).

`originScope: ["KR"]`도 그대로 살아 있어, 공용 법령이면서 출발국을 가리는 첫 사례가 됐다.

## `UFLPA` — 위구르 강제노동 방지법
`US-2021-078` · Public Law 117-78 · 시행 2022-06-21 · HIGH · `official`

3차 지시서가 **"US 강제노동 심사(UFLPA) — 품목을 가리지 않는다"** 고 예상한 그대로다.

- **<https://www.cbp.gov/trade/forced-labor/UFLPA>** — 미국 관세국경보호청. **1차 출처다**
- <https://www.cbp.gov/trade/forced-labor/faqs-uflpa-enforcement> (억류 시 적용가능성 심사 절차)
- <https://www.dhs.gov/news/2026/07/31/dhs-announces-addition-43-companies-uflpa-entity-list>
  (국토안보부 — 2026-07-31 43사 추가, 총 187사)
- <https://www.hklaw.com/en/insights/publications/2026/07/new-compliance-tools-cbp-issues-comprehensive-forced-labor-guidance>
  (2026년 지침 — 잠재적 투입 / 직접 투입 경로 구분)

신장 지역에서 채굴·생산·제조됐거나 대상기업 목록에 오른 기업이 만든 물품은
**강제노동으로 만들어진 것으로 추정**되어 반입이 금지된다. 추정은 반증 가능하지만
**인용률이 12% 안팎**이다.

**한국 수출자에게 걸리는 경로는 원재료·부품이다.** 완제품이 한국산이어도
중국·신장 유래 투입물이 있으면 걸린다. 그래서 액션을 공급망 추적 자료 구축과
대상기업 대조로 잡았다.

`changes`에 2026-07-31 확대와 2026년 지침의 경로 구분을 적었다 —
**이건 실제로 올해 바뀐 것이다.**

## `19 CFR 134` — 원산지 표시
`US-1930-134` · 1930년 관세법 · 시행 1930-06-17 · MEDIUM · `official`

- **<https://www.ecfr.gov/current/title-19/chapter-I/part-134>** — 미국 연방규정집. **1차 출처다**
- <https://www.cbp.gov/trade/nafta/guide-customs-procedures/country-origin-marking> (CBP 안내)

수입 물품 또는 그 용기에 **최종 구매자가 볼 수 있는 자리에, 지워지지 않게, 영문으로**
원산지를 표시해야 한다. 라벨에 미국 지명·주소가 있으면 **바로 옆에 같은 크기로**
원산지를 병기해야 한다 — 한국 화장품·식품이 미국 총판 주소를 크게 적으면서
원산지를 작게 적어 걸리는 전형적인 지점이다.

`effectiveDate`가 1930년이다. §113이 정리한 대로 **오래된 것은 숨길 일이 아니다** —
`changes: []`와 함께 읽히면 "원래부터 지켜야 하는 것"이라는 뜻이 된다.

---

# US — 전기·전자 (`data/laws/US-electronics.json`)

**조사일 2026-09-06 · 법령 4건 · 액션 12건 · 1차 4 / 2차 0**
(공용 파일 3건을 합치면 화면에는 7건이 뜬다)

## 미국은 일반 가전에 강제 인증이 없다

일본 조합을 먼저 한 뒤라 이 차이가 두드러졌다. 일본은 전기밥솥·LED 전구·보조배터리가
전부 `電気用品安全法` 대상이라 PSE 마크 없이는 못 판다. **미국에는 그에 해당하는
연방 강제 인증이 없다.** UL 인증은 시장이 요구하는 것이지 법이 요구하는 것이 아니다.

대신 미국은 **다른 축**으로 규제한다 — 전파(FCC), 에너지효율(DOE), 운송(PHMSA),
사후 결함보고(CPSC). 그래서 조합 성격이 일본과 완전히 다르다.

## 채택

### 1. `47 CFR Part 15` — FCC 기기인증
`US-2017-015` · SDoC 시행 2017-11-02 · CRITICAL · `official`

- **<https://www.fcc.gov/engineering-technology/laboratory-division/general/equipment-authorization>**
  — FCC 기기인증 페이지. **1차 출처다**
- <https://www.federalregister.gov/documents/2017/11/02/2017-23217/authorization-of-radiofrequency-equipment>
  (연방관보 — 2017-11-02 발효)
- <https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-2/subpart-J> (인증 절차 원문)
- <https://incompliancemag.com/fcc-approval-process-what-has-changed-what-remains-the-same/> ·
  <https://www.pillsburylaw.com/en/news-and-insights/a-primer-on-fcc-radio-frequency-device-equipment-authorization-rules.html>
  (Verification·DoC → SDoC 통합, 2018-11-01 완전 대체)

**제품이 두 경로로 갈린다.** 무선 이어폰처럼 의도적으로 전파를 내는 기기는
TCB를 통한 **Certification**(FCC ID 부여)이고, 밥솥·LED·보조배터리 같은
비의도적 방사체는 **SDoC**다. 리드타임이 10주 대 2주로 다르다.

**미국 내 책임당사자(responsible party)를 반드시 둬야 한다.** SDoC는 원래 그렇고,
Certification도 외국 신청인은 `47 CFR §2.911(d)(7)`에 따라 미국 내
송달대리인(agent for service of process)을 지정해야 한다.
FCC는 외국 인증취득자에게 **미국 내 책임주체**를 두게 하는 개정을 추가로 제안 중이다.

`hsPrefixes`를 네 품목 전부로 뒀다 — 넷 다 9kHz 이상에서 동작하는 디지털 회로를 담아
Part 15 대상이다. 갈리는 것은 **대상 여부가 아니라 절차**라서 액션으로 표현했다.

### 2. `10 CFR 430` — 일반조명램프 효율기준
`US-2024-430` · 현행 45 lm/W 2022-07-25 · **`deadline: 2028-07-25`** · HIGH ·
**hsPrefixes `["8539"]` — 제품 1** · `official`

- **<https://www.energy.gov/cmei/buildings/general-service-lamps>** — 에너지부. **1차 출처다**
- <https://www.federalregister.gov/documents/2024/04/19/2024-07831/energy-conservation-program-energy-conservation-standards-for-general-service-lamps>
  (2024-04-19 최종규칙)
- <https://www.bdlaw.com/publications/u-s-department-of-energy-finalizes-rules-to-impose-stringent-efficiency-standard-on-most-lamps/> ·
  <https://climate.law.columbia.edu/content/doe-adopts-two-final-rules-setting-stricter-energy-efficiency-standards-light-bulbs> ·
  <https://inside.lighting/news/24-04/120-lumens-watt-doe-sets-ambitious-bulb-standards>
  (45 → 120 lm/W, `compliance … required on and after July 25, 2028`,
  `newly produced or imported general service lamps`)

**`deadline`을 넣은 근거**: §91의 시험을 통과한다. 이 날짜는 **일반조명램프의 날짜**이고
우리 제품 중 LED 전구(8539.52)가 정확히 그것이다. 그래서 `hsPrefixes`도 `["8539"]`다.
화면에서 **제품 1 · D-688**로 뜬다.

**2025~2026년 폐지 여부를 확인했다.** 2026년 7월 제안은 기준 자체가 아니라
**기준을 정하는 절차**를 손보는 것이었고, 120 lm/W와 2028-07-25는 그대로다.
다음 재검증에서 다시 본다 — 에너지효율 기준은 행정부 교체에 따라 흔들린다.

### 3. `49 CFR 173.185` — 리튬전지 운송
`US-2008-185` · 시험요약서 의무 2008-01-01 제조분부터 · HIGH ·
**hsPrefixes `["8507","8518"]` — 제품 2** · `official`

- **<https://www.phmsa.dot.gov/lithiumbatteries>** — 파이프라인위험물질안전청. **1차 출처다**
- <https://www.phmsa.dot.gov/sites/phmsa.dot.gov/files/2023-07/Lithium%20Battery%20Guide.pdf>
  (하주용 리튬전지 안내)
- <https://www.ecfr.gov/current/title-49/subtitle-B/chapter-I/subchapter-C/part-173/subpart-E/section-173.185>
  (조문 원문)

**일본에서는 뺐던 것을 여기서는 넣었다.** JP-electronics에서 리튬전지 운송을 제외한 이유는
"일본이 한국 수출자에게 부과하는 요건이 아니라 국제 운송 기준"이었다.
미국은 다르다 — `49 CFR`은 **미국 상거래 내 운송을 규율하는 미국 연방규정**이고,
수입 화물이 항구에서 창고로 가는 구간이 여기 든다. 조문이 **후속 유통자(subsequent
distributor)** 에게도 시험요약서 제공 의무를 지운다.

2008-01-01 이후 제조된 셀·배터리는 **UN38.3 시험을 통과한 설계**여야 하고
시험요약서를 공급망에 제공할 수 있어야 한다.

**남긴 정밀도**: 리튬전지 마크의 경과 규정(구 마크를 2026-12-31까지 허용)을 봤으나
**2차 요약 한 곳뿐이라 데이터에 넣지 않았다.** eCFR 원문은 봇 차단으로 열지 못했다
(§117과 같은 문제 — 이번에는 WebFetch도 `unblock.federalregister.gov`로 튕긴다).
사실이라면 실기한이 하나 더 생긴다. **다음 재검증 항목이다.**

### 4. `CPSA §15(b) · 16 CFR 1115` — 결함 보고
`US-1972-115` · CPSA 제정 1972-10-27 · MEDIUM · `official`

- **<https://www.ecfr.gov/current/title-16/chapter-II/subchapter-B/part-1115>** — 연방규정집. **1차 출처다**
- <https://www.cpsc.gov/Business--Manufacturing/Recall-Guidance/Duty-to-Report-to-CPSC-Rights-and-Responsibilities-of-Businesses>
  (CPSC — 보고 의무)
- <https://www.saferproducts.gov/FAQs/FrequentlyAskedQuestions8> (자진보고 FAQ)

결함을 인지하면 **24시간 내** CPSC에 보고해야 하고, 보고 여부를 판단하기 위한
조사는 **10일을 넘기지 않아야** 한다. 의무자는 제조자·수입자·유통자·소매업자다.

**의무자는 미국 수입자다.** 그래도 넣은 것은 사고·불만 정보가 수출자에게서 나오고,
24시간 시계가 도는 동안 한국 본사가 답을 못 주면 수입자가 보고를 못 하기 때문이다.
액션을 정보 공유 경로 계약화로 잡았다.

## 제외 — 그리고 그 사유

### `UL` 인증 · NRTL

**제외했다. 법이 아니다.**

미국에는 일반 소비자 가전에 대한 연방 강제 안전인증이 없다. UL 마크는 소매체인·보험사·
주 전기규정이 요구하는 것이지 연방법이 요구하는 것이 아니다.
OSHA의 NRTL 제도는 **사업장에서 쓰는 기기**에 걸리는 것이라 소비자 판매와 다르다.

**이 앱은 법령을 담는다.** 시장이 요구하는 인증을 법령으로 적으면 §B-3 규칙 1 위반이다.
다만 실무상 UL 없이는 대형 유통에 못 들어가므로, 이 사실 자체를 여기 남긴다.

### `CPSC` 리튬이온전지 안전기준 (마이크로모빌리티)

**제외했다. 2026-06-24 제안규칙이고 대상이 마이크로모빌리티다.**

전동킥보드·전기자전거의 리튬전지를 겨냥한 규칙이라 보조배터리는 대상이 아니다.
제안 단계라 시행일도 없다.

- <https://www.federalregister.gov/documents/2026/06/24/2026-12749/safety-standard-for-lithium-ion-batteries-used-in-micromobility-products-and-electrical-systems-of>

### `Reese's Law`(16 CFR 1263) 버튼형 전지

**제외했다. 우리 제품에 버튼셀이 없다.**

### 주(州) 규제 — 캘리포니아 에너지위원회 · Prop 65

**제외했다.** US-화장품과 같은 이유다 — 주마다 기준과 시행일이 달라 이 데이터 모델이
담을 수 없다. 모델의 한계이지 규제가 없어서가 아니다.

## HS 차등 — 실재한다

| 법령 | 제품 | 근거 |
|---|---|---|
| 47 CFR Part 15 | 4 | 넷 다 디지털 회로를 담는다. **절차**가 갈린다 |
| 10 CFR 430 | **1** | 일반조명램프만 |
| 49 CFR 173.185 | **2** | 리튬전지를 담은 것만 |
| CPSA §15(b) | 4 | 소비자제품 전부 |

JP-electronics(§112)에 이어 두 번째로 차등이 실재하는 전기전자 조합이다.
다만 **갈래의 성격이 다르다** — 일본은 법령마다 대상 품목 목록이 있어 `제품 3/2/1/1`로
잘게 갈렸고, 미국은 규제 축(전파·효율·운송·안전)이 달라 `제품 4/1/2/4`로 갈린다.

## `originScope` — 조합 파일에는 없다

FCC도 DOE도 PHMSA도 CPSC도 출발국을 가리지 않는다.
이 조합의 `originScope`는 공용 파일의 `KORUS FTA` 하나뿐이다.

---

# ID — 식품·음료 (`data/laws/ID-food.json`) · ID — 공용 (`data/laws/ID-shared.json`)

**조사일 2026-09-06 · 조합 4건 / 액션 11건 · 공용 1건 / 액션 5건 · 전부 1차 출처**

## ⚠ 데이터셋에서 가장 급한 날짜가 여기 있다 — D-41

**할랄 인증 의무의 수입품 기한이 2026-10-17이다.** 기준일 2026-09-06에서 **D-41**.
S1의 MUST DO NOW 첫 화면에 뜬다.

3차 지시서가 `ID` 공용 후보로 지목한 **할랄 인증 의무(JPH법)** 가 그대로 나왔고,
예상대로 **식품과 화장품 둘 다에 걸린다.**

## `PP 42/2024` — 할랄제품보증 시행령 (공용)
`ID-2024-042` · JPH 의무 개시 2019-10-17 · **`deadline: 2026-10-17`** · CRITICAL · `official`

- **<https://bpjph.halal.go.id/read/bpjph-17-oktober-2026-produk-makanan-minuman-umk-harus-sudah-bersertifikat-halal-bagaimana-dengan-produk-luar-negeri>**
  — 할랄제품보증청(BPJPH) 공식 기사. **1차 출처다.**
  `PP Nomor 42 Tahun 2024 … Pasal 160`이 **수입품(produk luar negeri)** 과
  소상공인(UMK)의 기한을 **2026-10-17**로 정한다
- **<https://bpjph.halal.go.id/detail/bpjph-produk-kosmetik-wajib-bersertifikat-halal-pada-oktober-2026/>**
  — BPJPH — 화장품도 2026-10-17
- <https://bpjph.halal.go.id/read/tak-hanya-makanan-minuman-ini-jenis-produk-yang-wajib-bersertifikat-halal-mulai-18-oktober-2026>
  (의약품·화장품·화학제품·유전자변형제품·사용재)
- <https://mui.or.id/baca/halal/sertifikasi-halal-obat-2026-apakah-semua-obat-wajib-bersertifikat-halal-begini-penjelasannya>
  (인도네시아 울라마협의회 — 단계별 시한)

**국내분과 수입분의 시한이 다르다는 것이 핵심이다.** 인도네시아 국내 대·중견 식품기업은
2024-10-17에 이미 의무가 시작됐지만, **수입 식품·음료는 상호인정협정(MRA) 진행을
고려해 2026-10-17로 미뤄졌다.** 우리 사용자는 한국에서 내보내는 수출자이므로
**식품이든 화장품이든 같은 2026-10-17**이다.

**그래서 공용 파일 하나로 담을 수 있었다.** 만약 국내 기준(식품 2024 / 화장품 2026)을
따라야 했다면 한 법령에 두 날짜가 필요해 이 스키마로는 표현할 수 없었다.
수입분 기한이 하나로 모인 덕에 `deadline` 하나가 두 품목에 모두 참이다.

**`itemCategories`는 `["food","cosmetics"]` 둘뿐이다.** 전기전자는 넣지 않았다 —
2단계 대상은 `barang gunaan`(사용재)으로 의류·신발·주방용품처럼 동물유래 소재가 닿는
물품이고, 전기밥솥·이어폰·배터리·LED가 거기 든다는 근거를 찾지 못했다.

액션 다섯 중 둘에 `itemCategories`를 달았다(§85) — 식품은 제조라인 교차오염,
화장품은 동물유래 원료(콜라겐·글리세린·스쿠알렌) 출처 확인이다. 같은 법령이지만
할 일이 다르다.

**`ID-a-042-01`에 `dueDate: 2026-10-17`을 넣었다.** `US-a-225-01`에 이어 두 번째
비-null `dueDate`다(§116) — 인증 취득 자체의 마감이지 법령 기한을 복사한 것이 아니다.

## 채택 — 조합 법령

인도네시아는 **BPK 법령DB(`peraturan.bpk.go.id`)** 가 시행일·폐지·개정 관계를 구조화해
제공한다. 이 조합의 날짜는 전부 거기서 확인했다.

### 1. `PerBPOM 28/2023` — 수입 감독
`ID-2023-028` · Berlaku **2023-11-08** · CRITICAL · `customs` · `official`

- **<https://peraturan.bpk.go.id/Details/285056/perka-bpom-no-28-tahun-2023>** — **1차 출처다.**
  `mulai berlaku pada tanggal 08 November 2023`
- <https://exim.pom.go.id/> (e-BPOM 수입증명 창구)
- <https://www.pom.go.id/berita/tata-cara-permohonan-surat-keterangan-impor-(ski)-secara-elektronik-di-badan-pengawas-obat-dan-makanan>

`PerBPOM 27/2022`(의약품·식품 수입 감독)을 개정한다.
**유통허가(izin edar ML)와 선적별 수입증명(SKI)** 두 관문이 여기 걸린다.

**등록 신청은 수입자가 하되, 그 수입자는 원산지 회사가 지정해야 한다.**
그래서 첫 액션이 "수입자 지정"이다 — 수출자가 먼저 움직이지 않으면 등록이 시작되지 않는다.

### 2. `PerBPOM 31/2018` — 가공식품 라벨
`ID-2018-031` · Berlaku **2018-10-19** · HIGH · `official`

- **<https://peraturan.bpk.go.id/Details/219910/peraturan-bpom-no-31-tahun-2018>** — **1차 출처다.**
  `Status Berlaku` · `Mencabut : PerBPOM 27/2017 sepanjang mengatur mengenai label` ·
  **`Diubah dengan : PerBPOM No. 6 Tahun 2024`**

**BPK가 개정 이력을 구조화해 준 덕에 2차 개정(PerBPOM 6/2024)까지 잡았다.**
1차 개정은 `PerBPOM 20/2021`이다. `changes`에 둘 다 적었고,
액션에 "개정분이 현행 라벨에 반영됐는지 대조"를 넣었다.

라벨은 **전체가 인도네시아어**여야 한다. 영문 병기로 갈음되지 않는다.

### 3. `PerBPOM 22/2023` — 금지 원료·금지 첨가물
`ID-2023-022` · Berlaku **2023-08-15** · HIGH · `official`

- **<https://peraturan.bpk.go.id/Details/284990/peraturan-bpom-no-22-tahun-2023>** — **1차 출처다.**
  `Mencabut : PerBPOM No. 7 Tahun 2018 tentang Bahan Baku yang Dilarang dalam Pangan Olahan`

**목록이 둘이다** — 가공식품에 쓸 수 없는 **원료**와, 식품첨가물로 쓸 수 없는 **물질**.
액션에서 둘을 따로 대조하게 했다.

### 4. `PerBPOM 13/2023` — 식품 카테고리
`ID-2023-013` · Berlaku **2023-06-06** · MEDIUM · `official`

- **<https://peraturan.bpk.go.id/Details/263247/peraturan-bpom-no-13-tahun-2023>** — **1차 출처다**

**등록할 때 제품을 어느 카테고리로 신고하느냐가 허용 첨가물과 표시 요건을 정한다.**
고추장·김치양념 소스가 소스류인지 조미료인지에 따라 뒤따르는 규정이 달라지므로
독립 법령으로 세웠다.

## 확인했으나 넣지 못한 것 — `PerBPOM 23/2023`(가공식품 등록)

**이 규정이 `PerBPOM 27/2017`과 그 개정 `PerBPOM 7/2021`을 폐지·대체했다는 사실은
확인했다. 그런데 시행일을 정부 출처에서 확인하지 못해 법령으로 넣지 않았다.**

- <https://jdih.pom.go.id/view/slide/1518/23/2023/07811dc6c422334ce36a09ff5cd6fe71> (BPOM JDIH)
- <https://www.hukumonline.com/pusatdata/detail/lt651bbcc265807/peraturan-badan-pengawas-obat-dan-makanan-nomor-23-tahun-2023/analysis/>
  (폐지·대체 관계, 제9조 — 수입 가공식품 등록은 **원산지 회사가 지정한 수입자**가 신청)
- 관보 `BN 2023 (708)`. `PerBPOM 21/2023`이 `BN 2023 (622)`로 2023-08-14,
  `PerBPOM 24/2023`이 `BN 2023 (741)`로 2023-09-18이므로 **2023년 8~9월 사이**인 것은
  분명하나 날짜가 특정되지 않는다

BPK 법령DB에서 이 규정의 항목을 찾지 못했고(키워드 검색·인접 id 탐색 모두 실패),
BPOM 표준식품국이 올린 PDF URL은 HTML로 리다이렉트됐다.
**`effectiveDate`를 지어내느니 법령을 비우고 의무를 액션에 담았다** —
`ID-a-028-01`(수입자 지정)이 제9조의 실질이다.

**다음 재검증에서**: BPK DB에 항목이 생겼는지, 또는 `jdih.pom.go.id`가 살아났는지 본다.
`jdih.pom.go.id`는 조사 시점에 접속되지 않았다(curl `000`).

## 제외 — 그리고 그 사유

### `SNI 의무 인증`

**제외했다. 우리 제품군이 의무 SNI 대상이 아니다.**
밀가루·설탕·소금·코코아 등 일부 품목만 SNI wajib이고 소스·조미김·장류·과일가공품은 아니다.

### 주(州)·지방정부 규제

인도네시아는 중앙 규제가 강해 이 조합에서는 문제되지 않았다.

## HS 차등 — 없다

법령 4건이 전부 식품 전 범위다. 인도네시아 식품 규제는 **식품 카테고리 체계**
(`PerBPOM 13/2023`)로 제품을 가르는데, 그 카테고리는 HS 코드와 다른 축이다.
US-화장품·JP-화장품에서 본 것과 같은 구조다(§107 · §122) —
**차등은 있으나 `hsPrefixes`가 담을 수 있는 차등이 아니다.**

## `originScope` — 없다

BPOM 규정도 할랄도 출발국을 가리지 않는다. 다만 **할랄은 상호인정협정(MRA) 체결
여부에 따라 실무 절차가 달라진다** — 한국 인증기관이 BPJPH와 MRA를 맺고 있으면
한국에서 받은 할랄 인증이 인정된다. 그건 `originScope`(적용 여부)가 아니라
절차의 차이라 액션에 적었다.

---

# ID — 화장품 (`data/laws/ID-cosmetics.json`)

**조사일 2026-09-06 · 법령 4건 · 액션 11건 · 1차 4 / 2차 0**
(공용 파일의 할랄을 합치면 화면에는 5건이 뜬다)

## ⚠ 데이터셋에서 가장 급한 날짜를 갱신했다 — D-27

`PerBPOM 25/2025`(화장품 원료 기술요건)의 경과 기한이 **2026-10-03**이다. **D-27.**
할랄(D-41)보다 2주 빠르다. **이 조합의 S1에는 D-27과 D-41이 나란히 뜬다.**

## 채택

### 1. `PerBPOM 25/2025` — 화장품 원료 기술요건
`ID-2025-025` · 공포·시행 **2025-10-03** · **`deadline: 2026-10-03`** · CRITICAL · `official`

- **<https://peraturan.bpk.go.id/Details/333277/peraturan-bpom-no-25-tahun-2025>**
  — BPK 법령DB. **1차 출처다.** `Berlaku 03 Oktober 2025` · `Status Berlaku` ·
  `Mencabut : PerBPOM No. 23 Tahun 2019` · `PerBPOM No. 17 Tahun 2022`
- **<https://peraturan.bpk.go.id/Download/395521/peraturan-bpom-no-25-tahun-2025.pdf>**
  — **원문 PDF 352쪽. 텍스트를 뽑아 조문을 직접 읽었다**
- <https://standar-otskk.pom.go.id/kegiatan/sosialisasi-peraturan-bpom-no-25-tahun-2025-tentang-persyaratan-teknis-bahan-kosmetik>
  (BPOM 표준화국 설명회)

**경과 기한을 원문에서 읽었다.**

```
Pasal 15
Pelaku Usaha yang telah memiliki nomor notifikasi Kosmetik sebelum berlakunya
Peraturan Badan ini, harus menyesuaikan dengan ketentuan dalam Peraturan Badan ini
paling lama 12 (dua belas) bulan terhitung sejak Peraturan Badan ini diundangkan.

Pasal 17
Peraturan Badan ini mulai berlaku pada tanggal diundangkan.
```

시행 전에 통보번호를 받은 사업자는 **공포일로부터 12개월** 안에 새 기준에 맞춰야 한다.
공포일이 2025-10-03이므로 **2026-10-03**이다.

**2차 출처 하나가 "2026-10-03부터 e-Notifikasi 시스템을 모두가 써야 한다"고 썼는데,
원문이 말하는 것은 시스템이 아니라 원료 기준 적합이다.** §89가 가르친 대로
2차 출처의 서술을 원문으로 확인했고, 그 결과 **기한의 성격이 달랐다.**
데이터에는 원문이 말하는 것만 적었다.

미이행 시 제재는 제13조에 있다 — 서면경고 → 최장 1년 유통 정지 → 회수 → 폐기 →
**통보번호 취소** → CPKB 인증서 취소 → 통보 신청 온라인 접근 차단.

**`ID-a-025-01`·`ID-a-025-02` 두 액션에 `dueDate: 2026-10-03`을 넣었다.**
처방 대조와 적합 판정은 그 날짜 전에 끝나야 하는 일이다.

### 2. `PerBPOM 21/2022` — 화장품 통보(notifikasi)
`ID-2022-021` · 제정 2022-10-04 · 공포 **2022-10-05** · CRITICAL · `official`

- **<https://standar-otskk.pom.go.id/regulasi/perbpom-no-21-tahun-2022-tentang-tentang-tata-cara-pengajuan-notifikasi-kosmetika>**
  — BPOM 표준화국 규정 페이지. **1차 출처다**
- <https://standar-otskk.pom.go.id/storage/uploads/f530cc78-7bfc-4d11-9eda-1ac465a9532a/Q&A-Sos-TCPNK.pdf>
  (BPOM 설명회 Q&A)
- <https://www.jogloabang.com/kesehatan/perbpom-21-2022-notifikasi-kosmetika>
  (제정 2022-10-04 / 공포 2022-10-05, 7장 57조 + 부속서 5건, PerBPOM 12/2020 대체)

**통보번호 없이는 인도네시아에서 화장품을 팔 수 없다.** 등록(registrasi)이 아니라
통보(notifikasi)라 서류 심사 중심이지만, **통보권자는 인도네시아 법인이어야 하므로
수출자가 먼저 권한 위임을 정리해야 한다.**

### 3. `PerBPOM 18/2024` — 표시·프로모션·광고
`ID-2024-018` · Berlaku **2024-11-28** · HIGH · `labeling` · `official`

- **<https://peraturan.bpk.go.id/Details/309969/peraturan-bpom-no-18-tahun-2024>** — **1차 출처다.**
  `Status Berlaku`
- <https://www.pom.go.id/siaran-pers/bpom-tegaskan-aturan-penandaan-promosi-dan-iklan-kosmetik-wajib-dilaksanakan-pelaku-usaha>
  (BPOM 보도자료 — 표시·프로모션·광고 의무)

`PerBPOM 30/2020`(표시)과 `PerBPOM 32/2021`(광고)로 나뉘어 있던 것을 하나로 묶었다.
**미백·주름·여드름 같은 클레임에는 과학적 근거가 있어야 한다** —
JP `薬機法 第66条`(효능효과 56항목)와 성격이 비슷하지만, 일본이 **목록으로 제한**하는 데 비해
인도네시아는 **근거를 요구**한다. 그래서 액션도 "문구를 목록에 맞춰라"가 아니라
"클레임마다 시험 자료를 갖춰라"다.

### 4. `PerBPOM 17/2023` — 제품정보파일(DIP)
`ID-2023-017` · Berlaku **2023-08-02** · HIGH · `official`

- **<https://peraturan.bpk.go.id/Details/284984/peraturan-bpom-no-17-tahun-2023>** — **1차 출처다.**
  `Pedoman Dokumen Informasi Produk Kosmetik` · `Status Berlaku`

통보를 마친 뒤에도 **처방·제조방법·안전성 평가·효능 근거를 묶은 DIP를 언제든 제출**할 수
있어야 한다. EU의 PIF와 같은 구조다. 자료가 전부 한국 제조소에 있으므로
**보관 위치와 제출 경로를 통보권자와 미리 합의**하는 것이 액션이다.

## 제외 — 그리고 그 사유

### `CPKB`(우수화장품제조기준) 인증

**제외했다. 인도네시아 국내 제조소에 걸리는 요건이다.**

`PerBPOM 25/2019`(개정 `31/2020`)가 정하는 CPKB 인증은 인도네시아 안에서 화장품을
만드는 시설이 받는다. 한국 제조소는 대신 **본국의 GMP 증명(ISO 22716 등)** 을 통보
서류로 낸다. 그 실질은 `PerBPOM 21/2022`의 통보 서류 액션에 들어 있다.

다만 `PerBPOM 25/2025` 제13조의 제재 목록에 **CPKB 인증서 취소**가 들어 있어
현지 위탁생산으로 전환하면 그때는 직접 걸린다. 그 사실을 여기 남긴다.

## HS 차등 — 없다. 화장품 네 번째 조합에서도 같다

법령 4건이 전부 화장품 전 범위다.
VN(§83) · JP(§107) · US(§122)에 이어 **네 조합 모두 HS 차등이 없다.**
§122가 정리한 이유가 인도네시아에서도 그대로다 —
화장품 규제는 **어디에 바르는가 · 무엇을 표방하는가**로 갈리는데 HS는 **무엇인가**로 갈린다.

## `originScope` — 없다

BPOM 통보도 원료 기준도 출발국을 가리지 않는다.
