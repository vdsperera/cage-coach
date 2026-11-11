/**
 * Octagonal Combat Arena & Lighting Subsystem for Cagecraft 3D
 */

import * as THREE from 'three';

export interface ArenaComponents {
  mat: THREE.Mesh;
  centre: THREE.Mesh;
  floor: THREE.Mesh;
  cageGroup: THREE.Group;
  lightsGroup: THREE.Group;
}

export function buildArena(scene: THREE.Scene): ArenaComponents {
  const lightsGroup = new THREE.Group();
  lightsGroup.name = 'lightsGroup';

  // Hemisphere Sky / Ground ambient light
  const hemi = new THREE.HemisphereLight(0xcfd6e0, 0x2a2f36, 0.75);
  lightsGroup.add(hemi);

  // Directional Sun with soft shadow map
  const sun = new THREE.DirectionalLight(0xffffff, 0.95);
  sun.position.set(3, 6, 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 20;
  sun.shadow.camera.left = -5;
  sun.shadow.camera.bottom = -5;
  sun.shadow.camera.right = 5;
  sun.shadow.camera.top = 5;
  sun.shadow.bias = -0.0015;
  lightsGroup.add(sun);

  // Fill directional light
  const fill = new THREE.DirectionalLight(0x9fb4d0, 0.3);
  fill.position.set(-4, 3, -3);
  lightsGroup.add(fill);
  scene.add(lightsGroup);

  // Octagonal Combat Mat
  const mat = new THREE.Mesh(
    new THREE.CylinderGeometry(4.6, 4.6, 0.08, 8),
    new THREE.MeshStandardMaterial({ color: 0x39434f, roughness: 0.95 })
  );
  mat.position.y = -0.04;
  mat.receiveShadow = true;
  mat.rotation.y = Math.PI / 8;
  scene.add(mat);

  // Center Canvas Target Circle
  const centre = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 48),
    new THREE.MeshStandardMaterial({ color: 0x44505d, roughness: 0.95 })
  );
  centre.rotation.x = -Math.PI / 2;
  centre.position.y = 0.002;
  centre.receiveShadow = true;
  scene.add(centre);

  // External Ground Plane
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0x1e242b, roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.08;
  floor.receiveShadow = true;
  scene.add(floor);

  // Octagonal Fence Cage & Padding
  const cageGroup = new THREE.Group();
  cageGroup.name = 'cageGroup';

  const postMat = new THREE.MeshStandardMaterial({ color: 0x1a1f26, roughness: 0.5, metalness: 0.4 });
  const padMat = new THREE.MeshStandardMaterial({ color: 0x2b333d, roughness: 0.9 });

  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  if (g) {
    g.strokeStyle = 'rgba(200,205,212,0.55)';
    g.lineWidth = 2;
    for (let i = -128; i < 256; i += 32) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i + 128, 128);
      g.stroke();
      g.beginPath();
      g.moveTo(i + 128, 0);
      g.lineTo(i, 128);
      g.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const fenceMat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const r = 4.6;
  const h = 1.8;

  for (let i = 0; i < 8; i++) {
    const a0 = (i * Math.PI) / 4 + Math.PI / 8;
    const a1 = a0 + Math.PI / 4;
    const x0 = Math.cos(a0) * r;
    const z0 = Math.sin(a0) * r;
    const x1 = Math.cos(a1) * r;
    const z1 = Math.sin(a1) * r;

    // Steel Post
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, h + 0.1, 10), postMat);
    post.position.set(x0, h / 2, z0);
    cageGroup.add(post);

    const len = Math.hypot(x1 - x0, z1 - z0);
    const t2 = tex.clone();
    t2.needsUpdate = true;
    t2.repeat.set(len * 2.2, h * 2.2);

    // Fence Panel
    const panelMat = fenceMat.clone();
    panelMat.map = t2;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(len, h), panelMat);
    panel.position.set((x0 + x1) / 2, h / 2 + 0.12, (z0 + z1) / 2);
    panel.lookAt(0, h / 2 + 0.12, 0);
    cageGroup.add(panel);

    // Top Vinyl Padding
    const pad = new THREE.Mesh(new THREE.BoxGeometry(len, 0.16, 0.1), padMat);
    pad.position.set((x0 + x1) / 2, h + 0.1, (z0 + z1) / 2);
    pad.lookAt(0, h + 0.1, 0);
    cageGroup.add(pad);

    // Base Vinyl Padding
    const base = new THREE.Mesh(new THREE.BoxGeometry(len, 0.18, 0.1), padMat);
    base.position.set((x0 + x1) / 2, 0.05, (z0 + z1) / 2);
    base.lookAt(0, 0.05, 0);
    cageGroup.add(base);
  }

  scene.add(cageGroup);

  return {
    mat,
    centre,
    floor,
    cageGroup,
    lightsGroup,
  };
}
