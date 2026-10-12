// assets__index-HDif5lFa 08 — style
// Lines 26308-26460 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
function Ju(e) {
  let t = Jl === `apuntar` && au;
  $.manoVis += (+!!t - $.manoVis) * Math.min(1, e * (t ? 9 : 16));
  let n = (1 - $.manoVis) * 8,
    r = (1 - $.manoVis) * 40,
    i = Q - $.flick,
    a = i >= 0 && i < 0.42;
  if (a) {
    let e = Ku(i / 0.07),
      t = Ku((i - 0.16) / 0.26);
    ((Vl.style.opacity = (1 - t).toFixed(3)),
      (Vl.style.transform = `translate(${(-1.8 * e + 6 * t).toFixed(2)}%, ${(-2.4 * e + 30 * t ** 2).toFixed(2)}%) rotate(${(-2 * e).toFixed(2)}deg)`));
  } else Vl.style.opacity = `0`;
  zl.style.opacity = a ? `0` : $.manoVis.toFixed(3);
  let o = Math.min(1, ru * 1.1),
    s = `brightness(${(1 - 0.62 * o).toFixed(3)}) saturate(${(1 - 0.5 * o).toFixed(3)}) hue-rotate(${(-12 * o).toFixed(1)}deg)`;
  ((zl.style.filter = Vl.style.filter =
    `drop-shadow(-1.2em 1.4em 1.4em rgba(40, 10, 0, ${(0.45 * (1 - o * 0.6)).toFixed(2)})) ${s}`),
    (zl.style.transform = `translate(${n.toFixed(2)}%, ${r.toFixed(2)}%) rotate(${(0).toFixed(2)}deg)`),
    ($.hud += ((Jl === `inicio` ? 0 : 1) - $.hud) * Math.min(1, e * 6)),
    (J(`hud`).style.opacity = $.hud.toFixed(3)),
    ($.sol += (1 - Ql / nu - $.sol) * Math.min(1, e * 3)),
    (J(`sol-barra`).style.width = `${Math.max(3, 100 * $.sol).toFixed(1)}%`),
    (J(`pista`).style.opacity =
      $.pista && Jl === `apuntar` && au
        ? (0.75 + 0.25 * Math.cos(Q * 3.9)).toFixed(3)
        : `0`),
    (Bl.style.opacity = $.arco ? `1` : `0`));
  let c = Q - $.chipIni,
    l = $.chipFin - Q,
    u = c < 0 ? 0 : Math.min(Ku(c / 0.25), Ku(l / 0.3)),
    d = J(`chip`);
  ((d.style.opacity = u.toFixed(3)),
    (d.style.transform = `translate(-50%, ${(-0.6 * (1 - Ku(c / 0.25))).toFixed(3)}em)`));
  let f = (Q - $.fueraIni) / 1.5,
    p = J(`fuera`);
  if (f < 0 || f > 1) p.style.opacity = `0`;
  else {
    let e = 1,
      t = -4,
      n = -50,
      r = 1;
    if (f < 0.14)
      ((e = 0.2 + 0.88 * qu(f / 0.14)),
        (t = -8 + 4 * Ku(f / 0.14)),
        (r = Ku(f / 0.06)));
    else if (f < 0.24) e = 1.08 - (0.08 * (f - 0.14)) / 0.1;
    else if (f < 0.78) n = -50 - (2 * (f - 0.24)) / 0.54;
    else {
      let t = (f - 0.78) / 0.22;
      ((n = -52 - 8 * t), (e = 1 - 0.1 * t), (r = 1 - t));
    }
    ((p.style.opacity = r.toFixed(3)),
      (p.style.transform = `translate(-50%, ${n.toFixed(2)}%) scale(${e.toFixed(3)}) rotate(${t.toFixed(2)}deg)`));
  }
  let m = Q - $.carroIni,
    h = Jl === `carro`;
  if (
    ((J(`carro`).style.opacity = h ? `1` : `0`),
    !h && Q - $.pasaIni > 0.15 && (J(`auto`).style.opacity = `0`),
    h)
  ) {
    let e = 1 / (40 - 39 * Ku(m / 3.05)),
      t = 170 * e,
      n = t * (q.ancho / q.alto) * (679 / 912),
      r = 36.9 + 82 * e + Math.sin(Q * 34) * 0.12 * e * 10,
      i = J(`auto`);
    ((i.style.opacity = Ku(m / 0.3).toFixed(3)),
      (i.style.width = `${t.toFixed(3)}%`),
      (i.style.left = `${(50 - t / 2 + Math.sin(Q * 2.3) * 0.6 * e).toFixed(3)}%`),
      (i.style.top = `${(r - n).toFixed(3)}%`),
      (i.style.filter = `brightness(${(1 - 0.5 * Math.min(1, ru * 1.1)).toFixed(3)})`),
      i.querySelectorAll(`.faro`).forEach((t) => {
        ((t.style.opacity = (0.8 + 0.2 * Math.sin(Q * 17)).toFixed(3)),
          (t.style.width = `${(46 + 30 * (1 - e)).toFixed(1)}%`));
      }),
      (J(`cuenta`).style.transform =
        `scale(${(1 + 0.35 * (1 - (m % 1)) ** 3).toFixed(3)})`));
  }
  let g = Ll.getBoundingClientRect();
  for (let e = 0; e < lu.length; e++) {
    let t = lu[e],
      n = Q - t.ini,
      r = ku[t.quien];
    if (n > 0.55) {
      (t.el.remove(), lu.splice(e, 1), e--);
      continue;
    }
    n >= 0.17 && !t.hecho && Ou(t);
    let i = n >= 0.17,
      a = i ? r.cerrada : r.abierta,
      o = t.quien === `tu` ? t.x < 0.5 : t.x > 0.5,
      c = (t.rad * 2 * g.width * 1.25) / r.dia,
      l = a.w * c,
      u = a.h * c,
      d = o ? 1 - a.u : a.u,
      f = (o ? -1 : 1) * r.sale[0],
      p = r.sale[1],
      m = a.w * c * 1.1,
      h = i ? Ku((n - 0.2) / 0.35) ** 1.6 : (1 - Ku(n / 0.17)) ** 2,
      _ = t.x * g.width + f * m * h,
      v = t.y * g.height + p * m * h;
    (t.el.dataset.src !== a.src &&
      ((t.el.src = a.src), (t.el.dataset.src = a.src)),
      (t.el.style.width = `${l.toFixed(1)}px`),
      (t.el.style.left = `${(_ - d * l).toFixed(1)}px`),
      (t.el.style.top = `${(v - a.v * u).toFixed(1)}px`),
      (t.el.style.transform = o ? `scaleX(-1)` : ``),
      (t.el.style.filter = `drop-shadow(0 .8em 1em rgba(30,8,0,.45)) ${s}`));
  }
  let _ = Q - $.pasaIni;
  ((J(`destello`).style.opacity =
    _ >= 0 && _ < 0.7 ? (0.95 * (1 - _ / 0.7)).toFixed(3) : `0`),
    (Rl.style.transform =
      _ >= 0 && _ < 0.5
        ? `translate(${(1.5 * Math.sin(_ * 70) * (1 - _ / 0.5)).toFixed(2)}%, ${(1 * Math.cos(_ * 55) * (1 - _ / 0.5)).toFixed(2)}%)`
        : ``));
  let v = J(`mama`),
    y = Q - $.mamaIni;
  if (
    ((v.style.opacity = $.mamaIni < 0 ? `0` : Ku(y / 0.7).toFixed(3)),
    $.mamaIni >= 0)
  ) {
    let e = 1 - (1 - Ku(y / 6)) ** 3;
    Hl.style.transform = `scale(${(1 + 0.04 * e).toFixed(4)}) translate(${(1 * e).toFixed(3)}%, ${(1 * e).toFixed(3)}%)`;
    let t = (Q - $.gritoIni) / 0.35;
    J(`globo`).style.transform =
      $.gritoIni < 0 || t < 0
        ? `scale(0) rotate(-6deg)`
        : `scale(${qu(Ku(t)).toFixed(3)}) rotate(${(-6 + 3 * Ku(t)).toFixed(2)}deg)`;
    let n = $.finalIni < 0 ? 0 : Ku((Q - $.finalIni) / 0.5),
      r = J(`final`);
    ((r.style.opacity = n.toFixed(3)),
      (r.style.transform = `translateY(${(2 * (1 - n)).toFixed(3)}em)`));
  }
}
async function Yu() {
  (uu(),
    Y.montar(),
    await Promise.all([Y.barrio(pl[Gl].barrio), Y.cargarNino(`arte/nino.png`)]),
    du(),
    Lu[0].classList.add(`sel`),
    Ju(0),
    J(`carga`).classList.add(`oculta`),
    Iu());
  let e = performance.now(),
    t = (n) => {
      let r = Math.min(0.05, (n - e) / 1e3);
      ((e = n), Gu(r), requestAnimationFrame(t));
    };
  requestAnimationFrame(t);
}
Yu();
