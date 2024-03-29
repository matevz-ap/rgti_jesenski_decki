import Application from '../common/Application.js';

import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import Player from './Player.js';
import Obstacle from './Obstacle.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';

class App extends Application {

    start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('js/scene2.json');
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene('js/scene2.json');
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        this.physics = new Physics(this.scene);
        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }
        });

        // Find first player.
        this.player = null;
        this.scene.traverse(node => {
            if (node instanceof Player) {
                this.player = node;
            }
        });

        this.obstacles = [];
        this.scene.traverse(node => {
            if(node instanceof Obstacle && node.name != "static") {
                this.obstacles.push(node);           
            }                  
        });

        this.camera.aspect = this.aspect;
        this.camera.updateProjection();

        this.renderer.prepare(this.scene);
    }

    enableControls() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
            this.player.enable();
        } else {
            this.camera.disable();
            this.player.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.player) {
            this.player.update(dt);
        }

        if (this.camera) {
            this.camera.update(dt, this.player);
        }

        if (this.obstacles && this.player) {
            //optimizacija
            this.obstacles.forEach(obstacle => {
                obstacle.update(dt);
            });
        }
    
        if (this.physics) {
            this.physics.update(dt);
        }

    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera, this.player, 
            this.obstacle1, this.obsticle2);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new dat.GUI();
    gui.add(app, 'enableControls');
});
