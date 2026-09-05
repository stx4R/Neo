/* neo-geo — dot-matrix geography for NEO (globe + flat Asia map).
   Real Natural Earth geometry via d3-geo + world-atlas TopoJSON. */
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

  const KEYS = 'neo-geo-keys';
  function keyframes() {
    if (document.getElementById(KEYS)) return;
    const st = document.createElement('style');
    st.id = KEYS;
    st.textContent = '@keyframes neoPulse{0%{transform:translate(-50%,-50%) scale(.35);opacity:.85}70%{opacity:0}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}';
    document.head.appendChild(st);
  }

  const CYAN = '34,211,238';
  const P = {
    globe: { from: [129.0, 35.1], to: [105.9, 20.9], step: 5, dot: 1.05 },
    asia: { from: [129.0, 35.1], to: [105.9, 20.9], step: 6, dot: 1.15 }
  };

  class NeoGeo extends HTMLElement {
    connectedCallback() {
      if (this._init) { this.attach(); return; }
      this._init = true;
      keyframes();
      this.style.display = 'block';
      this.style.position = this.style.position || 'relative';
      if (!this.style.width) this.style.width = '100%';
      if (!this.style.height) this.style.height = '100%';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(c);
      this._c = c;
      const ov = document.createElement('div');
      ov.style.cssText = 'position:absolute;inset:0;pointer-events:none';
      this.appendChild(ov);
      this._ov = ov;
      land().then(f => {
        this._land = f;
        this.schedule();
      }).catch(e => console.warn('neo-geo load failed', e));
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
    arrow(ctx, t, alpha, size) {
      const p = this.qpt(t), q = this.qpt(Math.min(1, t + 0.02));
      const ang = Math.atan2(q[1] - p[1], q[0] - p[0]);
      ctx.save();
      ctx.translate(p[0], p[1]);
      ctx.rotate(ang);
      ctx.fillStyle = 'rgba(' + CYAN + ',' + alpha + ')';
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.8, size * 0.72);
      ctx.lineTo(-size * 0.8, -size * 0.72);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    build() {
      if (!this._land) return;
      const r = this.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      if (!w || !h) { this.schedule(); return; }
      const mode = this.getAttribute('mode') === 'asia' ? 'asia' : 'globe';
      const cfg = P[mode];
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this._c.width = w * dpr; this._c.height = h * dpr;

      let proj;
      if (mode === 'asia') {
        proj = d3.geoMercator().fitExtent([[6, 6], [w - 6, h - 6]],
          { type: 'MultiPoint', coordinates: [[93, -14], [143, 45]] });
      } else {
        proj = d3.geoOrthographic().rotate([-114, -16])
          .translate([w / 2, h / 2]).scale(Math.min(w, h) / 2 - 4).clipAngle(90);
      }

      // land mask (css-pixel resolution) → uniform screen-space dot grid
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
      const gp = d3.geoPath(proj, b);

      if (mode === 'globe') {
        const g = b.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.min(w, h) * 0.62);
        g.addColorStop(0, 'rgba(' + CYAN + ',0.055)');
        g.addColorStop(1, 'rgba(' + CYAN + ',0)');
        b.fillStyle = g;
        b.fillRect(0, 0, w, h);
      }

      b.lineWidth = 1;
      b.strokeStyle = mode === 'globe' ? 'rgba(' + CYAN + ',0.075)' : 'rgba(30,43,69,0.55)';
      b.beginPath();
      gp(d3.geoGraticule10());
      b.stroke();

      if (mode === 'globe') {
        b.strokeStyle = 'rgba(' + CYAN + ',0.2)';
        b.beginPath();
        gp({ type: 'Sphere' });
        b.stroke();
      }

      const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2;
      for (let y = cfg.step / 2; y < h; y += cfg.step) {
        for (let x = cfg.step / 2; x < w; x += cfg.step) {
          if (px[((y | 0) * w + (x | 0)) * 4 + 3] < 120) continue;
          let a = 0.52;
          if (mode === 'globe') {
            const d = Math.hypot(x - cx, y - cy) / R;
            a = 0.6 - 0.34 * d * d;
          }
          b.fillStyle = 'rgba(' + CYAN + ',' + a.toFixed(3) + ')';
          b.beginPath();
          b.arc(x, y, cfg.dot, 0, 6.2832);
          b.fill();
        }
      }

      // shipping arc
      const p0 = proj(cfg.from), p1 = proj(cfg.to);
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      let nx, ny;
      if (mode === 'globe') {
        let vx = mx - cx, vy = my - cy;
        const l = Math.hypot(vx, vy) || 1;
        nx = vx / l; ny = vy / l;
      } else {
        const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
        const l = Math.hypot(dx, dy) || 1;
        nx = -dy / l; ny = dx / l;
        if (ny > 0) { nx = -nx; ny = -ny; }
      }
      const span = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      const bulge = span * (mode === 'globe' ? 0.42 : 0.34);
      this._arc = { p0: p0, p1: p1, ctrl: [mx + nx * bulge * 2, my + ny * bulge * 2] };

      b.save();
      b.lineCap = 'round';
      b.shadowColor = 'rgba(' + CYAN + ',0.55)';
      b.shadowBlur = 14;
      b.strokeStyle = 'rgba(' + CYAN + ',0.9)';
      b.lineWidth = 1.8;
      b.beginPath();
      b.moveTo(p0[0], p0[1]);
      b.quadraticCurveTo(this._arc.ctrl[0], this._arc.ctrl[1], p1[0], p1[1]);
      b.stroke();
      b.shadowBlur = 0;
      b.stroke();
      b.restore();

      if (mode === 'globe') {
        this.arrow(b, 0.55, 0.95, 4.6);
      } else {
        this.arrow(b, 0.78, 0.95, 5);
        this.arrow(b, 0.62, 0.5, 4.4);
        this.arrow(b, 0.46, 0.22, 4);
      }

      // origin: hollow cyan ring
      b.strokeStyle = 'rgba(' + CYAN + ',0.95)';
      b.lineWidth = 1.6;
      b.beginPath();
      b.arc(p0[0], p0[1], 4.2, 0, 6.2832);
      b.stroke();
      // destination: filled critical dot
      b.fillStyle = '#FF4D6A';
      b.shadowColor = 'rgba(255,77,106,0.7)';
      b.shadowBlur = 10;
      b.beginPath();
      b.arc(p1[0], p1[1], 4.2, 0, 6.2832);
      b.fill();
      b.shadowBlur = 0;

      this._bg = bg;
      this._size = { w: w, h: h, dpr: dpr };

      // pulse rings on the destination
      this._ov.textContent = '';
      const ringSize = mode === 'globe' ? 46 : 60;
      for (let i = 0; i < 2; i++) {
        const d = document.createElement('div');
        d.style.cssText = 'position:absolute;left:' + p1[0] + 'px;top:' + p1[1] + 'px;width:' + ringSize +
          'px;height:' + ringSize + 'px;margin:0;border:1px solid rgba(255,77,106,0.75);border-radius:999px;' +
          'transform:translate(-50%,-50%) scale(.35);animation:neoPulse 2.8s ' + (i * 1.4) + 's linear infinite';
        this._ov.appendChild(d);
      }

      if (!this._raf) this.loop();
    }
    loop() {
      this._raf = requestAnimationFrame(() => this.loop());
      if (!this._bg) return;
      const s = this._size;
      const ctx = this._c.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this._c.width, this._c.height);
      ctx.drawImage(this._bg, 0, 0);
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      const t0 = (performance.now() % 3400) / 3400;
      for (let i = 0; i < 2; i++) {
        let t = t0 + i * 0.5;
        t -= Math.floor(t);
        const p = this.qpt(t);
        const fade = Math.sin(Math.PI * t);
        ctx.fillStyle = 'rgba(' + CYAN + ',' + (0.9 * fade).toFixed(3) + ')';
        ctx.shadowColor = 'rgba(' + CYAN + ',0.9)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2.2, 0, 6.2832);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
  if (!customElements.get('neo-geo')) customElements.define('neo-geo', NeoGeo);
})();
