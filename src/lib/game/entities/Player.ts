// lib/game/entities/Player.ts
import * as THREE from 'three';
import { InputManager } from '../systems/Input';

export class Player {
  private mesh: THREE.Mesh;
  private moveSpeed: number = 0.1;

  constructor(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 1, 0);
    this.mesh.castShadow = true;
    scene.add(this.mesh);
  }

  public update(input: InputManager): void {
    const movement = new THREE.Vector3(0, 0, 0);

    if (input.isKeyPressed('z')) {
      movement.z -= 1;
    }
    if (input.isKeyPressed('s')) {
      movement.z += 1;
    }
    if (input.isKeyPressed('q')) {
      movement.x -= 1;
    }
    if (input.isKeyPressed('d')) {
      movement.x += 1;
    }

    // Si mouvement, normaliser et appliquer
    if (movement.length() > 0) {
      movement.normalize();
      this.mesh.position.x += movement.x * this.moveSpeed;
      this.mesh.position.z += movement.z * this.moveSpeed;

      // Orient player towards movement
      const angle = Math.atan2(movement.x, movement.z);
      this.mesh.rotation.y = angle;
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}