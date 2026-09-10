/* neo-dots — monochrome dot-matrix geography (Natural Earth via d3-geo + TopoJSON).
   modes: globe (orthographic) | asia (flat mercator). No glow, no graticule, no rounding. */
(function () {
  const LIBS = [
    ['https://unpkg.com/d3@7.9.0/dist/d3.min.js', 'sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i'],
    ['https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js', 'sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67']
  ];
  function loadScript(src, integrity) {
    return new Promise((res, rej) => {
      const ex = document.querySelector('script[data-neo-src="' + src + '"]');
      if (ex) {
        if (ex.dataset.loaded) return res();
        ex.addEventListener('load', () => res());
        ex.addEventListener('error', rej);
        return;
      }
      const s = document.createElement('script');
      s.src = src; s.integrity = integrity; s.crossOrigin = 'anonymous';
      s.dataset.neoSrc = src;
      s.onload = () => { s.dataset.loaded = '1'; res(); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  let libsP = null, landP = null;
  function libs() {
    if (!libsP) libsP = loadScript(LIBS[0][0], LIBS[0][1]).then(() => loadScript(LIBS[1][0], LIBS[1][1]));
    return libsP;
  }
  function land() {
    if (!landP) landP = libs()
      .then(() => d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json'))
      .then(t => topojson.feature(t, t.objects.countries));
    return landP;
  }

  const DOT = '#6B6B6B';
  const CRIT = '#FF3B30';
  const FROM = [129.0, 35.1];   // Busan
  const TO = [105.9, 20.9];     // Haiphong
  const CFG = {
    globe: { step: 5.4, dot: 1.6 },
    asia: { step: 6.6, dot: 1.8 }
  };

  class NeoDots extends HTMLElement {
    connectedCallback() {
      if (this._init) { this.attach(); return; }
      this._init = true;
      this.style.display = 'block';
      this.style.position = this.style.position || 'relative';
      if (!this.style.width) this.style.width = '100%';
      if (!this.style.height) this.style.height = '100%';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(c);
      this._c = c;
      land().then(f => {
        this._land = f;
        this.schedule();
      }).catch(e => console.warn('neo-dots load failed', e));
      this.attach();
    }
    attach() {
      if (!this._ro) this._ro = new ResizeObserver(() => this.build());
      try { this._ro.observe(this); } catch (e) {}
      this.schedule();
    }
    schedule() {
      if (this._poll) return;
      let n = 0;
      this._poll = setInterval(() => {
        n++;
        this.build();
        if (this._bg || n > 60) { clearInterval(this._poll); this._poll = null; }
      }, 50);
      this.build();
    }
    disconnectedCallback() {
      if (this._ro) this._ro.disconnect();
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;
      if (this._poll) { clearInterval(this._poll); this._poll = null; }
    }
    qpt(t) {
      const a = this._arc, u = 1 - t;
      return [
        u * u * a.p0[0] + 2 * u * t * a.ctrl[0] + t * t * a.p1[0],
        u * u * a.p0[1] + 2 * u * t * a.ctrl[1] + t * t * a.p1[1]
      ];
    }
    build() {
      if (!this._land) return;
      const r = this.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      if (!w || !h) { this.schedule(); return; }
      const mode = this.getAttribute('mode') === 'asia' ? 'asia' : 'globe';
      const dotColor = this.getAttribute('dot-color') || this.getAttribute('dotcolor') || DOT;
      const cfg = CFG[mode];
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this._c.width = w * dpr; this._c.height = h * dpr;

      let proj;
      if (mode === 'asia') {
        proj = d3.geoMercator().fitExtent([[0, 0], [w, h]],
          { type: 'MultiPoint', coordinates: [[92, -12], [146, 47]] });
      } else {
        proj = d3.geoOrthographic().rotate([-116, -18])
          .translate([w / 2, h / 2]).scale(Math.min(w, h) / 2 - 2).clipAngle(90);
      }

      const m = document.createElement('canvas');
      m.width = w; m.height = h;
      const mc = m.getContext('2d');
      mc.fillStyle = '#fff';
      mc.beginPath();
      d3.geoPath(proj, mc)(this._land);
      mc.fill();
      const px = mc.getImageData(0, 0, w, h).data;

      const bg = document.createElement('canvas');
      bg.width = w * dpr; bg.height = h * dpr;
      const b = bg.getContext('2d');
      b.setTransform(dpr, 0, 0, dpr, 0, 0);

      // uniform square dots on land only; ocean stays empty
      const d = cfg.dot, o = d / 2;
      b.fillStyle = dotColor;
      for (let y = cfg.step / 2; y < h; y += cfg.step) {
        for (let x = cfg.step / 2; x < w; x += cfg.step) {
          if (px[((y | 0) * w + (x | 0)) * 4 + 3] < 120) continue;
          b.fillRect(Math.round(x - o), Math.round(y - o), d, d);
        }
      }

      const p0 = proj(FROM), p1 = proj(TO);
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      const cx = w / 2, cy = h / 2;
      let nx, ny;
      if (mode === 'globe') {
        const vx = mx - cx, vy = my - cy, l = Math.hypot(vx, vy) || 1;
        nx = vx / l; ny = vy / l;
      } else {
        const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1;
        nx = -dy / l; ny = dx / l;
        if (ny > 0) { nx = -nx; ny = -ny; }
      }
      const span = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      const bulge = span * (mode === 'globe' ? 0.34 : 0.3);
      this._arc = { p0: p0, p1: p1, ctrl: [mx + nx * bulge * 2, my + ny * bulge * 2] };

      b.strokeStyle = '#F5F5F5';
      b.lineWidth = 1;
      b.beginPath();
      b.moveTo(p0[0], p0[1]);
      b.quadraticCurveTo(this._arc.ctrl[0], this._arc.ctrl[1], p1[0], p1[1]);
      b.stroke();

      if (this.getAttribute('origin-marker') !== 'off') {
        b.fillStyle = '#F5F5F5';
        b.fillRect(Math.round(p0[0] - 2), Math.round(p0[1] - 2), 4, 4);
      }
      const ds = mode === 'asia' ? 6 : 4;
      b.fillStyle = CRIT;
      b.fillRect(Math.round(p1[0] - ds / 2), Math.round(p1[1] - ds / 2), ds, ds);

      this._bg = bg;
      this._size = { w: w, h: h, dpr: dpr };
      this._proj = proj;
      this.paint(0);
      this.dispatchEvent(new CustomEvent('neo-ready', {
        bubbles: true,
        detail: { mode: mode, project: proj, width: w, height: h }
      }));
      if (this.getAttribute('flow') === 'off') {
        if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
      } else if (!this._raf) this.loop();
    }
    paint(t0) {
      if (!this._bg || !this._size) return;
      const s = this._size;
      const ctx = this._c.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this._c.width, this._c.height);
      ctx.drawImage(this._bg, 0, 0);
      if (!t0 && t0 !== 0) return;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      for (let i = 0; i < 3; i++) {
        let t = t0 - i * 0.055;
        if (t < 0 || t > 1) continue;
        const p = this.qpt(t);
        ctx.fillStyle = 'rgba(245,245,245,' + (1 - i * 0.34).toFixed(2) + ')';
        ctx.fillRect(Math.round(p[0] - 1.5), Math.round(p[1] - 1.5), 3, 3);
      }
    }
    loop() {
      this._raf = requestAnimationFrame(() => this.loop());
      if (!this._bg) return;
      this.paint((performance.now() % 4200) / 4200);
    }
  }
  if (!customElements.get('neo-dots')) customElements.define('neo-dots', NeoDots);
})();
