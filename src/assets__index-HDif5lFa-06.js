// assets__index-HDif5lFa 06 — math
// Lines 25735-26017 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
function hu() {
  ((Z = null),
    (mu = !0),
    (au = !1),
    (Jl = `apuntar`),
    (Yl = `tu`),
    (Xl = 0),
    ($.pista = tu < 2),
    tu++);
}
function gu() {
  mu = !1;
  let e = Y.placaASuelo(ul.x, ul.y, 1),
    t = X.azar() * 5 - 2.8;
  for (let n = 0; n < 12 && !fu(e.x + t, e.z, 1); n++) t = X.azar() * 6 - 3.5;
  ((Z = X.añadir(e.x + t, e.z, 1, !0, Math.floor(X.azar() * Sl.length))),
    Y.crearBola(Z));
  let n = Y.aPlaca(new H(e.x, 0, e.z)),
    r = Y.aPlaca(new H(e.x + t, 0, e.z));
  ((ou = { x: r.x - n.x, y: r.y - n.y }), pu());
  let i = Y.aPlaca(new H(Z.x, 2.4, Z.z));
  ((Bl.style.left = `${(i.x / q.ancho) * 100}%`),
    (Bl.style.top = `${(i.y / q.alto) * 100}%`),
    (au = !0));
}
function _u() {
  ((J(`m-tu`).textContent = String(ql.tu)),
    (J(`m-claude`).textContent = String(ql.claude)),
    (J(`sol-barra`).style.width = `${Math.max(3, 100 * (1 - Ql / nu))}%`));
}
function vu(e, t = 1800) {
  ((J(`chip`).textContent = e),
    Q > $.chipFin && ($.chipIni = Q),
    ($.chipFin = Q + t / 1e3));
}
function yu(e) {
  ((J(`fuera`).querySelector(`.mas`).textContent =
    e === `tu` ? `+1` : `CLAUDE +1`),
    ($.fueraIni = Q));
}
var bu = (e) =>
  new Promise((t) => {
    let n = Q + e,
      r = () => (Q >= n ? t() : setTimeout(r, 16));
    r();
  });
function xu(e, t, n) {
  if (!Z) return;
  let r = Ol(n);
  (Y.desplazar(Z.id, 0, 0),
    (Z.vx = e * r),
    (Z.vz = t * r),
    Wl.toc(n),
    cu(`toc`, n),
    Y.polvo(Z.x, Z.z, 10, 0.6),
    Y.guia(null),
    ($.arco = !1),
    Yl === `tu` ? ($.flick = Q) : ($.flickClaude = Q),
    ($.zoomDesde = Q + (Yl === `tu` ? 0.24 : 0)),
    (Jl = `rodando`),
    Ql++,
    (iu = Math.min(1, Ql / nu) * 0.82),
    ($.pista = !1));
}
async function Su() {
  ((Jl = `espera`), (Z &&= (Y.quitarBola(Z.id), (Z.viva = !1), null)));
  for (let e of X.bolas)
    e.viva && e.fuera && (Y.quitarBola(e.id), (e.viva = !1));
  (_u(),
    await bu(0.55),
    X.bolas.some((e) => e.viva && !e.tirador) ||
      (vu(`New round! ¡Otra ronda! 🔄`, 1600),
      cu(`ronda`),
      await bu(0.4),
      du(!0),
      await bu(0.9)),
    !eu && Ql >= $l && (await Eu()),
    Ql >= nu
      ? await ju()
      : Yl === `tu`
        ? Xl > 0
          ? (vu(`¡Otra vez! Shoot again 🔥`), hu())
          : ((Zl = 0), wu())
        : Xl > 0 && Zl < 2
          ? (Zl++, wu(!0))
          : ((Zl = 0), hu()));
}
var Cu = [
  `Watch this one 😎`,
  `Easy money 💸`,
  `Too slow, hermano 😏`,
  `Calculating… 🧮`,
  `That one is mine 👀`,
  `Mira y aprende 😌`,
];
async function wu(e = !1) {
  ((Yl = `claude`), (Jl = `claude`), (Xl = 0));
  let t = (X.azar() - 0.5) * 12;
  for (let e = 0; e < 12 && !fu(t, -16.5, 1); e++) t = (X.azar() - 0.5) * 12;
  ((Z = X.añadir(t, -16.5, 1, !0, Math.floor(X.azar() * Sl.length))),
    Y.crearBola(Z, !0),
    ($.ninoX = Z.x),
    ($.ninoZ = Z.z),
    vu(`CLAUDE: ` + (e ? `Again 😎` : Cu[Math.floor(X.azar() * Cu.length)])),
    await bu(1.3),
    Y.polvo(Z.x, Z.z, 6, 0.4));
  let n = Math.max(1.6, Math.min(8, 3.6 + (ql.claude - ql.tu) * 1.1)),
    r = Fl(X, Z.id, n, () => X.azar()),
    i = Al(X, Z.id, r.dx, r.dz, Ol(r.pot));
  (Y.guia(i, 1, i.choque ? Sl[X.bolas[i.choque.id].color][0] : 16777215),
    await bu(0.7),
    xu(r.dx, r.dz, r.pot));
}
var Tu = [];
async function Eu() {
  if (((eu = !0), X.bolas.filter((e) => e.viva && !e.tirador).length < 5)) {
    for (let e of X.bolas)
      e.viva && !e.tirador && (Y.quitarBola(e.id), (e.viva = !1));
    (vu(`New round! ¡Otra ronda! 🔄`, 1400),
      cu(`ronda`),
      await bu(0.3),
      du(!0),
      await bu(1.1));
  }
  ((Jl = `carro`), cu(`carro`));
  let e = J(`cuenta`);
  (($.carroIni = Q), Wl.carro(3.1));
  let t = { ...ql };
  Tu = [0.55, 1.05, 1.5, 1.95, 2.45].map((e) => Q + e + X.azar() * 0.15);
  for (let t = 3; t >= 1; t--) ((e.textContent = String(t)), await bu(1));
  (($.pasaIni = Q), (Jl = `espera`), cu(`pasa`));
  for (let e of X.bolas)
    if (e.viva && !e.tirador) {
      let t = Math.atan2(e.z, e.x) + (X.azar() - 0.5);
      ((e.vx = Math.cos(t) * 30),
        (e.vz = Math.sin(t) * 30 + 10),
        (e.fuera = !0));
    }
  await bu(0.9);
  for (let e of X.bolas)
    e.viva && !e.tirador && (Y.quitarBola(e.id), (e.viva = !1));
  (vu(`You grabbed ${ql.tu - t.tu} · Claude ${ql.claude - t.claude} 🫳`, 2e3),
    await bu(0.6),
    du(!0),
    await bu(0.9));
}
function Du(e, t) {
  e.viva = !1;
  let n = Y.aPantalla(new H(e.x, e.r, e.z)),
    r = Y.aPantalla(new H(e.x + e.r, e.r, e.z)),
    i = document.createElement(`img`);
  ((i.alt = ``),
    J(`manos`).appendChild(i),
    lu.push({
      ini: Q,
      quien: t,
      b: e,
      x: n.x,
      y: n.y,
      rad: Math.abs(r.x - n.x),
      hecho: !1,
      el: i,
    }));
}
function Ou(e) {
  ((e.hecho = !0),
    Y.borrar(e.b.id),
    e.quien === `tu` ? ql.tu++ : ql.claude++,
    _u(),
    Wl.recoger(e.quien === `tu`),
    cu(`recoge`, +(e.quien === `tu`)));
}
var ku = {
  tu: {
    abierta: {
      src: `./arte/mano_abierta_d.png`,
      w: 633,
      h: 404,
      u: 0.25,
      v: 0.86,
    },
    cerrada: {
      src: `./arte/mano_cerrada_d.png`,
      w: 583,
      h: 333,
      u: 0.12,
      v: 0.42,
    },
    dia: 61,
    sale: [0.85, -0.53],
  },
  claude: {
    abierta: {
      src: `./arte/mano_abierta_i.png`,
      w: 658,
      h: 401,
      u: 0.75,
      v: 0.86,
    },
    cerrada: {
      src: `./arte/mano_cerrada_i.png`,
      w: 539,
      h: 304,
      u: 0.82,
      v: 0.38,
    },
    dia: 54,
    sale: [-0.86, -0.51],
  },
};
function Au(e, t) {
  let n = null,
    r = 1e9,
    i = q.ancho / q.alto;
  for (let a of X.bolas) {
    if (!a.viva || a.tirador) continue;
    let o = Y.aPantalla(new H(a.x, a.r, a.z)),
      s = Y.aPantalla(new H(a.x + a.r, a.r, a.z)),
      c = Math.max(0.03, Math.abs(s.x - o.x) * 2.2),
      l = Math.hypot(e - o.x, (t - o.y) / i);
    l < c && l < r && ((r = l), (n = a));
  }
  return n;
}
async function ju() {
  ((Jl = `mama`),
    cu(`mama`),
    Y.guia(null),
    ($.chipFin = Q),
    (iu = 1),
    await bu(1.1),
    Wl.puerta(),
    cu(`puerta`));
  let e = J(`mama`);
  ((J(`grito-nombre`).textContent = Gl === `usa` ? `${Kl}!` : `¡${Kl}!`),
    (J(`grito-frase`).textContent = pl[Gl].mama),
    (J(`grito-en`).textContent =
      Gl === `usa` ? `` : `It's late, come take a bath!`),
    ($.mamaIni = Q),
    await bu(0.55),
    ($.vozIni = Q),
    (Hl.currentTime = 0),
    Hl.play().catch(() => void 0),
    Wl.vozMama(Ul()),
    cu(`vozmama`, +(Ul() === `en`)),
    await bu(0.3),
    ($.gritoIni = Q),
    await bu(4.9));
  let { tu: t, claude: n } = ql;
  ((J(`f-marcador`).textContent = `Mom called. Final score ${t} - ${n}`),
    (J(`f-veredicto`).textContent =
      t > n
        ? `You beat Claude! 🏆`
        : t < n
          ? `Claude won… this time 😤`
          : `It's a tie! Rematch tomorrow 🤝`),
    ($.finalIni = Q),
    (e.style.pointerEvents = `auto`),
    (Jl = `final`),
    cu(`final`));
}
var Mu = () => location.origin + location.pathname;
function Nu() {
  let { tu: e, claude: t } = ql,
    n = pl[Gl].palabra;
  return e > t
    ? `I beat Claude ${e}-${t} at ${n} before my mom called me home 🏠\n\nEvery Latino kid played this on the street. Can you beat it? 👇`
    : e < t
      ? `Claude beat me ${t}-${e} at ${n} 😤 …and then my mom called me home 🏠\n\nRevenge round? 👇`
      : `${e}-${t} tie with Claude at ${n}… then my mom called me home 🏠 👇`;
}
(J(`b-x`).addEventListener(`click`, () => {
  window.open(
    `https://x.com/intent/post?text=${encodeURIComponent(Nu())}&url=${encodeURIComponent(Mu())}`,
    `_blank`,
    `noopener`,
  );
}),
  J(`b-otra`).addEventListener(`click`, () => void zu()),
  J(`b-pais`).addEventListener(`click`, () => {
    (Fu(), Iu());
  }),
  J(`b-imagen`).addEventListener(`click`, () => void Pu()));
