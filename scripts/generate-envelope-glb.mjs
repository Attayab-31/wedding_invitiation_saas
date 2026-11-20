import * as THREE from 'three';
import fs from 'fs';
import path from 'path';

// Polyfill FileReader for Node.js GLTFExporter binary export
if (typeof FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onload) this.onload();
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Luxury Royal Pakistani Palette
const COLOR_BURGUNDY_VELVET = 0x420816; // Deep Imperial Velvet Burgundy
const COLOR_BURGUNDY_RICH = 0x540C1E;   // Royal Maroon
const COLOR_GOLD_ANTIQUE = 0xC5A15A;    // Antique Gold Foil
const COLOR_GOLD_CHAMPAGNE = 0xDFCA94;  // Champagne Gold Lining
const COLOR_IVORY_PAPER = 0xFAF7F2;     // 600gsm Cotton Rag Paper

// Root scene
const scene = new THREE.Scene();
scene.name = 'Luxury_Wedding_Invitation_Scene';

const envelopeGroup = new THREE.Group();
envelopeGroup.name = 'Envelope_Root';
scene.add(envelopeGroup);

const bodyWidth = 3.6;
const bodyHeight = 2.4;

// 1. Envelope Paper Materials
const envelopePaperMaterial = new THREE.MeshStandardMaterial({
  color: 0x4A0A1C,
  roughness: 0.72,
  metalness: 0.04,
  name: 'Envelope_Paper_Mat',
});

const envelopeInnerLiningMat = new THREE.MeshStandardMaterial({
  color: 0xB88E3E,
  roughness: 0.48,
  metalness: 0.32,
  name: 'Envelope_Inner_Lining_Mat',
});

const goldTrimMaterial = new THREE.MeshStandardMaterial({
  color: COLOR_GOLD_ANTIQUE,
  metalness: 0.9,
  roughness: 0.2,
  name: 'Antique_Gold_Foil_Mat',
});

const waxMaterial = new THREE.MeshStandardMaterial({
  color: COLOR_BURGUNDY_RICH,
  roughness: 0.3,
  metalness: 0.2,
  name: 'Burgundy_Wax_Mat',
});

// Envelope Back Plate
const backGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, 0.02);
const envelopeBack = new THREE.Mesh(backGeometry, envelopePaperMaterial);
envelopeBack.name = 'Envelope_Body';
envelopeBack.position.set(0, 0, -0.03);
envelopeGroup.add(envelopeBack);

// Luxury Gold Foil Inner Lining (revealed when flap opens and card lifts)
const liningGeometry = new THREE.BoxGeometry(bodyWidth * 0.94, bodyHeight * 0.92, 0.005);
const envelopeLining = new THREE.Mesh(liningGeometry, envelopeInnerLiningMat);
envelopeLining.name = 'Envelope_Inner_Lining';
envelopeLining.position.set(0, 0, -0.015);
envelopeGroup.add(envelopeLining);

// Envelope Pocket Front (Lower fold)
const pocketShape = new THREE.Shape();
pocketShape.moveTo(-bodyWidth * 0.5, -bodyHeight * 0.5);
pocketShape.lineTo(bodyWidth * 0.5, -bodyHeight * 0.5);
pocketShape.lineTo(bodyWidth * 0.5, bodyHeight * 0.06);
pocketShape.lineTo(0, -bodyHeight * 0.12);
pocketShape.lineTo(-bodyWidth * 0.5, bodyHeight * 0.06);
pocketShape.closePath();
const pocketGeometry = new THREE.ShapeGeometry(pocketShape);
const pocket = new THREE.Mesh(pocketGeometry, envelopePaperMaterial);
pocket.name = 'Envelope_Pocket';
pocket.position.set(0, 0, 0.07);
envelopeGroup.add(pocket);

// Folded side wings, set behind the front pocket
const leftFoldShape = new THREE.Shape();
leftFoldShape.moveTo(-bodyWidth * 0.5, -bodyHeight * 0.5);
leftFoldShape.lineTo(0, 0);
leftFoldShape.lineTo(-bodyWidth * 0.5, bodyHeight * 0.5);
leftFoldShape.closePath();
const leftFoldGeo = new THREE.ShapeGeometry(leftFoldShape);
const leftFold = new THREE.Mesh(leftFoldGeo, envelopePaperMaterial);
leftFold.position.set(0, 0, 0.018);
envelopeGroup.add(leftFold);

const rightFoldShape = new THREE.Shape();
rightFoldShape.moveTo(bodyWidth * 0.5, -bodyHeight * 0.5);
rightFoldShape.lineTo(0, 0);
rightFoldShape.lineTo(bodyWidth * 0.5, bodyHeight * 0.5);
rightFoldShape.closePath();
const rightFoldGeo = new THREE.ShapeGeometry(rightFoldShape);
const rightFold = new THREE.Mesh(rightFoldGeo, envelopePaperMaterial);
rightFold.position.set(0, 0, 0.019);
envelopeGroup.add(rightFold);

// Top edge gold foil trim
const trimTopGeo = new THREE.BoxGeometry(bodyWidth + 0.04, 0.02, 0.03);
const trimTop = new THREE.Mesh(trimTopGeo, goldTrimMaterial);
trimTop.name = 'Gold_Ornament';
trimTop.position.set(0, bodyHeight * 0.5, 0);
envelopeGroup.add(trimTop);

// 2. Envelope Flap with Pivot at Hinge (y = bodyHeight * 0.5 = 1.2)
const flapPivot = new THREE.Group();
flapPivot.name = 'Envelope_Flap_Pivot';
flapPivot.position.set(0, bodyHeight * 0.5, 0.025);
envelopeGroup.add(flapPivot);

const flapShape = new THREE.Shape();
flapShape.moveTo(-bodyWidth * 0.5, 0);
flapShape.lineTo(bodyWidth * 0.5, 0);
flapShape.lineTo(0, -bodyHeight * 0.65);
flapShape.closePath();

const flapExtrudeSettings = {
  depth: 0.016,
  bevelEnabled: true,
  bevelSegments: 3,
  steps: 1,
  bevelSize: 0.01,
  bevelThickness: 0.01,
};
const flapGeometry = new THREE.ExtrudeGeometry(flapShape, flapExtrudeSettings);
const flapMesh = new THREE.Mesh(flapGeometry, envelopePaperMaterial);
flapMesh.name = 'Envelope_Flap';
flapPivot.add(flapMesh);

// Gold trim along flap edge
const flapTrimLineShape = new THREE.Shape();
flapTrimLineShape.moveTo(-bodyWidth * 0.48, -0.01);
flapTrimLineShape.lineTo(0, -bodyHeight * 0.63);
flapTrimLineShape.lineTo(bodyWidth * 0.48, -0.01);
flapTrimLineShape.lineTo(bodyWidth * 0.46, -0.01);
flapTrimLineShape.lineTo(0, -bodyHeight * 0.60);
flapTrimLineShape.lineTo(-bodyWidth * 0.46, -0.01);
flapTrimLineShape.closePath();
const flapTrimGeo = new THREE.ShapeGeometry(flapTrimLineShape);
const flapTrimMesh = new THREE.Mesh(flapTrimGeo, goldTrimMaterial);
flapTrimMesh.name = 'Flap_Gold_Trim';
flapTrimMesh.position.set(0, 0, 0.028);
flapPivot.add(flapTrimMesh);

// Restrained foil arabesques bring depth to the otherwise plain velvet flap
const addFoilCurve = (parent, name, points, radius = 0.009) => {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  );
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 32, radius, 6, false),
    goldTrimMaterial
  );
  mesh.name = name;
  parent.add(mesh);
};

const flapOrnamentLeft = [
  [-1.28, -0.12, 0.046],
  [-1.03, -0.2, 0.046],
  [-0.86, -0.42, 0.046],
  [-0.65, -0.47, 0.046],
  [-0.48, -0.33, 0.046],
  [-0.33, -0.49, 0.046],
  [-0.18, -0.54, 0.046],
];
addFoilCurve(flapPivot, 'Flap_Arabesque_Left', flapOrnamentLeft);
addFoilCurve(
  flapPivot,
  'Flap_Arabesque_Right',
  flapOrnamentLeft.map(([x, y, z]) => [-x, y, z])
);

const flapRosette = new THREE.Group();
flapRosette.name = 'Flap_Central_Rosette';
flapRosette.position.set(0, -0.78, 0.048);
flapPivot.add(flapRosette);
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const petal = new THREE.Mesh(
    new THREE.TorusGeometry(0.055, 0.008, 6, 16),
    goldTrimMaterial
  );
  petal.position.set(Math.cos(angle) * 0.075, Math.sin(angle) * 0.075, 0);
  petal.scale.set(0.75, 1.25, 1);
  petal.rotation.z = angle;
  flapRosette.add(petal);
}
const rosetteCenter = new THREE.Mesh(
  new THREE.SphereGeometry(0.028, 12, 8),
  goldTrimMaterial
);
rosetteCenter.position.z = 0.008;
flapRosette.add(rosetteCenter);

// Fine raised foil seams trace the envelope's characteristic V-fold
addFoilCurve(
  envelopeGroup,
  'Pocket_Foil_Seam',
  [
    [-bodyWidth * 0.47, bodyHeight * 0.055, 0.092],
    [-bodyWidth * 0.24, -bodyHeight * 0.16, 0.092],
    [0, -bodyHeight * 0.32, 0.092],
    [bodyWidth * 0.24, -bodyHeight * 0.16, 0.092],
    [bodyWidth * 0.47, bodyHeight * 0.055, 0.092],
  ],
  0.012
);

// 3. Wax Seal (Attached to Flap so it swings open realistically with the flap)
const waxSealGroup = new THREE.Group();
waxSealGroup.name = 'Wax_Seal';
waxSealGroup.position.set(0, -bodyHeight * 0.65, 0.038);
flapPivot.add(waxSealGroup);

// Irregular scalloped wax disc
const sealDiscGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.06, 32);
sealDiscGeo.rotateX(Math.PI / 2);
const sealDisc = new THREE.Mesh(sealDiscGeo, waxMaterial);
waxSealGroup.add(sealDisc);

// Inner crest rim
const crestRimGeo = new THREE.TorusGeometry(0.28, 0.03, 16, 32);
const crestRim = new THREE.Mesh(crestRimGeo, waxMaterial);
crestRim.position.z = 0.035;
waxSealGroup.add(crestRim);

// Embossed Royal Monogram "A&M" in Gold
const monogramGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 32);
monogramGeo.rotateX(Math.PI / 2);
const monogramMesh = new THREE.Mesh(monogramGeo, goldTrimMaterial);
monogramMesh.name = 'Seal_Monogram';
monogramMesh.position.z = 0.042;
waxSealGroup.add(monogramMesh);

const sealEngraving = new THREE.Group();
sealEngraving.name = 'Seal_Floral_Engraving';
sealEngraving.position.z = 0.058;
waxSealGroup.add(sealEngraving);
const sealEngravingRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.15, 0.009, 6, 32),
  waxMaterial
);
sealEngraving.add(sealEngravingRing);
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const petal = new THREE.Mesh(
    new THREE.TorusGeometry(0.045, 0.008, 6, 12),
    waxMaterial
  );
  petal.position.set(Math.cos(angle) * 0.085, Math.sin(angle) * 0.085, 0.002);
  petal.scale.set(0.7, 1.2, 1);
  petal.rotation.z = angle;
  sealEngraving.add(petal);
}
const sealEngravingCenter = new THREE.Mesh(
  new THREE.SphereGeometry(0.024, 10, 8),
  waxMaterial
);
sealEngravingCenter.position.z = 0.005;
sealEngraving.add(sealEngravingCenter);

// 4. Personalized Invitation Card (Positioned inside the envelope pocket)
const cardGroup = new THREE.Group();
cardGroup.name = 'Invitation_Card_Root';
cardGroup.position.set(0, 0.05, 0.005);
envelopeGroup.add(cardGroup);

const cardWidth = 3.1;
const cardHeight = 2.0;
const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, 0.015);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: COLOR_IVORY_PAPER,
  roughness: 0.65,
  metalness: 0.05,
  name: 'Ivory_Card_Mat',
});
const cardMesh = new THREE.Mesh(cardGeo, cardMaterial);
cardMesh.name = 'Invitation_Card';
cardGroup.add(cardMesh);

// Card Gold Border Filigree
const cardBorderShape = new THREE.Shape();
cardBorderShape.moveTo(-cardWidth * 0.48, -cardHeight * 0.48);
cardBorderShape.lineTo(cardWidth * 0.48, -cardHeight * 0.48);
cardBorderShape.lineTo(cardWidth * 0.48, cardHeight * 0.48);
cardBorderShape.lineTo(-cardWidth * 0.48, cardHeight * 0.48);
cardBorderShape.closePath();

const cardInnerHole = new THREE.Path();
cardInnerHole.moveTo(-cardWidth * 0.46, -cardHeight * 0.46);
cardInnerHole.lineTo(cardWidth * 0.46, -cardHeight * 0.46);
cardInnerHole.lineTo(cardWidth * 0.46, cardHeight * 0.46);
cardInnerHole.lineTo(-cardWidth * 0.46, cardHeight * 0.46);
cardInnerHole.closePath();
cardBorderShape.holes.push(cardInnerHole);

const cardBorderGeo = new THREE.ShapeGeometry(cardBorderShape);
const cardBorderMesh = new THREE.Mesh(cardBorderGeo, goldTrimMaterial);
cardBorderMesh.name = 'Card_Gold_Border';
cardBorderMesh.position.set(0, 0, 0.01);
cardGroup.add(cardBorderMesh);

// 5. Rose Petal Geometry
const petalShape = new THREE.Shape();
petalShape.moveTo(0, 0);
petalShape.bezierCurveTo(0.1, 0.15, 0.2, 0.35, 0.12, 0.5);
petalShape.bezierCurveTo(0.05, 0.6, -0.05, 0.6, -0.12, 0.5);
petalShape.bezierCurveTo(-0.2, 0.35, -0.1, 0.15, 0, 0);
const petalGeo = new THREE.ShapeGeometry(petalShape, 8);
const petalMat = new THREE.MeshStandardMaterial({
  color: 0x9e1b32,
  roughness: 0.5,
  metalness: 0.1,
  side: THREE.DoubleSide,
  name: 'Rose_Petal_Mat',
});
const petalMesh = new THREE.Mesh(petalGeo, petalMat);
petalMesh.name = 'Rose_Petal';
petalMesh.scale.set(0.6, 0.6, 0.6);
petalMesh.position.set(0, -3, 0);
scene.add(petalMesh);

// Export to binary GLB
const modelsDir = path.resolve('public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (gltf) => {
    const glbPath = path.join(modelsDir, 'luxury_envelope.glb');
    fs.writeFileSync(glbPath, Buffer.from(gltf));
    console.log('✓ Successfully generated luxury_envelope.glb at:', glbPath);
    console.log('File size:', (fs.statSync(glbPath).size / 1024).toFixed(2), 'KB');
  },
  (error) => {
    console.error('An error occurred while creating GLB:', error);
  },
  { binary: true }
);
