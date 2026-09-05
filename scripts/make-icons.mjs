// PWA 아이콘을 앱의 서명인 施 하나로 만든다.
//
// 기기 폰트에 기대지 않는다 — 앱이 실제로 배포하는 public/fonts/neo-mark-65BD.woff2를
// 그대로 래스터화한다. 施가 플랫폼마다 다른 골격으로 찍히는 것을 막으려고 그 폰트를
// 자체 호스팅했는데(DISCREPANCIES 한자 마커 항목), 아이콘이 시스템 명조로 찍히면
// 같은 문제가 홈 화면에서 되살아난다.
//
// resvg의 fontdb는 woff2를 읽지 못한다("malformed font"). 그래서 wawoff2로 압축만
// 풀어 임시 ttf로 넘긴다 — 아웃라인은 손대지 않으므로 앱이 쓰는 글리프와 같다.
//
// 색은 app/globals.css의 토큰에서 읽는다. 여기에 색을 두 번 적지 않는다.
//
// 재생성:
//   npm i -D @resvg/resvg-js wawoff2
//   node scripts/make-icons.mjs

import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { decompress } from 'wawoff2';

const MARK = '施';
const FONT = 'public/fonts/neo-mark-65BD.woff2';
const OUT = 'public/icons';

/**
 * 글리프가 아이콘에서 차지하는 비율.
 *
 * maskable은 any × 0.8이다. maskable 안전영역이 캔버스의 중앙 80%라서,
 * 안전영역 대비 글리프 비율을 any의 캔버스 대비 비율과 같게 맞춘 값이다.
 * 두 아이콘이 각자의 틀 안에서 같은 무게로 보인다.
 */
const COVER_ANY = 0.68;
const COVER_MASKABLE = COVER_ANY * 0.8;

/** 측정용 좌표계. 실제 크기와 무관하다 — bbox를 재고 버리는 용도다. */
const PROBE = { box: 1000, fontSize: 600, x: 500, baseline: 800 };

const TARGETS = [
  { file: 'icon-192.png', size: 192, cover: COVER_ANY },
  { file: 'icon-512.png', size: 512, cover: COVER_ANY },
  { file: 'icon-maskable-512.png', size: 512, cover: COVER_MASKABLE },
  { file: 'apple-touch-icon-180.png', size: 180, cover: COVER_ANY },
];

/** app/globals.css의 :root 토큰 값. */
async function token(name) {
  const css = await readFile('app/globals.css', 'utf8');
  const found = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{3,8})`));
  if (!found) throw new Error(`globals.css에 --${name}이 없다`);
  return found[1];
}

/** 글리프만 놓은 svg. 배경도 색도 없다 — 측정과 배치에 같은 문자열을 쓴다. */
function glyph(fill) {
  return (
    `<text x="${PROBE.x}" y="${PROBE.baseline}" font-size="${PROBE.fontSize}"` +
    ` text-anchor="middle" fill="${fill ?? '#000'}">${MARK}</text>`
  );
}

const bg = await token('bg');
const fg = await token('accent');

// resvg는 파일 경로만 받으므로 압축을 푼 ttf를 임시 파일로 둔다.
const ttf = join(tmpdir(), `neo-mark-${process.pid}.ttf`);
await writeFile(ttf, Buffer.from(await decompress(await readFile(FONT))));

// 폰트를 하나만 얹고 시스템 폰트를 끈다. 그래서 svg에 font-family를 적지 않는다 —
// 해석할 후보가 그 하나뿐이다.
const font = { loadSystemFonts: false, fontFiles: [ttf] };

try {
  // 1) 글리프의 잉크 경계를 잰다. 施는 좌우 여백이 대칭이 아니라
  //    advance width 기준으로 놓으면 눈으로 봤을 때 가운데가 아니다.
  const probe = new Resvg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PROBE.box}" height="${PROBE.box}">${glyph()}</svg>`,
    { font, logLevel: 'warn' },
  );
  const ink = probe.getBBox();
  if (!ink) throw new Error('글리프 bbox를 재지 못했다 — 폰트가 로드되지 않았다');

  await mkdir(OUT, { recursive: true });

  for (const { file, size, cover } of TARGETS) {
    // 2) 잉크 경계를 목표 비율로 키우고 그 중심을 캔버스 중심에 맞춘다.
    const k = (cover * size) / Math.max(ink.width, ink.height);
    const tx = size / 2 - k * (ink.x + ink.width / 2);
    const ty = size / 2 - k * (ink.y + ink.height / 2);

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<rect width="${size}" height="${size}" fill="${bg}"/>` +
      `<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${k.toFixed(6)})">${glyph(fg)}</g>` +
      `</svg>`;

    const png = new Resvg(svg, { font, logLevel: 'warn' }).render().asPng();
    await writeFile(join(OUT, file), png);
    console.log(`${file}  ${size}×${size}  글리프 ${(cover * 100).toFixed(1)}%  ${png.length}B`);
  }
} finally {
  await unlink(ttf).catch(() => {});
}
