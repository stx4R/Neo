// PWA 아이콘을 design/mobile.png 하나에서 만든다.
//
// 원본은 992×1069 흑백 픽셀아트 법봉이다. 그대로 쓰지 않는 이유가 셋 있다.
//   1. 정사각형이 아니다. iOS는 apple-touch-icon을 레터박스하지 않고 늘린다 — 7% 찌그러진다.
//   2. 흰 배경이다. 앱은 #171717인데 아이콘만 흰 판이 되면 홈 화면에서 끊긴다.
//   3. 173KB다. 아이콘 하나에 그만큼 쓸 이유가 없다.
// 그래서 잉크 경계를 재서 정사각 캔버스에 다시 앉히고, 색을 앱 토큰으로 갈아입힌다.
//
// 외부 이미지 라이브러리를 쓰지 않는다. 원본이 8비트 RGBA 비인터레이스 PNG라
// zlib 하나로 디코드된다. 인코드도 IHDR·IDAT·IEND 셋뿐이다.
//
// 색은 app/globals.css의 토큰에서 읽는다. 여기에 색을 두 번 적지 않는다.
//
// 재생성:
//   node scripts/make-icons.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

const SRC = 'design/mobile.png';
const OUT = 'public/icons';

/**
 * 글리프가 아이콘에서 차지하는 비율.
 *
 * maskable은 any × 0.8이다. maskable 안전영역이 캔버스의 중앙 80%라서,
 * 안전영역 대비 비율을 any의 캔버스 대비 비율과 같게 맞춘 값이다.
 * 두 아이콘이 각자의 틀 안에서 같은 무게로 보인다.
 */
const COVER_ANY = 0.68;
const COVER_MASKABLE = COVER_ANY * 0.8;

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
  const hex = found[1].slice(1);
  const n = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
}

// ── PNG ────────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** 8비트 RGBA 비인터레이스만 읽는다. 원본이 그것이고, 그 이상은 필요 없다. */
function decode(buf) {
  let o = 8;
  const idat = [];
  let head;
  while (o < buf.length) {
    const len = buf.readUInt32BE(o);
    const type = buf.toString('ascii', o + 4, o + 8);
    const data = buf.subarray(o + 8, o + 8 + len);
    if (type === 'IHDR') {
      head = {
        w: data.readUInt32BE(0),
        h: data.readUInt32BE(4),
        depth: data[8],
        color: data[9],
        interlace: data[12],
      };
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    o += 12 + len;
  }
  if (head.depth !== 8 || head.color !== 6 || head.interlace !== 0) {
    throw new Error(`${SRC}: 8비트 RGBA 비인터레이스가 아니다`);
  }

  const { w, h } = head;
  const bpp = 4;
  const stride = w * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(h * stride);

  let p = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[p++];
    const row = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[row + x - bpp] : 0;
      const b = y ? px[row - stride + x] : 0;
      const c = y && x >= bpp ? px[row - stride + x - bpp] : 0;
      const v = raw[p + x];
      let add = 0;
      if (filter === 1) add = a;
      else if (filter === 2) add = b;
      else if (filter === 3) add = (a + b) >> 1;
      else if (filter === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        add = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[row + x] = (v + add) & 0xff;
    }
    p += stride;
  }
  return { w, h, px };
}

function encode(size, rgb) {
  const stride = size * 3;
  const raw = Buffer.alloc(size * (stride + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: None. 색이 몇 안 되어 이대로도 잘 줄어든다.
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8비트
  ihdr[9] = 2; // 트루컬러, 알파 없음 — 아이콘 배경은 항상 꽉 찬 면이다
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── 만든다 ──────────────────────────────────────────────────────────────

const bg = await token('bg');
const fg = await token('accent');
const { w, h, px } = decode(await readFile(SRC));

/**
 * 잉크 농도 0~1. 원본은 흰 바탕에 검은 선이라 "불투명하고 어두울수록 1"이면 된다.
 * 이진화하지 않는다 — 원본 가장자리의 안티에일리어싱을 그대로 물려받아야
 * 축소했을 때 계단이 지지 않는다.
 */
const ink = new Float32Array(w * h);
for (let i = 0; i < w * h; i++) {
  const r = px[i * 4];
  const g = px[i * 4 + 1];
  const b = px[i * 4 + 2];
  const a = px[i * 4 + 3] / 255;
  ink[i] = a * (1 - (r + g + b) / 765);
}

// 잉크 경계. 원본은 위아래 여백이 대칭이 아니라 캔버스 중심에 그냥 놓으면 안 된다.
let x0 = w;
let y0 = h;
let x1 = -1;
let y1 = -1;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (ink[y * w + x] > 0.5) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
if (x1 < 0) throw new Error(`${SRC}: 잉크가 없다`);

const inkW = x1 - x0 + 1;
const inkH = y1 - y0 + 1;
const cx = x0 + inkW / 2;
const cy = y0 + inkH / 2;
console.log(`원본 ${w}×${h} · 잉크 ${inkW}×${inkH} @ (${x0},${y0})`);

/** 목적지 한 픽셀이 덮는 원본 사각형의 잉크 평균. 축소는 넓이 평균이라야 선이 살아남는다. */
function coverage(sx0, sx1, sy0, sy1) {
  const ax0 = Math.max(0, Math.floor(sx0));
  const ax1 = Math.min(w, Math.ceil(sx1));
  const ay0 = Math.max(0, Math.floor(sy0));
  const ay1 = Math.min(h, Math.ceil(sy1));
  let sum = 0;
  let area = 0;
  for (let y = ay0; y < ay1; y++) {
    const fy = Math.min(y + 1, sy1) - Math.max(y, sy0);
    if (fy <= 0) continue;
    for (let x = ax0; x < ax1; x++) {
      const fx = Math.min(x + 1, sx1) - Math.max(x, sx0);
      if (fx <= 0) continue;
      sum += ink[y * w + x] * fx * fy;
      area += fx * fy;
    }
  }
  // 캔버스가 원본 밖으로 나간 몫은 잉크 0으로 친다 — 전체 넓이로 나눈다.
  const full = (sx1 - sx0) * (sy1 - sy0);
  return area > 0 ? sum / full : 0;
}

for (const { file, size, cover } of TARGETS) {
  const k = (cover * size) / Math.max(inkW, inkH);
  const rgb = Buffer.alloc(size * size * 3);
  for (let dy = 0; dy < size; dy++) {
    const sy0 = (dy - size / 2) / k + cy;
    const sy1 = (dy + 1 - size / 2) / k + cy;
    for (let dx = 0; dx < size; dx++) {
      const sx0 = (dx - size / 2) / k + cx;
      const sx1 = (dx + 1 - size / 2) / k + cx;
      const t = coverage(sx0, sx1, sy0, sy1);
      const o = (dy * size + dx) * 3;
      for (let c = 0; c < 3; c++) rgb[o + c] = Math.round(bg[c] + (fg[c] - bg[c]) * t);
    }
  }
  const png = encode(size, rgb);
  await writeFile(join(OUT, file), png);
  console.log(`${file}  ${size}×${size}  법봉 ${(cover * 100).toFixed(1)}%  ${png.length}B`);
}
