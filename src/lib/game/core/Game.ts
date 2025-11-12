// lib/game/core/Game.ts
import * as THREE from 'three';
import { InputManager } from '../systems/Input';
import { Player } from '../entities/Player';
import { MonsterSpawner } from '../systems/MonsterSpawner';
import { useCombatStore } from '@/lib/store/combatStore';

export class Game {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;

  private inputManager: InputManager;
  private player: Player;
  private monsterSpawner: MonsterSpawner;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Setup lights
    this.setupLights();

    // Setup ground
    this.setupGround();

    // Setup systems
    this.inputManager = new InputManager();
    this.player = new Player(this.scene);
    this.monsterSpawner = new MonsterSpawner(this.scene);
    this.monsterSpawner.spawnInitialMonsters();

    // Handle resize
    window.addEventListener('resize', this.handleResize);
  }

  private setupLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 5);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 2048;
    directional.shadow.mapSize.height = 2048;
    directional.shadow.camera.near = 0.5;
    directional.shadow.camera.far = 50;
    this.scene.add(directional);
  }

  private setupGround(): void {
    const geometry = new THREE.PlaneGeometry(50, 50);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private handleResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  public start(): void {
    this.animate();
  }

  private animate = (): void => {
  this.animationFrameId = requestAnimationFrame(this.animate);

  const combatState = useCombatStore.getState();

  // DEBUG
  console.log('Combat state:', combatState.isInCombat);

  // Si en combat, ne pas permettre le déplacement
  if (!combatState.isInCombat) {
    this.player.update(this.inputManager);
  }

  const playerPos = this.player.getPosition();
  this.monsterSpawner.update(playerPos);

  // Check collisions SEULEMENT si pas déjà en combat
  if (!combatState.isInCombat) {
    const collidedMonster = this.monsterSpawner.checkCollisions(playerPos);
    if (collidedMonster) {
      console.log('🔥 COLLISION DÉTECTÉE !', collidedMonster);
      console.log('🎮 Démarrage du combat...');
      useCombatStore.getState().startCombat(collidedMonster);
      
      // DEBUG: Vérifier après démarrage
      const newState = useCombatStore.getState();
      console.log('📊 État après startCombat:', {
        isInCombat: newState.isInCombat,
        currentEnemy: newState.currentEnemy?.stats.name,
        playerTurn: newState.playerTurn,
      });
    }
  }

  // Camera follows player
  this.camera.position.x = playerPos.x;
  this.camera.position.y = 5;
  this.camera.position.z = playerPos.z + 10;

  const lookTarget = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z);
  this.camera.lookAt(lookTarget);

  this.renderer.render(this.scene, this.camera);
};

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
    this.inputManager.dispose();
    this.monsterSpawner.dispose();
  }
}