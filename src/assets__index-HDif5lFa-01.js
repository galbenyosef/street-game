// assets__index-HDif5lFa 01 — barrio
// Lines 24294-24497 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
  q = { ancho: 941, alto: 1672 },
  cl = {
    altura: 6.451928,
    distancia: 29.967104,
    cabeceo: 12.679741,
    fovV: 80.801327,
  },
  ll = 1.1,
  ul = { x: 432, y: 1273 },
  dl = [
    { x: 205, y: 828 },
    { x: 400, y: 800 },
    { x: 548, y: 838 },
    { x: 650, y: 782 },
    { x: 335, y: 890 },
    { x: 665, y: 908 },
    { x: 760, y: 836 },
  ],
  fl = [
    [749, 180],
    [300, 588],
    [560, 594],
  ],
  pl = {
    cuba: {
      palabra: `BOLAS`,
      barrio: { placa: `arte/fondo_cuba.jpg`, lamparas: fl },
      mama: `¡Ya es tarde, ven a bañarte!`,
    },
    mexico: {
      palabra: `CANICAS`,
      barrio: {
        placa: `arte/fondo_mexico.jpg`,
        lamparas: [
          [98, 144],
          [750, 196],
          [640, 596],
        ],
      },
      mama: `¡Ya es tarde, ven a bañarte!`,
    },
    venezuela: {
      palabra: `METRAS`,
      barrio: { placa: `arte/fondo_neutro.jpg`, lamparas: fl },
      mama: `¡Ya es tarde, ven a bañarte!`,
    },
    costarica: {
      palabra: `BOLINCHAS`,
      barrio: { placa: `arte/fondo_neutro.jpg`, lamparas: fl },
      mama: `¡Ya es tarde, ven a bañarte!`,
    },
    salvador: {
      palabra: `CHIBOLAS`,
      barrio: { placa: `arte/fondo_neutro.jpg`, lamparas: fl },
      mama: `¡Ya es tarde, ven a bañarte!`,
    },
    argentina: {
      palabra: `BOLITAS`,
      barrio: { placa: `arte/fondo_neutro.jpg`, lamparas: fl },
      mama: `¡Ya es tarde, vení a bañarte!`,
    },
    usa: {
      palabra: `MARBLES`,
      barrio: { placa: `arte/fondo_neutro.jpg`, lamparas: fl },
      mama: `It's late! Come take a bath!`,
    },
  },
  ml = {
    cuba: `<rect width="30" height="20" fill="#fff"/><rect width="30" height="4" fill="#0a3fa6"/><rect y="8" width="30" height="4" fill="#0a3fa6"/><rect y="16" width="30" height="4" fill="#0a3fa6"/><path d="M0 0 L17 10 L0 20 Z" fill="#d61f26"/><path d="M5.6 6.4 l1 3 h3.1 l-2.5 1.8 1 3 -2.6 -1.9 -2.6 1.9 1 -3 -2.5 -1.8 h3.1 z" fill="#fff"/>`,
    mexico: `<rect width="10" height="20" fill="#0b6b3a"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce1126"/><circle cx="15" cy="10" r="3" fill="#8b5a2b"/><path d="M12.4 11.5 q2.6 2.4 5.2 0" stroke="#2f7d32" stroke-width="0.9" fill="none"/>`,
    venezuela: `<rect width="30" height="7" fill="#ffcc00"/><rect y="7" width="30" height="6" fill="#00247d"/><rect y="13" width="30" height="7" fill="#cf142b"/><g fill="#fff"><circle cx="9.6" cy="11.4" r=".7"/><circle cx="11.2" cy="9.6" r=".7"/><circle cx="13.3" cy="8.6" r=".7"/><circle cx="15.5" cy="8.4" r=".7"/><circle cx="17.7" cy="8.7" r=".7"/><circle cx="19.6" cy="9.7" r=".7"/><circle cx="21" cy="11.5" r=".7"/></g>`,
    costarica: `<rect width="30" height="20" fill="#002b7f"/><rect y="3.33" width="30" height="13.34" fill="#fff"/><rect y="6.67" width="30" height="6.66" fill="#ce1126"/>`,
    salvador: `<rect width="30" height="20" fill="#0f47af"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><circle cx="15" cy="10" r="2.1" fill="none" stroke="#c9a227" stroke-width=".7"/><path d="M13.6 10.8 h2.8 l-1.4 -2.4 z" fill="#2f7d32"/>`,
    argentina: `<rect width="30" height="20" fill="#74acdf"/><rect y="6.7" width="30" height="6.6" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#f6b40e"/>`,
    usa: `<rect width="30" height="20" fill="#fff"/><g fill="#b22234"><rect width="30" height="1.54"/><rect y="3.08" width="30" height="1.54"/><rect y="6.15" width="30" height="1.54"/><rect y="9.23" width="30" height="1.54"/><rect y="12.3" width="30" height="1.54"/><rect y="15.4" width="30" height="1.54"/><rect y="18.46" width="30" height="1.54"/></g><rect width="12" height="10.77" fill="#3c3b6e"/>`,
  },
  hl = (e) =>
    `<svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">${ml[e]}</svg>`,
  gl = `
uniform float uNoche;
uniform vec2 uLamparas[3];
uniform float uAspecto;
vec3 gradoNoche(vec3 c, vec2 uv) {
  float tarde = smoothstep(0.0, 0.55, uNoche), noche = smoothstep(0.4, 1.0, uNoche);
  c *= mix(vec3(1.0), vec3(0.98, 0.72, 0.6) * 0.82, tarde);
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  vec3 n = mix(vec3(l), c, 0.3) * vec3(0.36, 0.45, 0.85) * 0.5;
  n *= mix(1.0, 0.65, smoothstep(0.6, 1.0, uv.y));
  c = mix(c, n, noche);
  for (int i = 0; i < 3; i++) {
    vec2 d = (uv - uLamparas[i]) * vec2(uAspecto, 1.0);
    float r2 = dot(d, d);
    c += vec3(1.0, 0.72, 0.38) * noche * (1.1 * exp(-r2 * 9000.0) + 0.22 * exp(-r2 * 260.0));
  }
  return c;
}`,
  _l = `
varying vec3 vMundo;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vMundo = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,
  vl = `
uniform sampler2D uPlaca;
uniform mat4 uVP;
uniform vec3 uCentro;
uniform float uR;
uniform mat3 uRot;
uniform vec3 uC1, uC2, uC3;
uniform float uGiro, uAletas, uSemilla, uOpacidad;
uniform vec3 uSol, uSolCol, uLampara;
varying vec3 vMundo;
${gl}

vec3 placa(vec3 p) {
  vec4 c = uVP * vec4(p, 1.0);
  vec2 uv = clamp(c.xy / max(c.w, 0.001) * 0.5 + 0.5, vec2(0.002), vec2(0.998));
  return gradoNoche(texture2D(uPlaca, uv).rgb, uv);
}
float hash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
  vec3 ro = cameraPosition, rd = normalize(vMundo - ro);
  vec3 oc = ro - uCentro;
  float b = dot(oc, rd), c = dot(oc, oc) - uR * uR, h = b * b - c;
  if (h < 0.0) discard;
  vec3 p1 = ro + rd * (-b - sqrt(h));
  vec3 n1 = (p1 - uCentro) / uR;
  float cosi = clamp(dot(-rd, n1), 0.0, 1.0);
  float F = 0.04 + 0.96 * pow(1.0 - cosi, 5.0);

  // refracción: entra, cruza la bola y sale
  vec3 t1 = refract(rd, n1, 1.0 / 1.5);
  vec3 p2 = p1 + t1 * (-2.0 * dot(p1 - uCentro, t1));
  vec3 n2 = (p2 - uCentro) / uR;
  vec3 t2 = refract(t1, -n2, 1.5);
  if (dot(t2, t2) < 0.01) t2 = reflect(t1, -n2);
  vec3 visto;
  if (t2.y < -0.03) { float tg = -p2.y / t2.y; visto = p2 + t2 * min(tg, 220.0); }
  else visto = p2 + t2 * 160.0;
  vec3 cuerpo = placa(visto);
  // lo que se ve justo debajo de la bola está a su sombra
  if (t2.y < -0.03) cuerpo *= mix(0.45, 1.0, smoothstep(uR * 0.6, uR * 2.2, length(visto.xz - uCentro.xz)));

  // aletas de color del ojo de gato (en el espacio de la bola, para que giren al rodar).
  // Se recorre el rayo dentro de la bola en 40 pasos con un desfase distinto por píxel (sin rayas), y cada aleta es una
  // cinta fina y translúcida que se retuerce a lo largo de la bola.
  vec4 ac = vec4(0.0);
  float paso = 6.2831853 / uAletas;
  float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  float seg = length(p2 - p1) / uR / 56.0;
  float contra = pow(max(dot(rd, uSol), 0.0), 3.0);
  for (int i = 0; i < 56; i++) {
    float s = (float(i) + jit) / 56.0;
    vec3 q = (transpose(uRot) * (mix(p1, p2, s) - uCentro)) / uR;
    float rad = length(q.yz);
    float ang = atan(q.z, q.y) - uGiro * q.x;
    float a = mod(ang, paso), dAng = min(a, paso - a);
    float ancho = 0.4 * sqrt(max(0.0, 1.0 - q.x * q.x / 0.8));
    float dist = sin(min(dAng, 1.5)) * rad;
    float grosor = 0.025 + 0.05 * max(0.0, 1.0 - rad / max(ancho, 0.001));
    float dens = (1.0 - smoothstep(grosor * 0.2, grosor, dist)) * (1.0 - smoothstep(ancho * 0.7, ancho, rad));
    float alfa = 1.0 - exp(-dens * seg * 24.0);
    float k = mod(floor(mod(ang + paso * 0.5, 6.2831853) / paso), 3.0);
    vec3 col = k < 0.5 ? uC1 : (k < 1.5 ? uC2 : uC3);
    // contraluz: el sol atraviesa las cintas y las hace brillar
    col *= ((0.6 + 1.1 * contra) * uSolCol + 0.12) * mix(1.0, 0.4, smoothstep(0.35, 1.0, uNoche));
    // burbujitas atrapadas en el cristal
    for (int j = 0; j < 5; j++) {
      float fj = float(j) + uSemilla * 7.0;
      vec3 bp = normalize(vec3(hash(fj) - 0.5, hash(fj + 1.3) - 0.5, hash(fj + 2.7) - 0.5)) * (0.25 + 0.6 * hash(fj + 4.1));
      float db = length(q - bp);
      if (db < 0.03) { alfa = max(alfa, 0.45 * (1.0 - db / 0.03)); col = vec3(1.0, 0.97, 0.9) * 1.5; }
    }
    ac.rgb += (1.0 - ac.a) * alfa * col;
    ac.a += (1.0 - ac.a) * alfa;
  }
  float largo = length(p2 - p1) / uR;
  cuerpo *= vec3(0.93, 0.97, 1.0) * exp(-largo * 0.12);
  vec3 dentro = cuerpo * (1.0 - ac.a) + ac.rgb;

  // reflejo de la calle en la superficie
  vec3 refl = reflect(rd, n1);
  vec3 rf = refl; if (rf.z > 0.0) rf.z = -rf.z;
  vec3 colRefl = placa(p1 + rf * 120.0) * 0.9;
  vec3 col = mix(dentro, colRefl, F);
  col *= mix(1.0, 0.62, pow(1.0 - cosi, 2.2));        // borde más oscuro, como el cristal grueso
  // el sol entra por detrás y el cristal lo concentra abajo y por delante: brillo cálido (como en las fotos)
  float foco = pow(max(dot(n1, normalize(vec3(0.12, -0.42, 1.0))), 0.0), 5.0);
  col += uSolCol * vec3(1.0, 0.75, 0.42) * foco * 0.85 * (1.0 - smoothstep(0.35, 0.9, uNoche));
  // brillos: el sol (bajo, detrás) y la farola de noche
  float sd = max(dot(refl, uSol), 0.0);
  col += uSolCol * (pow(sd, 900.0) * 9.0 + pow(sd, 60.0) * 0.35) * (1.0 - smoothstep(0.5, 1.0, uNoche));
  vec3 L = normalize(uLampara - p1);
  float ld = max(dot(refl, L), 0.0);
  col += vec3(1.0, 0.78, 0.45) * (pow(ld, 500.0) * 6.0 + pow(ld, 40.0) * 0.2) * smoothstep(0.4, 1.0, uNoche);
  // destello fijo arriba a la izquierda (la ventana de luz que siempre se ve en las fotos de canicas)
  vec3 hv = normalize(vec3(-0.45, 0.8, 0.4));
  col += vec3(1.0) * pow(max(dot(n1, normalize(hv - rd)), 0.0), 700.0) * 2.5;

  gl_FragColor = vec4(col, uOpacidad);
  #include <colorspace_fragment>
}`;
