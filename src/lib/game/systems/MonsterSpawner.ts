// lib/game/systems/MonsterSpawner.ts
import * as THREE from 'three';
import { Monster } from '../entities/Monster';

export class MonsterSpawner {
  private scene: THREE.Scene;
  private monsters: Monster[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public spawnInitialMonsters() {
    // Spawn 5 monstres aléatoires
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 40; // Entre -20 et 20
      const z = (Math.random() - 0.5) * 40;
      const position = new THREE.Vector3(x, 0.75, z);
      
      const monster = new Monster(this.scene, position);
      this.monsters.push(monster);
    }
  }

  public update(playerPosition: THREE.Vector3) {
    this.monsters.forEach(monster => {
      monster.update(playerPosition);
    });
  }

  public checkCollisions(playerPosition: THREE.Vector3): Monster | null {
    for (const monster of this.monsters) {
      const distance = playerPosition.distanceTo(monster.getPosition());
      if (distance < 2) {
        return monster; // Collision détectée !
      }
    }
    return null;
  }

  public getMonsters(): Monster[] {
    return this.monsters;
  }

  public dispose() {
    this.monsters.forEach(monster => monster.dispose(this.scene));
    this.monsters = [];
  }
}