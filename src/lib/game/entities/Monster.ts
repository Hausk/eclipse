// lib/game/entities/Monster.ts
import * as THREE from "three";

export class Monster {
  public mesh: THREE.Mesh;
  public id: string;
  public stats: {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    level: number;
    attack: number;
    defense: number;
    speed: number;
    name: string;
  };

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.id = Math.random().toString(36);

    // Cube bleu pour l'instant
    const geometry = new THREE.BoxGeometry(1, 1.5, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    this.stats = {
      name: "Slime Corrompu",
      hp: 30,
      maxHp: 30,
      mp: 0,
      maxMp: 0,
      level: 1,
      attack: 5, // ⚔️ IMPORTANT : Définis l'attaque
      defense: 2, // 🛡️ IMPORTANT : Définis la défense
      speed: 80,
    };
  }

  public update(playerPosition: THREE.Vector3) {
    // Pour l'instant, statique
    // Plus tard : IA, déplacements, etc.
  }

  public getPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  public dispose(scene: THREE.Scene) {
    scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
