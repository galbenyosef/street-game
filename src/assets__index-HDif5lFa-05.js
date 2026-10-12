// assets__index-HDif5lFa 05 — ctx
// Lines 25385-25734 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
var Il = class {
  ctx = null;
  maestro;
  rodar;
  brisa;
  ruido;
  grillos = 0;
  voces = {};
  noche = 0;
  desbloquear() {
    if (this.ctx) {
      this.ctx.resume();
      return;
    }
    let e = window.AudioContext || window.webkitAudioContext;
    this.montar(new e());
  }
  montar(e) {
    ((this.ctx = e),
      (this.maestro = e.createGain()),
      (this.maestro.gain.value = 0.85));
    let t = e.createDynamicsCompressor();
    ((t.threshold.value = -12),
      (t.ratio.value = 4),
      this.maestro.connect(t).connect(e.destination),
      (this.ruido = e.createBuffer(1, e.sampleRate * 2, e.sampleRate)));
    let n = this.ruido.getChannelData(0),
      r = 12345;
    for (let e = 0; e < n.length; e++)
      ((r = (r * 1103515245 + 12345) >>> 0), (n[e] = (r / 4294967296) * 2 - 1));
    let i = e.createBufferSource();
    ((i.buffer = this.ruido), (i.loop = !0));
    let a = e.createBiquadFilter();
    ((a.type = `bandpass`),
      (a.frequency.value = 650),
      (a.Q.value = 0.8),
      (this.rodar = e.createGain()),
      (this.rodar.gain.value = 0),
      i.connect(a).connect(this.rodar).connect(this.maestro),
      i.start());
    let o = e.createBufferSource();
    ((o.buffer = this.ruido), (o.loop = !0), (o.playbackRate.value = 0.5));
    let s = e.createBiquadFilter();
    ((s.type = `lowpass`),
      (s.frequency.value = 380),
      (this.brisa = e.createGain()),
      (this.brisa.gain.value = 0.05),
      o.connect(s).connect(this.brisa).connect(this.maestro),
      o.start());
  }
  ruidoCorto(e, t, n, r, i, a = `bandpass`) {
    let o = this.ctx,
      s = o.createBufferSource();
    ((s.buffer = this.ruido), (s.playbackRate.value = 1 + Math.random() * 0.3));
    let c = o.createBiquadFilter();
    ((c.type = a), (c.frequency.value = n), (c.Q.value = r));
    let l = o.createGain();
    (l.gain.setValueAtTime(i, e),
      l.gain.exponentialRampToValueAtTime(1e-4, e + t),
      s.connect(c).connect(l).connect(this.maestro),
      s.start(e, Math.random()),
      s.stop(e + t + 0.02));
  }
  tono(e, t, n, r, i = `sine`, a) {
    let o = this.ctx,
      s = o.createOscillator();
    ((s.type = i),
      s.frequency.setValueAtTime(t, e),
      a && s.frequency.exponentialRampToValueAtTime(a, e + n));
    let c = o.createGain();
    (c.gain.setValueAtTime(0, e),
      c.gain.linearRampToValueAtTime(r, e + 0.004),
      c.gain.exponentialRampToValueAtTime(1e-4, e + n),
      s.connect(c).connect(this.maestro),
      s.start(e),
      s.stop(e + n + 0.02));
  }
  choque(e, t) {
    if (!this.ctx) return;
    let n = t ?? this.ctx.currentTime,
      r = Math.min(1, e / 28) ** 0.8 * 0.9;
    if (r < 0.02) return;
    let i = 2600 + Math.random() * 500;
    (this.tono(n, i, 0.07, r * 0.45),
      this.tono(n, i * 1.62, 0.05, r * 0.3),
      this.tono(n, i * 2.38, 0.035, r * 0.2),
      this.ruidoCorto(n, 0.012, 5200, 0.7, r * 0.8, `highpass`));
  }
  toc(e, t) {
    if (!this.ctx) return;
    let n = t ?? this.ctx.currentTime;
    (this.tono(n, 190, 0.05, 0.35 * e + 0.1, `triangle`),
      this.ruidoCorto(n, 0.03, 1800, 1.2, 0.25 + 0.3 * e));
  }
  tensar(e) {
    this.ctx &&
      this.ruidoCorto(
        this.ctx.currentTime,
        0.04,
        900 + e * 900,
        1.5,
        0.03 + e * 0.05,
      );
  }
  fuera(e) {
    if (!this.ctx) return;
    let t = (e ?? this.ctx.currentTime) + 0.02;
    (this.tono(t, 784, 0.25, 0.22, `triangle`),
      this.tono(t + 0.09, 1175, 0.4, 0.2, `triangle`),
      this.ruidoCorto(t, 0.08, 900, 0.6, 0.15));
  }
  recoger(e, t) {
    if (!this.ctx) return;
    let n = t ?? this.ctx.currentTime;
    (this.tono(n, e ? 880 : 520, 0.12, 0.2, `triangle`, e ? 1320 : 700),
      this.tono(n, 3100, 0.04, 0.12));
  }
  carro(e, t) {
    if (!this.ctx) return;
    let n = this.ctx,
      r = t ?? n.currentTime,
      i = n.createOscillator();
    ((i.type = `sawtooth`),
      i.frequency.setValueAtTime(48, r),
      i.frequency.linearRampToValueAtTime(74, r + e));
    let a = n.createBiquadFilter();
    ((a.type = `lowpass`),
      a.frequency.setValueAtTime(260, r),
      a.frequency.linearRampToValueAtTime(900, r + e));
    let o = n.createGain();
    (o.gain.setValueAtTime(1e-4, r),
      o.gain.exponentialRampToValueAtTime(0.5, r + e),
      o.gain.exponentialRampToValueAtTime(1e-4, r + e + 0.9),
      i.connect(a).connect(o).connect(this.maestro),
      i.start(r),
      i.stop(r + e + 1));
    for (let t of [0.25, 0.55, Math.max(0.9, e - 0.7)]) this.claxon(r + t);
    this.ruidoCorto(r + e, 0.9, 500, 0.5, 0.5);
  }
  claxon(e) {
    for (let t of [392, 494]) {
      let n = this.ctx,
        r = n.createOscillator();
      ((r.type = `square`), (r.frequency.value = t));
      let i = n.createBiquadFilter();
      ((i.type = `lowpass`), (i.frequency.value = 1800));
      let a = n.createGain();
      (a.gain.setValueAtTime(0, e),
        a.gain.linearRampToValueAtTime(0.09, e + 0.01),
        a.gain.setValueAtTime(0.09, e + 0.2),
        a.gain.linearRampToValueAtTime(0, e + 0.24),
        r.connect(i).connect(a).connect(this.maestro),
        r.start(e),
        r.stop(e + 0.26));
    }
  }
  puerta(e) {
    if (!this.ctx) return;
    let t = e ?? this.ctx.currentTime;
    (this.tono(t, 1400, 0.03, 0.15, `square`),
      this.tono(t + 0.35, 210, 0.9, 0.08, `sawtooth`, 330),
      this.tono(t + 0.35, 420, 0.9, 0.04, `sawtooth`, 600));
  }
  async cargarVoz(e, t) {
    if (this.voces[e]) return;
    let n = await (await fetch(t)).arrayBuffer();
    this.voces[e] = await new OfflineAudioContext(1, 1, 48e3).decodeAudioData(
      n,
    );
  }
  vozMama(e, t) {
    let n = this.voces[e];
    if (!this.ctx || !n) return;
    let r = this.ctx.createBufferSource();
    r.buffer = n;
    let i = this.ctx.createGain();
    ((i.gain.value = 1.15),
      r.connect(i).connect(this.maestro),
      r.start(t ?? this.ctx.currentTime));
  }
  grito(e) {
    if (!this.ctx) return;
    let t = e ?? this.ctx.currentTime;
    (this.tono(t, 660, 0.18, 0.25, `triangle`),
      this.tono(t + 0.18, 520, 0.18, 0.25, `triangle`),
      this.tono(t + 0.36, 392, 0.7, 0.28, `triangle`),
      this.ruidoCorto(t, 0.25, 200, 0.7, 0.4, `lowpass`));
  }
  async grabar(e, t, n) {
    let r = {
        ctx: this.ctx,
        maestro: this.maestro,
        rodar: this.rodar,
        brisa: this.brisa,
        ruido: this.ruido,
      },
      i = 48e3,
      a = new OfflineAudioContext(2, Math.ceil(e * i), i);
    this.montar(a);
    for (let e of n)
      (this.rodar.gain.setValueAtTime(Math.min(0.32, e.v * 0.012), e.t),
        this.brisa.gain.setValueAtTime(0.05 - e.n * 0.025, e.t));
    let o = 0.4;
    for (; o < e;) {
      let t = n.length
          ? n[Math.min(n.length - 1, Math.floor((o / e) * n.length))].n
          : 0,
        r = 4300 + Math.random() * 500,
        i = 3 + Math.floor(Math.random() * 3);
      for (let e = 0; e < i; e++)
        this.tono(o + e * 0.055, r, 0.035, 0.012 + t * 0.02, `sine`);
      o += (0.9 + Math.random() * 1.6) * (1 - t * 0.6);
    }
    for (let e of t)
      e.tipo === `choque`
        ? this.choque(e.dato ?? 10, e.t)
        : e.tipo === `toc`
          ? this.toc(e.dato ?? 0.5, e.t)
          : e.tipo === `fuera`
            ? this.fuera(e.t)
            : e.tipo === `recoge`
              ? this.recoger(e.dato === 1, e.t)
              : e.tipo === `carro`
                ? this.carro(3.1, e.t)
                : e.tipo === `puerta`
                  ? this.puerta(e.t)
                  : e.tipo === `grito`
                    ? this.grito(e.t)
                    : e.tipo === `vozmama` &&
                      this.vozMama(e.dato === 1 ? `en` : `es`, e.t);
    let s = await a.startRendering();
    return (Object.assign(this, r), s);
  }
  actualizar(e, t) {
    if (!this.ctx) return;
    let n = this.ctx.currentTime;
    if (
      (this.rodar.gain.setTargetAtTime(Math.min(0.32, e * 0.012), n, 0.05),
      this.brisa.gain.setTargetAtTime(0.05 - this.noche * 0.025, n, 0.5),
      e > 2 &&
        Math.random() < e * t * 0.6 &&
        this.ruidoCorto(n, 0.01, 2400, 2, Math.min(0.12, e * 0.004)),
      (this.grillos -= t),
      this.grillos <= 0)
    ) {
      this.grillos = (0.9 + Math.random() * 1.6) * (1 - this.noche * 0.6);
      let e = 4300 + Math.random() * 500,
        t = 3 + Math.floor(Math.random() * 3);
      for (let r = 0; r < t; r++)
        this.tono(n + r * 0.055, e, 0.035, 0.012 + this.noche * 0.02, `sine`);
    }
  }
};
new URLSearchParams(location.search);
var J = (e) => document.getElementById(e),
  Ll = J(`juego`),
  Rl = J(`lienzo`),
  zl = J(`mano`),
  Bl = J(`arco`),
  Vl = J(`mano-tira`),
  Hl = J(`mama-video`),
  Ul = () => (Gl === `usa` ? `en` : `es`),
  Y = new El(Rl),
  Wl = new Il(),
  X = new kl(1),
  Gl = `cuba`,
  Kl = `MIJO`,
  ql = { tu: 0, claude: 0 },
  Jl = `inicio`,
  Yl = `tu`,
  Z = null,
  Xl = 0,
  Zl = 0,
  Ql = 0,
  $l = 7,
  eu = !1,
  tu = 0,
  nu = 16,
  Q = 0,
  ru = 0,
  iu = 0,
  au = !1,
  ou = { x: 0, y: 0 },
  su = [],
  cu = (e, t) => su.push({ t: Q, tipo: e, dato: t }),
  $ = {
    manoVis: 0,
    flick: -9,
    chipIni: -9,
    chipFin: -9,
    fueraIni: -9,
    carroIni: -9,
    pasaIni: -9,
    mamaIni: -9,
    gritoIni: -9,
    finalIni: -9,
    hud: 0,
    sol: 1,
    pista: !1,
    arco: !1,
    zoomDesde: 0,
    lentaHasta: -9,
    foco: { x: 0, z: 0 },
    focoId: -1,
    vozIni: -9,
    ninoOp: 0,
    ninoX: 0,
    ninoZ: -16,
    flickClaude: -9,
  },
  lu = [];
function uu() {
  let e = window.innerWidth,
    t = window.innerHeight,
    n = q.ancho / q.alto,
    r = e,
    i = e / n;
  (i > t && ((i = t), (r = t * n)),
    (Ll.style.width = `${r}px`),
    (Ll.style.height = `${i}px`),
    (Ll.style.fontSize = `${(r / 941) * 16}px`),
    Y.tamaño(r, i));
}
window.addEventListener(`resize`, uu);
function du(e = !1) {
  dl.forEach((t, n) => {
    let r = Y.placaASuelo(
        t.x + (X.azar() - 0.5) * 30,
        t.y + (X.azar() - 0.5) * 14,
        ll,
      ),
      i = X.añadir(
        r.x,
        r.z,
        ll,
        !1,
        (n + Math.floor(X.azar() * 8)) % Sl.length,
      );
    Y.crearBola(i, e);
  });
}
var fu = (e, t, n) =>
  X.bolas.every((r) => !r.viva || Math.hypot(r.x - e, r.z - t) > r.r + n + 0.4);
function pu(e = 0, t = 0) {
  ((zl.style.left = `${((280 + ou.x + e) / q.ancho) * 100}%`),
    (zl.style.top = `${((1060 + ou.y + t) / q.alto) * 100}%`),
    (Vl.style.left = `${((280 + ou.x) / q.ancho) * 100}%`),
    (Vl.style.top = `${((1060 + ou.y) / q.alto) * 100}%`));
}
var mu = !1;
