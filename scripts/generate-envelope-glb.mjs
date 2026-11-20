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

// Luxury Color Palette
const COLOR_BURGUNDY = 0x3a0715;
const COLOR_MAROON = 0x580f25;
const COLOR_GOLD = 0xc5a15a;
const COLOR_IVORY = 0xf8f1e5;
const COLOR_GOLD_LIGHT = 0xe6d2a0;

// Root scene
const scene = new THREE.Scene();
scene.name = 'Luxury_Wedding_Invitation_Scene';

// 1. Envelope Body
// A refined pocket envelope with front folded flaps and interior pocket
const envelopeGroup = new THREE.Group();
envelopeGroup.name = 'Envelope_Root';
scene.add(envelopeGroup);

const bodyWidth = 3.6;
const bodyHeight = 2.4;
const bodyDepth = 0.08;

// Envelope Back Plate
const backGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, 0.02);
const envelopePaperMaterial = new THREE.MeshStandardMaterial({
  color: COLOR_BURGUNDY,
  roughness: 0.65,
  metalness: 0.1,
  name: 'Envelope_Paper_Mat',
});
const envelopeBack = new THREE.Mesh(backGeometry, envelopePaperMaterial);
envelopeBack.name = 'Envelope_Body';
envelopeBack.position.set(0, 0, -0.03);
envelopeGroup.add(envelopeBack);

// Envelope Pocket Front (Lower fold)
const pocketGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight * 0.55, 0.02);
const pocket = new THREE.Mesh(pocketGeometry, envelopePaperMaterial);
pocket.name = 'Envelope_Pocket';
pocket.position.set(0, -bodyHeight * 0.225, 0.03);
envelopeGroup.add(pocket);

// Left Fold triangle
const leftFoldShape = new THREE.Shape();
leftFoldShape.moveTo(0, 0);
leftFoldShape.lineTo(bodyWidth * 0.45, bodyHeight * 0.4);
leftFoldShape.lineTo(0, bodyHeight * 0.8);
leftFoldShape.closePath();
const leftFoldGeo = new THREE.ShapeGeometry(leftFoldShape);
const leftFold = new THREE.Mesh(leftFoldGeo, envelopePaperMaterial);
leftFold.position.set(-bodyWidth * 0.5, -bodyHeight * 0.5, 0.02);
envelopeGroup.add(leftFold);

// Right Fold triangle
const rightFoldShape = new THREE.Shape();
rightFoldShape.moveTo(0, 0);
rightFoldShape.lineTo(-bodyWidth * 0.45, bodyHeight * 0.4);
rightFoldShape.lineTo(0, bodyHeight * 0.8);
rightFoldShape.closePath();
const rightFoldGeo = new THREE.ShapeGeometry(rightFoldShape);
const rightFold = new THREE.Mesh(rightFoldGeo, envelopePaperMaterial);
rightFold.position.set(bodyWidth * 0.5, -bodyHeight * 0.5, 0.02);
envelopeGroup.add(rightFold);

// Gold edge trim on envelope
const goldTrimMaterial = new THREE.MeshStandardMaterial({
  color: COLOR_GOLD,
  metalness: 0.85,
  roughness: 0.25,
  name: 'Antique_Gold_Foil_Mat',
});

const trimTopGeo = new THREE.BoxGeometry(bodyWidth + 0.04, 0.015, 0.03);
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
  depth: 0.015,
  bevelEnabled: true,
  bevelSegments: 2,
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
flapTrimMesh.position.set(0, 0, 0.026);
flapPivot.add(flapTrimMesh);

// 3. Wax Seal
const waxSealGroup = new THREE.Group();
waxSealGroup.name = 'Wax_Seal';
waxSealGroup.position.set(0, -bodyHeight * 0.65, 0.035);
flapPivot.add(waxSealGroup);

const waxMaterial = new THREE.MeshStandardMaterial({
  color: COLOR_MAROON,
  roughness: 0.35,
  metalness: 0.15,
  name: 'Burgundy_Wax_Mat',
});

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
monogramMesh.position.z = 0.04;
waxSealGroup.add(monogramMesh);

// 4. Personalized Invitation Card
const cardGroup = new THREE.Group();
cardGroup.name = 'Invitation_Card_Root';
cardGroup.position.set(0, 0.05, 0.005);
envelopeGroup.add(cardGroup);

const cardWidth = 3.3;
const cardHeight = 2.2;
const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, 0.015);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: COLOR_IVORY,
  roughness: 0.7,
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

// 5. Rose Petal Sample Geometry for instancing / reference
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
petalMesh.position.set(0, -3, 0); // Positioned offstage for template reference
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
