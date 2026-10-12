// assets__index-HDif5lFa 07 — math
// Lines 26018-26307 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
async function Pu() {
  await document.fonts.load(`80px "Lilita One"`);
  let e = document.createElement(`canvas`);
  e.width = e.height = 1080;
  let t = e.getContext(`2d`);
  Y.render();
  let n = Rl,
    r = n.width,
    i = n.height,
    a = Math.min(r, i * 0.62);
  t.drawImage(n, (r - a) / 2, i * 0.3, a, a, 0, 0, 1080, 1080);
  let o = t.createLinearGradient(0, 0, 0, 1080);
  (o.addColorStop(0, `rgba(10,6,20,.15)`),
    o.addColorStop(0.55, `rgba(10,6,20,.35)`),
    o.addColorStop(1, `rgba(10,6,20,.85)`),
    (t.fillStyle = o),
    t.fillRect(0, 0, 1080, 1080));
  let { tu: s, claude: c } = ql,
    l = pl[Gl].palabra,
    u =
      s > c
        ? `I beat CLAUDE ${s}-${c}`
        : s < c
          ? `CLAUDE beat me ${c}-${s}`
          : `Tied with CLAUDE ${s}-${c}`;
  ((t.textAlign = `center`), (t.lineJoin = `round`));
  let d = (e, n, r, i) => {
    ((t.font = `${r}px "Lilita One"`),
      (t.lineWidth = r * 0.16),
      (t.strokeStyle = `#3a0d00`),
      t.strokeText(e, 540, n),
      (t.fillStyle = i),
      t.fillText(e, 540, n));
  };
  (d(u, 250, 104, `#ffd84a`), d(`at ${l}`, 380, 150, `#ffb42a`));
  let f = new Image();
  ((f.src = `data:image/svg+xml;utf8,` + encodeURIComponent(hl(Gl))),
    await f.decode().catch(() => void 0),
    t.drawImage(f, 480, 420, 120, 80),
    (t.font = `600 46px Inter`),
    (t.fillStyle = `#fff`),
    t.fillText(`before mom called me home 🏠`, 540, 590),
    (t.fillStyle = `#1f9d43`),
    t.beginPath(),
    t.roundRect(240, 900, 600, 96, 48),
    t.fill(),
    (t.font = `800 40px Inter`),
    (t.fillStyle = `#fff`),
    t.fillText(`Play free in your browser`, 540, 962),
    (t.font = `600 30px Inter`),
    (t.fillStyle = `rgba(255,255,255,.75)`),
    t.fillText(`The Street Game · @IAenCrudo`, 540, 1050));
  let p = await new Promise((t) => e.toBlob(t, `image/png`));
  if (!p) return;
  let m = new File([p], `the-street-game.png`, { type: `image/png` });
  if (navigator.canShare?.({ files: [m] })) {
    await navigator
      .share({
        files: [m],
        text:
          Nu() +
          `
` +
          Mu(),
      })
      .catch(() => void 0);
    return;
  }
  let h = document.createElement(`a`);
  ((h.href = URL.createObjectURL(p)),
    (h.download = `the-street-game.png`),
    h.click(),
    setTimeout(() => URL.revokeObjectURL(h.href), 4e3));
}
function Fu() {
  (($.mamaIni = $.gritoIni = $.finalIni = $.vozIni = -9),
    (J(`mama`).style.pointerEvents = `none`),
    Hl.pause(),
    (Hl.currentTime = 0));
}
function Iu() {
  ((Jl = `inicio`),
    (ru = iu = 0),
    Y.ponerNoche(0),
    (Wl.noche = 0),
    J(`inicio`).classList.add(`visible`));
}
var Lu = document.querySelectorAll(`[data-pais]`);
Lu.forEach((e) => {
  let t = e.dataset.pais;
  ((e.querySelector(`.ban`).innerHTML = hl(t)),
    e.addEventListener(`click`, async () => {
      (Wl.desbloquear(),
        (Gl = t),
        Lu.forEach((t) => t.classList.toggle(`sel`, t === e)),
        await Y.barrio(pl[t].barrio));
    }));
});
var Ru = J(`nombre-campo`);
(Ru.addEventListener(`input`, () => {
  Ru.value = Ru.value.replace(/[^\p{L}\p{M} .'-]/gu, ``).slice(0, 12);
}),
  J(`b-jugar`).addEventListener(`click`, () => void zu()));
async function zu() {
  (Wl.desbloquear(),
    (Kl = Ru.value.trim().toUpperCase() || `MIJO`),
    J(`inicio`).classList.remove(`visible`),
    Fu(),
    (J(`h-palabra`).textContent = pl[Gl].palabra));
  let e = Ul();
  (Hl.src.endsWith(`mama_${e}.mp4`) ||
    ((Hl.src = `./arte/mama_${e}.mp4`), Hl.load()),
    Wl.cargarVoz(e, `./arte/voz_mama_${e}.mp3`),
    (J(`h-bandera`).innerHTML = hl(Gl)),
    await Y.barrio(pl[Gl].barrio),
    Y.limpiar(),
    Y.guia(null),
    (X = new kl(Date.now() & 16777215)),
    (ql.tu = ql.claude = 0),
    (Ql = 0),
    (eu = !1),
    (tu = 0),
    (Zl = 0),
    ($l = 6 + Math.floor(X.azar() * 4)),
    (ru = iu = 0),
    Y.ponerNoche(0),
    (Wl.noche = 0),
    _u(),
    cu(`empieza`),
    du(!0),
    hu());
}
var Bu = null,
  Vu = null,
  Hu = 0;
function Uu(e) {
  let t = Ll.getBoundingClientRect();
  return {
    x: ((e.clientX - t.left) / t.width) * q.ancho,
    y: ((e.clientY - t.top) / t.height) * q.alto,
  };
}
function Wu() {
  ((Bu = null),
    (Vu = null),
    Y.guia(null),
    ($.arco = !1),
    Z && Y.desplazar(Z.id, 0, 0),
    pu());
}
(Ll.addEventListener(`pointerdown`, (e) => {
  if (!e.target.closest(`button, input, #inicio, #mama`)) {
    if ((Wl.desbloquear(), Jl === `carro`)) {
      let t = Ll.getBoundingClientRect(),
        n = Au((e.clientX - t.left) / t.width, (e.clientY - t.top) / t.height);
      n && Du(n, `tu`);
    } else
      Jl === `apuntar` &&
        au &&
        (Ll.setPointerCapture(e.pointerId), (Bu = Uu(e)));
  }
}),
  Ll.addEventListener(`pointermove`, (e) => {
    if (!Bu || Jl !== `apuntar` || !Z) return;
    let t = Uu(e);
    if (((Vu = Nl(t.x - Bu.x, t.y - Bu.y, Z.x, Z.z)), !Vu)) {
      (Y.guia(null), ($.arco = !1), Y.desplazar(Z.id, 0, 0), pu());
      return;
    }
    let n = Al(X, Z.id, Vu.dx, Vu.dz, Ol(Vu.pot));
    (Y.guia(n, 1, n.choque ? Sl[X.bolas[n.choque.id].color][0] : 16777215),
      ($.arco = !0),
      Bl.style.setProperty(`--p`, String(Vu.pot)));
    let r = 0.25 + Vu.pot * 0.9,
      i = -Vu.dx * r,
      a = -Vu.dz * r;
    Y.desplazar(Z.id, i, a);
    let o = Y.aPlaca(new H(Z.x, 0, Z.z)),
      s = Y.aPlaca(new H(Z.x + i, 0, Z.z + a));
    (pu(s.x - o.x, s.y - o.y), Q - Hu > 0.09 && (Wl.tensar(Vu.pot), (Hu = Q)));
  }),
  Ll.addEventListener(`pointerup`, () => {
    if (Jl === `apuntar` && Vu && Z) {
      let e = Vu;
      ((Bu = null), (Vu = null), xu(e.dx, e.dz, e.pot));
    } else Wu();
  }),
  Ll.addEventListener(`pointercancel`, Wu),
  Ll.addEventListener(`lostpointercapture`, () => {
    Bu && Wu();
  }));
function Gu(e) {
  Q += e;
  let t = Q < $.lentaHasta,
    n = t ? e * 0.3 : e;
  X.paso(n);
  for (let e of X.eventos.splice(0))
    if (e.tipo === `choque`) {
      (Wl.choque(e.fuerza),
        cu(`choque`, e.fuerza),
        Y.polvo(
          e.x,
          e.z,
          Math.min(18, 3 + e.fuerza * 0.5),
          Math.min(1.4, 0.4 + e.fuerza / 30),
        ));
      let t = X.bolas[e.a],
        n = X.bolas[e.b],
        r = t.tirador ? n : n.tirador ? t : null;
      r &&
        e.fuerza > 16 &&
        Jl === `rodando` &&
        Q > $.lentaHasta + 0.4 &&
        (($.lentaHasta = Q + 0.75),
        ($.foco = { x: e.x, z: e.z }),
        ($.focoId = r.id),
        Y.estela(r.id),
        Y.estallido(e.x, e.z, r.vx, r.vz));
    } else if (e.tipo === `fuera` && Jl !== `carro` && Jl !== `espera`) {
      (Yl === `tu` ? ql.tu++ : ql.claude++,
        Xl++,
        _u(),
        yu(Yl),
        Wl.fuera(),
        cu(`fuera`, +(Yl === `tu`)));
      {
        let t = X.bolas[e.id];
        Math.hypot(t.vx, t.vz) > 11
          ? (Q > $.lentaHasta + 0.4 &&
              (($.lentaHasta = Q + 0.85),
              ($.foco = { x: e.x, z: e.z }),
              ($.focoId = e.id)),
            Y.estela(e.id),
            Y.estallido(e.x, e.z, t.vx, t.vz))
          : Y.polvo(e.x, e.z, 10, 0.7);
      }
    }
  if ((Jl === `rodando` && X.quieta() && Su(), Jl === `carro`))
    for (let e = 0; e < Tu.length; e++) {
      if (Q < Tu[e]) continue;
      (Tu.splice(e, 1), e--);
      let t = X.bolas
        .filter((e) => e.viva && !e.tirador)
        .sort((e, t) => e.z - t.z);
      t.length && Du(t[0], `claude`);
    }
  ((ru += (iu - ru) * Math.min(1, e * 0.9)), Y.ponerNoche(ru), (Wl.noche = ru));
  let r = X.bolas.filter((e) => e.viva && (e.vx || e.vz));
  if (t) {
    let t = X.bolas[$.focoId],
      n = t ? ($.foco.x + t.x) / 2 : $.foco.x,
      r = t ? ($.foco.z + t.z) / 2 : $.foco.z,
      i = Y.aPlaca(new H(n, 0, r));
    Y.enfocar(r < 0 ? 2.3 : 1.8, i.x, i.y - 20, e * 3);
  } else if (Jl === `rodando` && r.length && Q >= $.zoomDesde) {
    let t = 0,
      n = 0;
    for (let e of r) ((t += e.x), (n += e.z));
    let i = Y.aPlaca(new H(t / r.length, 0, n / r.length));
    Y.enfocar(1.35, i.x, i.y - 40, e);
  } else if (Jl === `claude` && Z) {
    let t = Y.aPlaca(new H(Z.x * 0.6, 0, Z.z * 0.75));
    Y.enfocar(1.4, t.x, t.y - 120, e);
  } else
    (Y.enfocar(1, q.ancho / 2, q.alto / 2, e * (Y.zoom > 1.25 ? 1.6 : 2.4)),
      Jl === `apuntar` &&
        mu &&
        Y.zoom < 1.012 &&
        (Y.enfocarYa(1, q.ancho / 2, q.alto / 2), gu()));
  Wl.actualizar(X.rapidez(), e);
  let i =
    Yl === `claude` &&
    !t &&
    (Jl === `claude` || (Jl === `rodando` && Q - $.flickClaude < 0.6));
  (($.ninoOp += (+!!i - $.ninoOp) * Math.min(1, e * (i ? 5 : 9))),
    (t || (Y.zoom > 1.15 && !i)) && ($.ninoOp = 0));
  let a = Q - $.flickClaude;
  (Y.ponerNino(
    $.ninoX,
    $.ninoZ,
    1,
    $.ninoOp,
    a >= 0 && a < 0.25 ? Math.sin((a / 0.25) * Math.PI) : 0,
  ),
    Y.actualizar(n),
    Ju(e),
    Y.render());
}
var Ku = (e) => Math.max(0, Math.min(1, e)),
  qu = (e) => 1 + 2.70158 * (e - 1) ** 3 + 1.70158 * (e - 1) ** 2;
