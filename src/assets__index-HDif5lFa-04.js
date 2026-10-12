// assets__index-HDif5lFa 04 — math
// Lines 25271-25384 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
function Al(e, t, n, r, i) {
  let a = e.copia(),
    o = a.bolas[t];
  ((o.vx = n * i), (o.vz = r * i));
  let s = [{ x: o.x, z: o.z }],
    c = 0,
    l = { x: o.x, z: o.z };
  for (let e = 0; e < 600; e++) {
    ((a.eventos.length = 0), a.paso(1 / 120));
    let e = a.eventos.find(
      (e) => e.tipo === `choque` && (e.a === t || e.b === t),
    );
    if (e && e.tipo === `choque`) {
      let n = a.bolas[e.a === t ? e.b : e.a],
        r = Math.hypot(n.vx, n.vz);
      return (
        s.push({ x: o.x, z: o.z }),
        {
          camino: s,
          choque: {
            x: o.x,
            z: o.z,
            id: n.id,
            dx: n.vx / (r || 1),
            dz: n.vz / (r || 1),
            v: r,
          },
        }
      );
    }
    if (
      ((c += Math.hypot(o.x - l.x, o.z - l.z)),
      (l = { x: o.x, z: o.z }),
      c > 0.9 && (s.push({ x: o.x, z: o.z }), (c = 0)),
      o.vx === 0 && o.vz === 0)
    )
      break;
  }
  return (s.push({ x: o.x, z: o.z }), { camino: s, choque: null });
}
var jl = 0.55,
  Ml = 1.25;
function Nl(e, t, n, r) {
  let i = Math.hypot(e, t);
  if (i < 22) return null;
  let a = Math.atan2(-e, Math.max(t, -i * 0.2)) * jl;
  a = Math.max(-1.25, Math.min(Ml, a));
  let o = Math.hypot(n, r) || 1,
    s = -n / o,
    c = -r / o,
    l = -c,
    u = s;
  return {
    dx: s * Math.cos(a) + l * Math.sin(a),
    dz: c * Math.cos(a) + u * Math.sin(a),
    pot: Math.min(1, (i - 22) / 318),
    angulo: a,
  };
}
function Pl(e, t, n, r, i) {
  let a = e.copia(),
    o = a.bolas[t];
  ((o.vx = n * i), (o.vz = r * i));
  let s = 0;
  for (let e = 0; e < 160 && !a.quieta(); e++) {
    a.paso(1 / 30);
    for (let e of a.eventos) e.tipo === `fuera` && s++;
    a.eventos.length = 0;
  }
  return s;
}
function Fl(e, t, n, r) {
  let i = e.bolas[t],
    a = null,
    o = -1;
  for (let n of e.bolas) {
    if (!n.viva || n.tirador || n.fuera) continue;
    let r = n.x - i.x,
      s = n.z - i.z,
      c = Math.hypot(r, s),
      l = r / c,
      u = -(s / c),
      d = l;
    for (let r of [-0.38, 0, 0.38]) {
      let s = n.x + u * r * (i.r + n.r) - i.x,
        c = n.z + d * r * (i.r + n.r) - i.z,
        l = Math.hypot(s, c),
        f = s / l,
        p = c / l;
      for (let i of [0.55, 0.75, 0.92]) {
        let s = Pl(e, t, f, p, Ol(i)),
          c = s * 10 - i * 2 - Math.abs(r);
        c > o &&
          ((o = c),
          (a = { dx: f, dz: p, pot: i, objetivo: n.id, esperadas: s }));
      }
    }
  }
  if (!a)
    return {
      dx: -i.x / Math.hypot(i.x, i.z),
      dz: -i.z / Math.hypot(i.x, i.z),
      pot: 0.8,
      objetivo: -1,
      esperadas: 0,
    };
  let s = ((r() + r() + r() - 1.5) * 1.15 * n * Math.PI) / 180,
    c = Math.cos(s),
    l = Math.sin(s),
    u = a.dx * c - a.dz * l,
    d = a.dx * l + a.dz * c,
    f = Math.max(0.2, Math.min(1, a.pot * (0.94 + r() * 0.12)));
  return { ...a, dx: u, dz: d, pot: f };
}
