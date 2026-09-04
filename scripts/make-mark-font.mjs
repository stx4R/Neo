// 한자 상태 마커 3글자만 Noto Serif KR에서 서브셋한다.
// 施 留 豫 는 Pretendard에 없어서 serif로 떨어지는데, 어느 serif로 떨어질지가
// 기기마다 달라 앱의 서명 요소가 플랫폼별로 다른 골격이 된다. 그걸 고정한다.
//
// 재생성:
//   npm i -D @fontsource/noto-serif-kr subset-font
//   node <이 파일>
//   npm uninstall @fontsource/noto-serif-kr subset-font

import { readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const SRC = 'node_modules/@fontsource/noto-serif-kr';
const OUT = 'public/fonts';

// 디자인의 .t-mark 는 700 이다. 청크 번호는 unicode.json 에서 찾았다.
const MARKS = [
  { char: '施', cp: 0x65bd, chunk: 84 },
  { char: '留', cp: 0x7559, chunk: 77 },
  { char: '豫', cp: 0x8c6b, chunk: 69 },
];

const WEIGHT = 700;

for (const m of MARKS) {
  const src = `${SRC}/files/noto-serif-kr-${m.chunk}-${WEIGHT}-normal.woff2`;
  const buf = await readFile(src);
  const out = await subsetFont(buf, m.char, { targetFormat: 'woff2' });
  const name = `neo-mark-${m.cp.toString(16).toUpperCase()}.woff2`;
  await writeFile(`${OUT}/${name}`, out);
  console.log(
    `${m.char}  U+${m.cp.toString(16).toUpperCase()}  chunk ${m.chunk}  ` +
      `${buf.length}B → ${out.length}B  ${name}`,
  );
}
