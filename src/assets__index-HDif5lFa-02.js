// assets__index-HDif5lFa 02 — addcolorstop
// Lines 24498-24590 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
function yl(e, t, n, r, i, a) {
  return new Ai({
    vertexShader: _l,
    fragmentShader: vl,
    transparent: !0,
    uniforms: {
      uPlaca: { value: e },
      uVP: { value: t },
      uCentro: { value: new H() },
      uR: { value: 1 },
      uRot: { value: new U() },
      uC1: { value: new W(n[0]) },
      uC2: { value: new W(n[1]) },
      uC3: { value: new W(n[2]) },
      uGiro: { value: r },
      uAletas: { value: i },
      uSemilla: { value: a },
      uOpacidad: { value: 1 },
      uSol: { value: new H(-0.19, 0.2, -0.96).normalize() },
      uSolCol: { value: new W(1, 0.86, 0.66) },
      uLampara: { value: new H(9, 10, -20) },
      uNoche: { value: 0 },
      uLamparas: { value: [new V(-1, -1), new V(-1, -1), new V(-1, -1)] },
      uAspecto: { value: 941 / 1672 },
    },
  });
}
var bl = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  xl = `
uniform sampler2D uPlaca;
varying vec2 vUv;
${gl}
void main() {
  gl_FragColor = vec4(gradoNoche(texture2D(uPlaca, vUv).rgb, vUv), 1.0);
  #include <colorspace_fragment>
}`,
  Sl = [
    [2056160, 16761370, 2056160],
    [14692378, 16765503, 16777215],
    [1221450, 16053492, 1221450],
    [16742930, 1925080, 16769162],
    [9055202, 3590382, 16777215],
    [16053492, 14165530, 1925080],
    [1419936, 16765503, 16738874],
    [1710730, 14251863, 16774112],
  ];
function Cl(e, t, n = 128) {
  let r = document.createElement(`canvas`);
  r.width = r.height = n;
  let i = r.getContext(`2d`),
    a = i.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  (a.addColorStop(0, e),
    a.addColorStop(1, t),
    (i.fillStyle = a),
    i.fillRect(0, 0, n, n));
  let o = new mi(r);
  return ((o.colorSpace = ze), o);
}
function wl() {
  let e = document.createElement(`canvas`);
  e.width = e.height = 32;
  let t = e.getContext(`2d`),
    n = t.createRadialGradient(13, 12, 1, 16, 16, 12);
  (n.addColorStop(0, `#d9a070`),
    n.addColorStop(0.55, `#8a4a24`),
    n.addColorStop(0.92, `#4a2210`),
    n.addColorStop(1, `rgba(60,28,12,0)`),
    (t.fillStyle = n),
    t.beginPath(),
    t.arc(16, 16, 12, 0, Math.PI * 2),
    t.fill());
  let r = new mi(e);
  return ((r.colorSpace = ze), r);
}
function Tl(e = !1) {
  let t = document.createElement(`canvas`);
  t.width = t.height = 128;
  let n = t.getContext(`2d`);
  ((n.shadowColor = `rgba(0,0,0,0.55)`),
    (n.shadowBlur = 10),
    n.beginPath(),
    n.arc(64, 64, e ? 52 : 34, 0, Math.PI * 2),
    e
      ? ((n.lineWidth = 9),
        (n.strokeStyle = `rgba(255,255,255,0.95)`),
        n.setLineDash([14, 9]),
        n.stroke())
      : ((n.fillStyle = `#fff`), n.fill()));
  let r = new mi(t);
  return ((r.colorSpace = ze), r);
}
