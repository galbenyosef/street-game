// assets__index-HDif5lFa 03 — math
// Lines 24591-25270 of readable/assets__index-HDif5lFa.pretty.js (statement-aligned).
var El = class {
    renderer;
    scene = new Pn();
    camera;
    base;
    vp = new Zt();
    zoom = 1;
    fx = q.ancho / 2;
    fy = q.alto / 2;
    vistas = new Map();
    placa = null;
    telon;
    matsNoche = [];
    noche = 0;
    lamparasUv = [];
    sombraMat;
    guiaPuntos;
    guiaAro;
    guiaObj;
    polvoGeo;
    polvoVel;
    polvoVida;
    polvoN = 500;
    polvoClaro = new Float32Array(500);
    texSombra = Cl(`rgba(28,8,0,0.9)`, `rgba(28,8,0,0)`);
    texBrillo = Cl(`rgba(255,240,190,1)`, `rgba(255,170,80,0)`);
    sol = new H(-10, 24, -45).normalize();
    rastroGeo;
    terronGeo;
    terronVel = new Float32Array(480);
    terronVida = new Float32Array(160);
    nino = null;
    ninoSombra;
    ray = new za();
    constructor(e) {
      ((this.renderer = new sl({
        canvas: e,
        antialias: !0,
        preserveDrawingBuffer: !0,
        powerPreference: `high-performance`,
      })),
        (this.renderer.outputColorSpace = ze),
        (this.renderer.toneMapping = 0),
        (this.renderer.shadowMap.enabled = !0),
        (this.renderer.shadowMap.type = 1),
        (this.camera = new va(cl.fovV, q.ancho / q.alto, 0.3, 600)),
        this.camera.position.set(0, cl.altura, cl.distancia),
        this.camera.rotation.set(-Dt.degToRad(cl.cabeceo), 0, 0),
        this.camera.updateMatrixWorld(),
        (this.base = this.camera.clone()),
        this.base.updateMatrixWorld(),
        this.vp.multiplyMatrices(
          this.base.projectionMatrix,
          this.base.matrixWorldInverse,
        ),
        (this.polvoVel = new Float32Array(this.polvoN * 3)),
        (this.polvoVida = new Float32Array(this.polvoN)));
    }
    montar() {
      let e = new xa(16761994, 2.6);
      (e.position.copy(this.sol).multiplyScalar(80),
        (e.castShadow = !0),
        e.shadow.mapSize.set(2048, 2048));
      let t = e.shadow.camera;
      ((t.left = -36),
        (t.right = 36),
        (t.top = 36),
        (t.bottom = -36),
        (t.near = 1),
        (t.far = 200),
        (e.shadow.radius = 6),
        (e.shadow.bias = -5e-4),
        this.scene.add(e, e.target),
        (this.sombraMat = new xi({ color: 2755842, opacity: 0.42 })));
      let n = new Qr(new yi(200, 200), this.sombraMat);
      ((n.rotation.x = -Math.PI / 2),
        (n.receiveShadow = !0),
        this.scene.add(n));
      let r = (e, t = !1) =>
          new oi({
            size: e,
            map: Tl(t),
            transparent: !0,
            depthWrite: !1,
            depthTest: !1,
            sizeAttenuation: !0,
          }),
        i = (e) => {
          let t = new Or();
          return (
            t.setAttribute(`position`, new pr(new Float32Array(e * 3), 3)),
            t.setDrawRange(0, 0),
            t
          );
        };
      ((this.guiaPuntos = new di(i(60), r(0.42))),
        (this.guiaAro = new di(i(1), r(2.3, !0))),
        (this.guiaObj = new di(i(8), r(0.34))));
      for (let e of [this.guiaPuntos, this.guiaAro, this.guiaObj])
        ((e.frustumCulled = !1), (e.renderOrder = 10), this.scene.add(e));
      ((this.polvoGeo = new Or()),
        this.polvoGeo.setAttribute(
          `position`,
          new pr(new Float32Array(this.polvoN * 3), 3),
        ),
        this.polvoGeo.setAttribute(
          `color`,
          new pr(new Float32Array(this.polvoN * 3), 3),
        ));
      let a = new di(
        this.polvoGeo,
        new oi({
          size: 0.42,
          map: Cl(`rgba(255,255,255,1)`, `rgba(255,255,255,0)`),
          vertexColors: !0,
          transparent: !0,
          depthWrite: !1,
          opacity: 0.85,
        }),
      );
      ((a.frustumCulled = !1),
        this.scene.add(a),
        (this.rastroGeo = new Or()),
        this.rastroGeo.setAttribute(
          `position`,
          new pr(new Float32Array(600), 3),
        ),
        this.rastroGeo.setAttribute(`color`, new pr(new Float32Array(600), 3)),
        this.rastroGeo.setDrawRange(0, 0));
      let o = new di(
        this.rastroGeo,
        new oi({
          size: 2.2,
          map: this.texBrillo,
          vertexColors: !0,
          transparent: !0,
          depthWrite: !1,
          blending: 2,
        }),
      );
      ((o.frustumCulled = !1),
        this.scene.add(o),
        (this.terronGeo = new Or()),
        this.terronGeo.setAttribute(
          `position`,
          new pr(new Float32Array(480), 3),
        ));
      let s = new di(
        this.terronGeo,
        new oi({
          size: 0.36,
          map: wl(),
          alphaTest: 0.3,
          transparent: !0,
          depthWrite: !1,
          color: 16777215,
        }),
      );
      ((s.frustumCulled = !1), this.scene.add(s));
    }
    async cargarNino(e) {
      let t = await new aa().loadAsync(e);
      ((t.colorSpace = ze),
        (t.anisotropy = this.renderer.capabilities.getMaxAnisotropy()),
        (this.nino = new Qr(
          new yi(1, 1),
          new Br({ map: t, transparent: !0, depthWrite: !1, toneMapped: !1 }),
        )),
        (this.nino.renderOrder = -5),
        (this.nino.visible = !1),
        (this.ninoSombra = new Qr(
          new yi(1, 1),
          new Br({ map: this.texSombra, transparent: !0, depthWrite: !1 }),
        )),
        (this.ninoSombra.rotation.x = -Math.PI / 2),
        (this.ninoSombra.renderOrder = -6),
        (this.ninoSombra.visible = !1),
        this.scene.add(this.nino, this.ninoSombra));
    }
    ponerNino(e, t, n, r, i = 0) {
      if (
        !this.nino ||
        ((this.nino.visible = this.ninoSombra.visible = r > 0.01),
        !this.nino.visible)
      )
        return;
      let a = this.base.position,
        o = new H(e, n, t).clone().sub(a),
        s = o.length();
      o.normalize();
      let c = s + 2.2,
        l = a.clone().addScaledVector(o, c),
        u = ((c / s) * n) / 21,
        d = 340 * u,
        f = 515 * u,
        p = new H(1, 0, 0).applyQuaternion(this.base.quaternion),
        m = new H(0, 1, 0).applyQuaternion(this.base.quaternion);
      (this.nino.position
        .copy(l)
        .addScaledVector(p, 0.09705882352941175 * d)
        .addScaledVector(m, 0.45145631067961167 * f - i * f * 0.025),
        this.nino.quaternion.copy(this.base.quaternion),
        this.nino.scale.set(d, f, 1));
      let h = this.noche,
        g = this.nino.material;
      ((g.opacity = r),
        g.color.setRGB(1 - 0.62 * h, 1 - 0.58 * h, 1 - 0.36 * h),
        this.ninoSombra.position.set(e + 1.6, 0.015, t - 2.6),
        this.ninoSombra.scale.set(11, 5, 1),
        (this.ninoSombra.material.opacity = 0.75 * r));
    }
    async barrio(e) {
      let t = await new aa().loadAsync(e.placa);
      if (
        ((t.colorSpace = ze),
        (t.anisotropy = this.renderer.capabilities.getMaxAnisotropy()),
        this.placa && this.placa.dispose(),
        (this.placa = t),
        (this.lamparasUv = [0, 1, 2].map((t) =>
          e.lamparas[t]
            ? new V(e.lamparas[t][0] / q.ancho, 1 - e.lamparas[t][1] / q.alto)
            : new V(-1, -1),
        )),
        !this.telon)
      ) {
        let e = 800 * Math.tan(Dt.degToRad(cl.fovV / 2)),
          n = new Ai({
            vertexShader: bl,
            fragmentShader: xl,
            depthWrite: !1,
            uniforms: {
              uPlaca: { value: t },
              uNoche: { value: 0 },
              uLamparas: { value: this.lamparasUv },
              uAspecto: { value: q.ancho / q.alto },
            },
          });
        ((this.telon = new Qr(new yi(e * this.camera.aspect, e), n)),
          this.telon.position
            .set(0, 0, -400)
            .applyMatrix4(this.camera.matrixWorld),
          this.telon.quaternion.copy(this.camera.quaternion),
          (this.telon.renderOrder = -10),
          this.scene.add(this.telon),
          this.matsNoche.push(n));
      }
      for (let e of this.matsNoche)
        ((e.uniforms.uPlaca.value = t),
          (e.uniforms.uLamparas.value = this.lamparasUv));
    }
    tamaño(e, t) {
      (this.renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          matchMedia(`(pointer: coarse)`).matches ? 1.75 : 2,
        ),
      ),
        this.renderer.setSize(e, t, !1));
    }
    placaASuelo(e, t, n = 0) {
      let r = new V((e / q.ancho) * 2 - 1, -((t / q.alto) * 2 - 1));
      this.ray.setFromCamera(r, this.base);
      let i = (n - this.ray.ray.origin.y) / this.ray.ray.direction.y;
      return this.ray.ray.origin
        .clone()
        .addScaledVector(this.ray.ray.direction, i);
    }
    aPlaca(e) {
      let t = e.clone().project(this.base);
      return { x: ((t.x + 1) / 2) * q.ancho, y: ((1 - t.y) / 2) * q.alto };
    }
    aPantalla(e) {
      this.camera.updateProjectionMatrix();
      let t = e.clone().project(this.camera);
      return { x: (t.x + 1) / 2, y: (1 - t.y) / 2 };
    }
    crearBola(e, t = !1) {
      let n = Sl[e.color % Sl.length],
        r = yl(
          this.placa,
          this.vp,
          n,
          2.4 + (e.id % 4) * 0.7,
          e.color % 2 ? 4 : 3,
          e.id * 0.37 + e.color,
        );
      ((r.uniforms.uLamparas.value = this.lamparasUv), this.matsNoche.push(r));
      let i = new Qr(new bi(e.r * 1.002, 40, 28), r);
      ((i.castShadow = !0), e.tirador && e.z < -13 && (i.renderOrder = -7));
      let a = new En();
      a.add(i);
      let o = new Ot().setFromEuler(
          new cn(
            Math.random() * 6.28,
            Math.random() * 6.28,
            Math.random() * 6.28,
          ),
        ),
        s = new Qr(
          new yi(1, 1),
          new Br({ map: this.texSombra, transparent: !0, depthWrite: !1 }),
        );
      ((s.rotation.x = -Math.PI / 2), s.scale.set(e.r * 2.1, e.r * 2.1, 1));
      let c = new Qr(
        new yi(1, 1),
        new Br({
          map: this.texBrillo,
          transparent: !0,
          depthWrite: !1,
          blending: 2,
          color: new W(n[1]).lerp(new W(16767392), 0.6),
          opacity: 0.9,
        }),
      );
      ((c.rotation.x = -Math.PI / 2),
        c.scale.set(e.r * 1.1, e.r * 2.1, 1),
        this.scene.add(a, s, c),
        this.vistas.set(e.id, {
          grupo: a,
          esfera: i,
          mat: r,
          giro: o,
          sombra: s,
          brillo: c,
          b: e,
          quitar: -1,
          aparece: +!t,
          alza: 0,
          extra: new H(),
          estela: !1,
          rastro: [],
        }));
    }
    quitarBola(e) {
      let t = this.vistas.get(e);
      t && t.quitar < 0 && (t.quitar = 0);
    }
    desplazar(e, t, n) {
      let r = this.vistas.get(e);
      r && r.extra.set(t, 0, n);
    }
    limpiar() {
      for (let e of [...this.vistas.keys()]) this.borrar(e);
    }
    estela(e) {
      let t = this.vistas.get(e);
      t && (t.estela = !0);
    }
    borrar(e) {
      let t = this.vistas.get(e);
      t &&
        (this.scene.remove(t.grupo, t.sombra, t.brillo),
        t.esfera.geometry.dispose(),
        t.mat.dispose(),
        (this.matsNoche = this.matsNoche.filter((e) => e !== t.mat)),
        this.vistas.delete(e));
    }
    ponerNoche(e) {
      this.noche = e;
      for (let t of this.matsNoche) t.uniforms.uNoche.value = e;
    }
    actualizar(e) {
      let t = new H(),
        n = new Ot(),
        r = new U(),
        i = new Zt(),
        a = 1 - Math.min(1, this.noche * 1.4);
      this.sombraMat.opacity = 0.42 * (0.25 + 0.75 * a);
      for (let [o, s] of this.vistas) {
        let c = s.b,
          l = Math.hypot(c.vx, c.vz);
        (l > 0 &&
          (t.set(c.vz, 0, -c.vx).normalize(),
          n.setFromAxisAngle(t, (l * e) / c.r),
          s.giro.premultiply(n)),
          s.aparece < 1 && (s.aparece = Math.min(1, s.aparece + e * 2.4)));
        let u =
          s.aparece < 1
            ? Math.abs(Math.cos(s.aparece * Math.PI * 1.5)) *
              (1 - s.aparece) *
              4
            : 0;
        s.quitar >= 0 &&
          ((s.quitar += e), (s.alza = Math.min(1.2, s.alza + e * 3)));
        let d = c.r + u + s.alza;
        (s.grupo.position.set(c.x + s.extra.x, d, c.z + s.extra.z),
          i.makeRotationFromQuaternion(s.giro),
          r.setFromMatrix4(i),
          s.mat.uniforms.uCentro.value.copy(s.grupo.position),
          (s.mat.uniforms.uR.value = c.r),
          s.mat.uniforms.uRot.value.copy(r));
        let f = s.quitar >= 0 ? Math.max(0, 1 - s.quitar * 2.2) : 1;
        s.mat.uniforms.uOpacidad.value = f;
        let p = Math.max(0, 1 - (u + s.alza) / 4);
        (s.sombra.position.set(
          c.x + s.extra.x + 0.12,
          0.012,
          c.z + s.extra.z + 0.22,
        ),
          s.sombra.scale.set(c.r * 2.1 * p, c.r * 2.1 * p, 1),
          s.brillo.position.set(
            c.x + s.extra.x - this.sol.x * c.r * 1.5,
            0.02,
            c.z + s.extra.z - this.sol.z * c.r * 1.5,
          ),
          (s.brillo.material.opacity = (c.tirador ? 0.3 : 1) * a * p),
          s.estela &&
            (s.rastro.unshift(s.grupo.position.clone()),
            s.rastro.length > 24 && s.rastro.pop()),
          s.quitar > 0.5 && this.borrar(o));
      }
      let o = this.rastroGeo.attributes.position.array,
        s = this.rastroGeo.attributes.color.array,
        c = 0;
      for (let e of this.vistas.values())
        e.estela &&
          e.rastro.forEach((t, n) => {
            if (c >= 200 || n === 0) return;
            let r =
              (1 - n / e.rastro.length) *
              0.75 *
              (e.quitar >= 0 ? Math.max(0, 1 - e.quitar * 2) : 1);
            ((o[c * 3] = t.x),
              (o[c * 3 + 1] = t.y),
              (o[c * 3 + 2] = t.z),
              (s[c * 3] = r * 1.3),
              (s[c * 3 + 1] = r * 1.1),
              (s[c * 3 + 2] = r * 0.75),
              c++);
          });
      (this.rastroGeo.setDrawRange(0, c),
        (this.rastroGeo.attributes.position.needsUpdate = !0),
        (this.rastroGeo.attributes.color.needsUpdate = !0));
      let l = this.polvoGeo.attributes.position.array,
        u = this.polvoGeo.attributes.color.array,
        d = 0.4 + 0.6 * a;
      for (let t = 0; t < this.polvoN; t++) {
        if (this.polvoVida[t] <= 0) {
          l[t * 3 + 1] = -50;
          continue;
        }
        ((this.polvoVida[t] -= e), (this.polvoVel[t * 3 + 1] -= 18 * e));
        for (let n = 0; n < 3; n++)
          l[t * 3 + n] += this.polvoVel[t * 3 + n] * e;
        l[t * 3 + 1] < 0.05 &&
          ((l[t * 3 + 1] = 0.05),
          (this.polvoVel[t * 3] *= 0.6),
          (this.polvoVel[t * 3 + 2] *= 0.6),
          (this.polvoVel[t * 3 + 1] *= -0.2));
        let n = Math.max(0, Math.min(1, this.polvoVida[t] * 1.5)) * d,
          r = this.polvoClaro[t] * 0.35;
        ((u[t * 3] = (0.74 + r) * n),
          (u[t * 3 + 1] = (0.44 + r * 0.8) * n),
          (u[t * 3 + 2] = (0.27 + r * 0.6) * n));
      }
      ((this.polvoGeo.attributes.position.needsUpdate = !0),
        (this.polvoGeo.attributes.color.needsUpdate = !0));
      let f = this.terronGeo.attributes.position.array;
      for (let t = 0; t < 160; t++)
        if (this.terronVida[t] <= 0) f[t * 3 + 1] = -50;
        else {
          ((this.terronVida[t] -= e), (this.terronVel[t * 3 + 1] -= 30 * e));
          for (let n = 0; n < 3; n++)
            f[t * 3 + n] += this.terronVel[t * 3 + n] * e;
          f[t * 3 + 1] < 0.12 &&
            ((f[t * 3 + 1] = 0.12),
            (this.terronVel[t * 3] *= 0.5),
            (this.terronVel[t * 3 + 2] *= 0.5),
            (this.terronVel[t * 3 + 1] *= -0.25));
        }
      this.terronGeo.attributes.position.needsUpdate = !0;
    }
    estallido(e, t, n, r) {
      let i = this.terronGeo.attributes.position.array,
        a = 0;
      for (let o = 0; o < 160 && a < 110; o++) {
        if (this.terronVida[o] > 0) continue;
        let s = Math.atan2(r, n) + (Math.random() - 0.5) * 1.8,
          c = 2 + Math.random() * 12;
        ((i[o * 3] = e),
          (i[o * 3 + 1] = 0.3),
          (i[o * 3 + 2] = t),
          (this.terronVel[o * 3] = Math.cos(s) * c),
          (this.terronVel[o * 3 + 1] = 4 + Math.random() * 16),
          (this.terronVel[o * 3 + 2] = Math.sin(s) * c),
          (this.terronVida[o] = 0.9 + Math.random() * 0.8),
          a++);
      }
      this.polvo(e, t, 30, 1.3, !0);
    }
    polvo(e, t, n, r = 1, i = !1) {
      let a = 0,
        o = this.polvoGeo.attributes.position.array;
      for (let s = 0; s < this.polvoN && a < n; s++) {
        if (this.polvoVida[s] > 0) continue;
        let n = Math.random() * Math.PI * 2,
          c = (1.5 + Math.random() * 4) * r;
        ((o[s * 3] = e + Math.cos(n) * 0.4),
          (o[s * 3 + 1] = 0.1),
          (o[s * 3 + 2] = t + Math.sin(n) * 0.4),
          (this.polvoVel[s * 3] = Math.cos(n) * c),
          (this.polvoVel[s * 3 + 1] = 2 + Math.random() * 5 * r),
          (this.polvoVel[s * 3 + 2] = Math.sin(n) * c),
          (this.polvoVida[s] = 0.5 + Math.random() * 0.7),
          (this.polvoClaro[s] = +!!i),
          a++);
      }
    }
    guia(e, t = 1, n = 16777215) {
      let r = this.guiaPuntos.geometry,
        i = this.guiaAro.geometry,
        a = this.guiaObj.geometry;
      if (!e) {
        (r.setDrawRange(0, 0), i.setDrawRange(0, 0), a.setDrawRange(0, 0));
        return;
      }
      let o = r.attributes.position.array,
        s = 0;
      for (let t = 2; t < e.camino.length - +!!e.choque && s < 60; t++)
        ((o[s * 3] = e.camino[t].x),
          (o[s * 3 + 1] = 0.22),
          (o[s * 3 + 2] = e.camino[t].z),
          s++);
      if (
        ((r.attributes.position.needsUpdate = !0),
        r.setDrawRange(0, s),
        e.choque)
      ) {
        let r = i.attributes.position.array;
        ((r[0] = e.choque.x),
          (r[1] = t),
          (r[2] = e.choque.z),
          (i.attributes.position.needsUpdate = !0),
          i.setDrawRange(0, 1),
          (this.guiaAro.material.size = t * 2.3));
        let o = a.attributes.position.array,
          s = this.vistas.get(e.choque.id)?.b,
          c = Math.max(2, Math.min(8, Math.round(e.choque.v / 5)));
        if (s)
          for (let t = 0; t < c; t++)
            ((o[t * 3] = s.x + e.choque.dx * (1.6 + t * 0.85)),
              (o[t * 3 + 1] = 0.22),
              (o[t * 3 + 2] = s.z + e.choque.dz * (1.6 + t * 0.85)));
        ((a.attributes.position.needsUpdate = !0),
          a.setDrawRange(0, s ? c : 0),
          this.guiaObj.material.color.set(n).lerp(new W(16777215), 0.35));
      } else (i.setDrawRange(0, 0), a.setDrawRange(0, 0));
    }
    enfocar(e, t, n, r) {
      let i = Math.min(1, r * 1.8);
      if (
        ((this.zoom += (e - this.zoom) * i),
        (this.fx += (t - this.fx) * i),
        (this.fy += (n - this.fy) * i),
        this.zoom < 1.003)
      ) {
        this.camera.clearViewOffset();
        return;
      }
      let a = q.ancho / this.zoom,
        o = q.alto / this.zoom,
        s = Math.min(q.ancho - a, Math.max(0, this.fx - a / 2)),
        c = Math.min(q.alto - o, Math.max(0, this.fy - o / 2));
      this.camera.setViewOffset(q.ancho, q.alto, s, c, a, o);
    }
    enfocarYa(e, t, n) {
      ((this.zoom = e), (this.fx = t), (this.fy = n), this.enfocar(e, t, n, 1));
    }
    render() {
      this.renderer.render(this.scene, this.camera);
    }
  },
  Dl = 0.18,
  Ol = (e) => 6 + 52 * e,
  kl = class e {
    bolas = [];
    eventos = [];
    semilla;
    constructor(e = 7) {
      this.semilla = e;
    }
    azar() {
      return (
        (this.semilla = (this.semilla * 1664525 + 1013904223) >>> 0),
        this.semilla / 4294967296
      );
    }
    añadir(e, t, n, r, i = 0) {
      let a = {
        id: this.bolas.length,
        x: e,
        z: t,
        vx: 0,
        vz: 0,
        r: n,
        m: n * n * n,
        tirador: r,
        fuera: !1,
        viva: !0,
        color: i,
      };
      return (this.bolas.push(a), a);
    }
    vivas() {
      return this.bolas.filter((e) => e.viva);
    }
    quieta() {
      return this.bolas.every((e) => !e.viva || (e.vx === 0 && e.vz === 0));
    }
    rapidez() {
      let e = 0;
      for (let t of this.bolas) t.viva && (e += Math.hypot(t.vx, t.vz));
      return e;
    }
    paso(e) {
      let t = 0;
      for (let e of this.bolas)
        e.viva && (t = Math.max(t, Math.hypot(e.vx, e.vz)));
      let n = Math.max(1, Math.ceil((t * e) / Dl));
      for (let t = 0; t < n; t++) this.subpaso(e / n);
    }
    subpaso(e) {
      let t = this.bolas.filter((e) => e.viva);
      for (let n of t) {
        let t = Math.hypot(n.vx, n.vz);
        if (t === 0) continue;
        let r = Math.max(0, t - 30 * e);
        r < 0.2
          ? (n.vx = n.vz = 0)
          : ((n.vx *= r / t),
            (n.vz *= r / t),
            (n.x += n.vx * e),
            (n.z += n.vz * e));
      }
      for (let e = 0; e < t.length; e++)
        for (let n = e + 1; n < t.length; n++) {
          let r = t[e],
            i = t[n],
            a = i.x - r.x,
            o = i.z - r.z,
            s = Math.hypot(a, o),
            c = r.r + i.r;
          if (s >= c || s === 0) continue;
          let l = a / s,
            u = o / s,
            d = c - s,
            f = 1 / r.m,
            p = 1 / i.m;
          ((r.x -= (l * d * f) / (f + p)),
            (r.z -= (u * d * f) / (f + p)),
            (i.x += (l * d * p) / (f + p)),
            (i.z += (u * d * p) / (f + p)));
          let m = (i.vx - r.vx) * l + (i.vz - r.vz) * u;
          if (m >= 0) continue;
          let h = (-1.9 * m) / (f + p);
          ((r.vx -= h * f * l),
            (r.vz -= h * f * u),
            (i.vx += h * p * l),
            (i.vz += h * p * u),
            this.eventos.push({
              tipo: `choque`,
              fuerza: -m,
              x: (r.x + i.x) / 2,
              z: (r.z + i.z) / 2,
              a: r.id,
              b: i.id,
            }));
        }
      for (let e of t)
        e.tirador ||
          e.fuera ||
          (Math.hypot(e.x, e.z) > 13 + e.r * 0.5 &&
            ((e.fuera = !0),
            this.eventos.push({ tipo: `fuera`, id: e.id, x: e.x, z: e.z })));
    }
    copia() {
      let t = new e(this.semilla);
      return ((t.bolas = this.bolas.map((e) => ({ ...e }))), t);
    }
  };
