# NEO — Claude Design 프롬프트 v3.1 (S1 실측값 고정)

S1 Home이 확정됐다. 이 문서는 **S1 산출물에서 실제로 추출한 수치**를 기준으로 나머지 5화면을 뽑기 위한 것이다. v3의 명세값이 아니라 **Claude Design이 실제로 만들어낸 값**을 쓴다 — 그래야 6화면이 한 시스템으로 묶인다.

## S1 검수 결과

| 항목 | 결과 |
|---|---|
| `border-radius` | **0개** ✓ |
| `box-shadow` | **0개** ✓ |
| 테두리 | `1px solid #2E2E2E` 10곳 — 전부 헤어라인 ✓ |
| 폰트 | Pretendard 단일 ✓ |
| 이모지 | 0개 ✓ |
| 색 사용 | 전부 꽉 찬 색면 + `#171717` 검은 글씨 ✓ |
| 한자 마커 | `施` `留` 사용 ✓ |
| 정렬 | 전부 좌측 ✓ |

**명세와 달라진 점 2가지 — 둘 다 그대로 채택한다.**

1. **32px Display가 쓰이지 않았다.** 색면 헤드라인이 `700 24px/30px`(H1)로 나왔다. 390px 폭에서는 이게 맞다. **Display를 스케일에서 삭제하고 H1을 최상위로 확정한다.** S2~S6의 화면 제목도 전부 H1이다.

2. **지구본이 `width:296px`에 `margin-right:-36px`로 우측을 잘라냈다.** 명세엔 "우측으로 밀어 비대칭"이라고만 썼는데 화면 밖으로 흘려보내는 해석이 나왔다. 편집디자인 어법에 정확히 맞는다. **S5 지도도 같은 방식으로 흘린다.**

**한자 마커에 `Pretendard,serif` 폴백이 붙었다.** 施/留가 본문보다 살짝 다른 골격으로 찍히는데, 이게 마커를 텍스트가 아닌 기호로 읽히게 만든다. 의도된 건 아니지만 좋은 결과라 **모든 화면에서 유지한다.**

---

## 고정 스펙 블록 (아래 5개 프롬프트에 모두 포함되어 있음)

```
[S1에서 확정된 실측 스펙 — 이 값을 그대로 재사용]
배경 #171717 / 헤어라인 #2E2E2E / 본문 #F5F5F5 / 보조 #A3A3A3 / 흐림 #6B6B6B
색면(위에 #171717 검은 글씨): 시안 #22D3EE · 보류 #C084FC
  CRITICAL #FF3B30 · HIGH #FF8A00 · MEDIUM #E0A800 · LOW #22C55E
링크 #22D3EE + 밑줄

Pretendard 하나. 실제로 쓰인 값만:
  H1     700 24px/30px  자간 -.02em      ← 최상위. 32px Display는 쓰지 않는다.
  H2     700 17px/24px
  Body   500 15px/22px
  Meta   400 13px/18px
  Label  700 11px/12px  자간 .08em  대문자
  한자    700 12px/1  Pretendard,serif   ← serif 폴백 반드시 유지
  배지    700 12px/1                      ← 색면 위 검은 글씨

레이아웃 실측:
  좌우 패딩 20px · 상단 바 높이 40px
  섹션 간격 margin-top 28px · 섹션 라벨 아래 margin-top 12px
  행: border-top 1px #2E2E2E · 가로 gap 14px · 행 내부 세로 gap 5px
  행 높이 — 액션형 66px / 정보형 62px / 단문형 44px
  좌측 마커·순번 열은 width 20px 고정
  색면 배지 height 22px, padding 0 7px
  색면 헤드라인 블록 height 52px, padding 0 14px
  H2는 1줄 말줄임 (ellipsis, nowrap)

절대 규칙: border-radius 0 / box-shadow 없음 / 이모지 없음(국가는 VN) /
  카드 박스 없음, 헤어라인으로만 구분 / 전부 좌측 정렬 / pill 칩 금지 /
  아이콘 최소화 / 그라데이션 금지
```

---

## S2. Laws (목록)

```
앞서 만든 NEO Home(S1)과 완전히 같은 시스템으로 이어서 만들어줘.

[S1 실측 스펙 — 이 값 그대로]
배경 #171717 / 헤어라인 #2E2E2E / 본문 #F5F5F5 / 보조 #A3A3A3 / 흐림 #6B6B6B
색면(위에 #171717 검은 글씨): 시안 #22D3EE · 보류 #C084FC
  CRITICAL #FF3B30 · HIGH #FF8A00 · MEDIUM #E0A800 · LOW #22C55E
Pretendard 하나:
  H1 700 24px/30px 자간-.02em (최상위, 32px 쓰지 않음) / H2 700 17px/24px
  Body 500 15px/22px / Meta 400 13px/18px / Label 700 11px/12px 자간.08em 대문자
  한자 700 12px/1 Pretendard,serif / 배지 700 12px/1
레이아웃: 좌우 패딩 20px · 상단바 40px · 섹션 margin-top 28px · 라벨 아래 12px
  행 border-top 1px #2E2E2E · gap 14px · 내부 세로 gap 5px
  마커 열 width 20px 고정 · 배지 height 22px padding 0 7px
절대 규칙: radius 0 / shadow 없음 / 이모지 없음 / 카드 박스 없음 /
  좌측 정렬 / pill 금지 / 아이콘 최소화

[캔버스] 390×844, safe area 상 44 하 34
──────────────────────────────
화면: Laws — 법률 목록 (탭 2번째)

1) 상단 바 40px — 좌측 "NEO" Label 본문색 / 우측 "09.03 08:12" Meta 흐림색 tabular

2) 화면 제목 — 색면 없음, 그냥 H1
   H1 "법률."          ← 마침표 포함
   Meta 흐림색 "VN 베트남 · 5건"   (margin-top 10px)

3) 검색 — 박스 아님. 하단 1px #2E2E2E 선만. 높이 44px.
   Body 흐림색 "법령명, 제품, 키워드"   아이콘 없음

4) 필터 — 가로 스크롤 한 줄, 높이 22px 직각 블록, 간격 6px
   선택됨: #22D3EE 색면 + #171717 검은 글씨, 배지 스타일 700 12px/1, padding 0 7px
   비선택: 배경 없음 + #6B6B6B 글씨 + 하단 1px #2E2E2E
   [내 우선순위](선택) [전체] [VN] [HIGH+] [시행 임박]

5) 정렬 — 우측 정렬 Meta 2개
   "시행일순"(#F5F5F5 밑줄) · "위험도순"(#6B6B6B)     세그먼트 컨트롤 아님

6) 법률 목록 5행. margin-top 28px. 각 행 border-top 1px #2E2E2E. 행 높이 92px.
   행 내부 구조 (gap 14px):
     좌측 열 width 20px — 한자 마커 (align-self flex-start, margin-top 16px)
     중앙 flex:1, 세로 gap 5px —
        Label 흐림색 법령코드
        H2 제목 (1줄 말줄임)
        Meta 흐림색 "2026.01.23 시행 · 제품 4 · 액션 4 · HIGH"
          ── 맨 끝 위험도 단어만 해당 색 텍스트로
     우측 flex:none — D-Day 색면 배지 (height 22px, padding 0 7px)

   施(#22D3EE)  DECREE 37/2026    D-45 (#E0A800 색면)
       식품 라벨 표시 규정 전면 개정
       2026.01.23 시행 · 제품 4 · 액션 4 · HIGH

   施(#22D3EE)  DECREE 110/2026   D-14 (#FF3B30 색면)
       생산자책임재활용(EPR) 의무 시행
       2026.05.25 시행 · 제품 4 · 액션 3 · CRITICAL

   施(#22D3EE)  CIRCULAR 29/2023  기한 경과 (#FF3B30 색면)
       영양성분 표시 의무화
       2026.01.01 시행 · 제품 3 · 액션 2 · HIGH

   留(#C084FC)  DECREE 46/2026    보류 (#C084FC 색면)
       식품안전법 시행령 개정
       2026.04.06 보류 · 제품 4 · 액션 0 · MEDIUM
       ★ 이 행 전체 opacity .55 — 점선 테두리 쓰지 말 것

   施(#6B6B6B)  DECREE 15/2018    배지 없음
       자가공표 절차 (현행 유지)
       현행 유효 · 제품 4 · 액션 0 · LOW

7) 하단 여백 80px + 탭바
   높이 64 + safe area, 배경 #171717, 상단 1px #2E2E2E, 블러 없음
   HOME / LAWS / COMPANY / MAP — Label 대문자 자간.08em, 아이콘 없음
   활성(LAWS): #F5F5F5 + 탭 상단에 2px #22D3EE 직선
   비활성: #6B6B6B
```

---

## S3. Law Detail — 행동이 요약보다 위에 온다

```
앞서 만든 NEO Home(S1), Laws(S2)와 완전히 같은 시스템으로 이어서 만들어줘.

[S1 실측 스펙 — 이 값 그대로]
배경 #171717 / 헤어라인 #2E2E2E / 본문 #F5F5F5 / 보조 #A3A3A3 / 흐림 #6B6B6B
색면(위에 #171717 검은 글씨): 시안 #22D3EE · HIGH #FF8A00 · CRITICAL #FF3B30
Pretendard 하나:
  H1 700 24px/30px 자간-.02em (최상위) / H2 700 17px/24px / Body 500 15px/22px
  Meta 400 13px/18px / Label 700 11px/12px 자간.08em 대문자
  한자 700 12px/1 Pretendard,serif / 배지 700 12px/1
레이아웃: 좌우 패딩 20px · 상단바 40px · 섹션 margin-top 28px · 라벨 아래 12px
  행 border-top 1px #2E2E2E · gap 14px · 내부 세로 gap 5px
  마커 열 width 20px · 배지 height 22px padding 0 7px
절대 규칙: radius 0 (체크박스 원형만 예외) / shadow·글로우 없음 / 이모지 없음 /
  카드 박스 없음 / 좌측 정렬 / pill 금지 / 스포트라이트 효과 금지

[캔버스] 390×844
──────────────────────────────
★ 최우선 원칙: "MUST DO"가 "WHAT CHANGED"보다 반드시 위에 온다.
  이 앱은 법률을 설명하는 앱이 아니라 행동을 시키는 앱이다.

1) 상단 바 40px — 좌측 "←" 얇은 화살표 하나 / 우측 "저장" Meta 흐림색

2) 헤더 (배경 그라데이션 없음, 완전 평면)
   Label 흐림색 "DECREE 37/2026"
   H1 "식품 라벨 표시 규정
       전면 개정."                      2줄, 마침표 포함, margin-top 8px
   Meta 보조색 "VN 베트남 · 2026.01.23 시행"     margin-top 10px
   그 아래 인라인 #FF8A00 색면 배지 (height 22px, padding 0 7px)
     위에 #171717 검은 글씨 "HIGH · D-45"

3) 경과규정 — 좌측 세로 3px #22D3EE 실선 + 좌측 패딩 12px. 박스 아님.
   Label 흐림색 "경과규정"
   Body "기존 인쇄 포장재는 2028.01.22까지 소진 허용"

4) 섹션 라벨 "MUST DO — 4"   (margin-top 28px)
   체크리스트 4행. border-top 1px #2E2E2E. 행 높이 66px. gap 14px.
   행 구조:
     좌측 width 20px — 16×16 원형 빈 체크박스, 1px #6B6B6B 테두리
                        (align-self flex-start, margin-top 14px)
                        ★ 이 화면에서 유일하게 곡선이 허용되는 요소
     중앙 세로 gap 5px — Body 본문색 액션 문구
                         Meta 흐림색 "품질팀 · 2주 · ~10.15"  (칩 아님, 텍스트)
   01 라벨 시안에 원산지 영문표기 반영    품질팀 · 2주 · ~10.15
   02 최소 글꼴 0.9mm 이상 확인           디자인 · 3일
   03 영양성분표 삽입 (Circular 29 연계)  품질팀 · 4주
   04 구포장 재고 소진 계획 수립          영업 · 1주

5) 섹션 라벨 "WHAT CHANGED"
   2블록. 좌우 2단이 아니라 위아래 2행. 블록 간 border-top 1px #2E2E2E, 패딩 세로 14px.
     Label 흐림색 "BEFORE" / Body #6B6B6B 취소선
     Label #22D3EE "AFTER"  / Body #F5F5F5
   블록1 BEFORE 원산지는 베트남어 표기만 허용
         AFTER  영문 허용 — Origin, Made in, Product of
   블록2 BEFORE 영양성분 표시 권장
         AFTER  에너지·단백질·당류 표시 의무

6) 섹션 라벨 "AFFECTED — 3"
   3행, border-top 1px #2E2E2E, 행 높이 44px. 썸네일 없음.
     Body 제품명 ······ Meta 흐림색 tabular "HS 2103.90" ······ 우측 위험도 텍스트(해당 색)
   김치양념 소스 / HS 2103.90 / HIGH
   조미김       / HS 2008.99 / HIGH
   고추장       / HS 2103.90 / MEDIUM

7) 섹션 라벨 "SOURCE"
   언어 토글 — 텍스트 2개, 버튼 아님
     "원문 VN"(#F5F5F5 밑줄) · "번역 KO"(#6B6B6B)
   Body "Decree 37/2026/ND-CP"
   Meta 흐림색 "베트남 정부 관보 · 2026.01.10 공포"
   Meta #22C55E "최종 확인 2026.09.01"

8) 하단 고정 바 (높이 56px, 배경 #171717, 상단 1px #2E2E2E)
   폭 100% #22D3EE 꽉 찬 색면 버튼, 직각, 높이 44px
   위에 #171717 검은 글씨 H2 "액션 4건 담기"
```

---

## S4. Company

```
앞서 만든 NEO 화면들과 완전히 같은 시스템으로 이어서 만들어줘.

[S1 실측 스펙 — 이 값 그대로]
배경 #171717 / 표면 #212121 / 헤어라인 #2E2E2E
본문 #F5F5F5 / 보조 #A3A3A3 / 흐림 #6B6B6B
색면(위에 #171717 검은 글씨): 시안 #22D3EE · CRITICAL #FF3B30 · HIGH #FF8A00 · MEDIUM #E0A800
Pretendard 하나:
  H1 700 24px/30px 자간-.02em (최상위) / H2 700 17px/24px / Body 500 15px/22px
  Meta 400 13px/18px / Label 700 11px/12px 자간.08em 대문자 / 배지 700 12px/1
레이아웃: 좌우 패딩 20px · 상단바 40px · 섹션 margin-top 28px · 라벨 아래 12px
  행 border-top 1px #2E2E2E · gap 14px · 내부 세로 gap 5px
절대 규칙: radius 0 / shadow·호버광원 없음 / 이모지 없음(국가는 VN) /
  좌측 정렬 / pill 금지 / 아이콘 최소화

[캔버스] 390×844
──────────────────────────────
화면: Company (탭 3번째)

1) 상단 바 40px — 좌측 "NEO" Label / 우측 "설정" Meta 흐림색

2) 회사 정보 — 카드가 아니라 조판된 정보 블록
   H1 "한맛식품."
   Meta 보조색 "식품·음료 · 조미료/소스류"       margin-top 10px

   2열 정보 테이블 (margin-top 20px)
     각 행 border-top 1px #2E2E2E, 높이 44px, gap 14px
     좌열 width 96px — Label 흐림색
     우열 flex:1 — Body 본문색
     EXPORT     VN 베트남   +  "(+2개국 예정)" 부분만 #6B6B6B
     HS CODE    2103.90 · 2008.99 · 2007.99        ← tabular-nums
     PRODUCTS   4
     LAWS       5

3) 섹션 라벨 "PRIORITIES — 3"
   2×2 그리드. 카드가 아니라 색면 타일. 간격 2px(거의 붙임). 타일 높이 108px.
   타일 = 배경 #212121 직각 사각형, 테두리 없음, 내부 패딩 14px
          상단에 폭 100% 4px 위험도 색 가로 바
   타일1  4px #FF8A00 / H2 "라벨링·표시" / Meta 흐림색 "법률 3 · 미완 5"
          / 하단에 Label #FF8A00 "HIGH"
   타일2  4px #E0A800 / "식품안전·인증" / "법률 2 · 미완 2" / Label #E0A800 "MEDIUM"
   타일3  4px #FF3B30 / "포장·환경"     / "법률 1 · 미완 3" / Label #FF3B30 "CRITICAL"
   타일4  배경 없음 + 1px #2E2E2E 실선 테두리(점선 아님)
          좌측 하단에 Body 흐림색 "+ 영역 추가"    ← 중앙 정렬 금지

4) 섹션 라벨 "PRODUCTS — 4"
   4행, border-top 1px #2E2E2E, 높이 44px. 썸네일 없음.
     Body 제품명 ······ Meta 흐림색 tabular "HS 2103.90" ······ 우측 Meta 흐림색 "법률 3"
   김치양념 소스 / 2103.90 / 법률 3
   조미김       / 2008.99 / 법률 3
   고추장       / 2103.90 / 법률 2
   유자청       / 2007.99 / 법률 1

5) 텍스트 링크 (버튼 아님, margin-top 28px)
   Body #22D3EE 밑줄 "맞춤 분석 다시 실행"

6) 하단 여백 80px + 탭바 — COMPANY 활성 (상단 2px #22D3EE 직선)
```

---

## S6. Notifications

```
앞서 만든 NEO 화면들과 완전히 같은 시스템으로 이어서 만들어줘.

[S1 실측 스펙 — 이 값 그대로]
배경 #171717 / 헤어라인 #2E2E2E / 본문 #F5F5F5 / 보조 #A3A3A3 / 흐림 #6B6B6B
색면(위에 #171717 검은 글씨): 시안 #22D3EE · 보류 #C084FC
  CRITICAL #FF3B30 · HIGH #FF8A00 · MEDIUM #E0A800 · LOW #22C55E
Pretendard 하나:
  H1 700 24px/30px 자간-.02em (최상위) / H2 700 17px/24px / Body 500 15px/22px
  Meta 400 13px/18px / Label 700 11px/12px 자간.08em 대문자
레이아웃: 좌우 패딩 20px · 상단바 40px · 섹션 margin-top 28px · 라벨 아래 12px
  행 border-top 1px #2E2E2E · gap 14px · 내부 세로 gap 5px
절대 규칙: radius 0 / shadow 없음 / 이모지 없음 / 원형 아이콘 배경 금지 /
  카드 박스 없음 / 좌측 정렬 / pill 금지

[캔버스] 390×844
──────────────────────────────
화면: Notifications (S1 상단 알림 배지에서 진입)

1) 상단 바 40px — 좌측 "←" / 우측 "모두 읽음" Meta 흐림색

2) H1 "알림."
   Meta 흐림색 "읽지 않음 3"        margin-top 10px

3) 푸시 권한 — 배너 카드가 아니라 색면 블록 (margin-top 20px)
   #22D3EE 꽉 찬 직사각, 높이 64px, padding 0 14px
   위에 #171717 검은 글씨:
     H2 "시행일 알림 켜기"
     Meta "D-7에 미리 알려드립니다"
   우측 끝에 검은 "×"

4) 그룹 라벨 "TODAY"   (margin-top 28px)
   알림 행. border-top 1px #2E2E2E. 높이 78px. gap 14px.
   원형 아이콘 배경 없음.
   행 구조:
     좌측 flex:none width 4px — 행 높이 전체를 채우는 세로 색 바
     중앙 flex:1 세로 gap 5px —
        Label 유형(해당 색)
        H2 제목 (1줄 말줄임)
        Meta 흐림색 설명 1줄
     우측 flex:none — Meta 흐림색 시간
        미읽음이면 시간 아래 6×6 정사각 #22D3EE (원형 아님)

   ▌#FF3B30  시행 임박
             EPR 재활용 계획 등록 D-14
             포장재 전 품목이 해당됩니다          2시간 전 ■
   ▌#C084FC  상태 변경
             Decree 46/2026 시행이 보류됐습니다
             개정 식품안전법 시행 시까지          6시간 전 ■

5) 그룹 라벨 "THIS WEEK"
   ▌#FF8A00  신규 규제
             식품 라벨 표시 규정이 전면 개정됐습니다
             제품 3 영향 · 액션 4                 2일 전 ■
   ▌#22C55E  액션 완료
             영양성분 시험성적서 확보 완료
             CIRCULAR 29/2023                    4일 전
             ★ 읽음 — 행 전체 opacity .5

6) 그룹 라벨 "EARLIER"
   ▌#E0A800  신규 규제
             수입식품 검사 절차 변경 안내
             DECREE 15/2018 관련                  09.28    ★ opacity .5
   같은 스타일 읽음 행 1개 더

7) 하단 여백 40px. 이 화면은 탭바 없음.
```

---

## S5. Map — 마지막

```
앞서 만든 NEO 화면들과 완전히 같은 시스템으로 이어서 만들어줘.
특히 S1 Home 지구본의 흑백 도트 스타일과 "화면 밖으로 흘리는" 배치를 그대로 이어가줘.

[S1 실측 스펙 — 이 값 그대로]
배경 #171717 / 표면 #212121 / 헤어라인 #2E2E2E
본문 #F5F5F5 / 보조 #A3A3A3 / 흐림 #6B6B6B
색면(위에 #171717 검은 글씨): 시안 #22D3EE · 보류 #C084FC
  CRITICAL #FF3B30 · HIGH #FF8A00 · MEDIUM #E0A800
Pretendard 하나:
  H1 700 24px/30px 자간-.02em (최상위) / H2 700 17px/24px / Body 500 15px/22px
  Meta 400 13px/18px / Label 700 11px/12px 자간.08em 대문자
  한자 700 12px/1 Pretendard,serif / 배지 700 12px/1
레이아웃: 좌우 패딩 20px · 행 border-top 1px #2E2E2E · gap 14px · 내부 세로 gap 5px
  마커 열 width 20px · 배지 height 22px padding 0 7px
절대 규칙: radius 0 / shadow·글로우·펄스링 없음 / 이모지 없음 /
  좌측 정렬 / pill 금지 / 3D 구체 금지

[캔버스] 390×844
──────────────────────────────
화면: Map (탭 4번째) — 전체화면 평면 점지도 + 하단 시트

1) 배경: 전체화면 SVG 점지도. 동아시아~동남아 중심.
   육지가 균일한 격자 점으로만 그려진다. 점 색 #3A3A3A, 크기·간격 일정.
   바다는 완전히 비어 #171717. 국경선·지명·도로·격자선 전부 없음.
   ★ 평면 지도다. 구체 아님. 왜곡 없이 평평하게.
   ★ S1 지구본처럼 지도를 캔버스 우측 밖으로 흘려보내 좌측에 여백을 남긴다.
     (S1은 width 296px에 margin-right -36px 였다. 같은 어법으로.)

2) 항로: 한국 → 베트남 곡선 1px 흰 실선. 발광 없음.
   선 위에 흐르는 정사각 도트 3개, 흰색, 뒤로 갈수록 흐려짐.
   출발점(한국) 4×4 흰 정사각 / 도착점(베트남) 6×6 #FF3B30 정사각. 펄스 링 없음.

3) 국가 마커 — 원형 도트 아님. 정사각 + 우측 라벨.
   VN  6×6 #FF3B30 정사각 + Label #F5F5F5 "VN · HIGH"
   ID  4×4 #6B6B6B 정사각 + Label #6B6B6B "ID · 곧 지원"
   TH  4×4 #6B6B6B 정사각 + Label #6B6B6B "TH · 곧 지원"
   KR  4×4 #F5F5F5 정사각 + Label #6B6B6B "KR · 출발"

4) 상단 바 40px — 배경 투명
   좌측 "NEO" Label / 우측 "필터" Meta 흐림색
   그 아래 검색 — 하단 1px #2E2E2E 선만, 높이 44px, 흐림색 "국가 검색"

5) 하단 시트 (높이 320px, 탭바 위에 겹침)
   배경 #212121, 상단 1px #2E2E2E. 라운드 없음 — 직각.
   상단 중앙 36×3 #6B6B6B 드래그 핸들   ← 이 화면 유일한 중앙 정렬 요소

   H1 "베트남."
     그 옆 인라인 #FF8A00 색면 배지 (height 22px, padding 0 7px) 검은 글씨 "HIGH"
   Meta 흐림색 "규제 5 · 미완 액션 10"        margin-top 10px

   3행 (margin-top 20px), border-top 1px #2E2E2E, 행 높이 62px, gap 14px:
     좌측 width 20px 한자 마커
     중앙 세로 gap 5px — Label 흐림색 법령코드 / H2 제목 1줄 말줄임
     우측 D-Day 색면 배지
   施(#22D3EE)  DECREE 37/2026   식품 라벨 표시 규정 전면 개정   D-45 (#E0A800)
   施(#22D3EE)  DECREE 110/2026  생산자책임재활용(EPR) 시행      D-14 (#FF3B30)
   留(#C084FC)  DECREE 46/2026   식품안전법 시행령 개정          보류 (#C084FC)

   Body #22D3EE 밑줄 "법률 5건 모두 보기"     좌측 정렬, margin-top 16px

6) 하단 탭바 — MAP 활성 (상단 2px #22D3EE 직선). 시트 위에 떠 있음.
```

---

## 검수 체크리스트 (S2~S6 공통)

S1과 나란히 놓고 본다. 위 6개가 핵심이다.

- [ ] `border-radius`가 0인가 (S3 체크박스만 예외)
- [ ] `box-shadow`가 하나도 없는가
- [ ] 테두리가 전부 `1px solid #2E2E2E` 인가
- [ ] 색이 꽉 찬 면이고 그 위 글씨가 `#171717` 검은색인가
- [ ] 이모지가 하나도 없는가
- [ ] **화면 제목이 H1 24px인가** — 32px Display가 튀어나오면 S1과 어긋난다
- [ ] 한자 마커에 `Pretendard,serif` 폴백이 붙었는가
- [ ] Label이 `700 11px/12px` + 자간 `.08em` 대문자인가
- [ ] 섹션 간격이 28px, 라벨 아래가 12px인가
- [ ] 좌측 마커·순번 열이 width 20px 고정인가
- [ ] 색면 배지가 height 22px · padding 0 7px 인가
- [ ] 탭바가 텍스트만이고 활성 탭 위 2px `#22D3EE` 직선인가
- [ ] S3에서 "MUST DO"가 "WHAT CHANGED"보다 위인가

---

## 이 다음

S2~S6가 나오면 6화면을 한 번에 대조해서 어긋난 값을 잡고, 그 다음 **3단계(Claude Code 작업 정리)** 로 넘어간다. 3단계에서 만들 것:

- 화면 → 라우트 매핑과 컴포넌트 트리
- `globals.css` 디자인 토큰 (위 실측값 그대로)
- 데이터 스키마 (PRD v2 §5) → TypeScript 타입 + 목 데이터
- PWA 설정 (manifest, service worker 캐싱 전략, Web Push)
- shadcn 레지스트리 3종 등록 + 컴포넌트 설치 명령
- 빈/로딩/에러/오프라인 상태 구현 목록
