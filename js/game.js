import Application from '../common/Application.js';

import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import Player from './Player.js';
import Obstacle from './Obstacle.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';

var audio = document.getElementById("player");
audio.volume = 0;

class App extends Application {

    start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('js/scene.json');
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene('js/scene.json');
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

        this.obstacle1 = null;
        this.obstacle2 = null;
        this.obstacle3 = null;
        this.obstacle4 = null;
        this.obstacle5 = null;
        this.obstacle6 = null;
        this.obstacle7 = null;
        this.obstacle8 = null;
        this.obstacle9 = null;
        this.obstacle10 = null;
        this.obstacle11 = null;
        this.obstacle12 = null;
        this.obstacle13 = null;
        this.obstacle14 = null;
        this.obstacle15 = null;
        this.obstacle16 = null;
        this.obstacle17 = null;
        this.obstacle18 = null;
        this.obstacle19 = null;
        this.obstacle20 = null;
        this.obstacle21 = null;
        this.obstacle22 = null;
        this.obstacle23 = null;
        this.scene.traverse(node => {
            if(node instanceof Obstacle && node.name != "static") {
                if (this.obstacle1 == null) this.obstacle1 = node;
                else if(this.obstacle2 == null) this.obstacle2 = node;
                else if(this.obstacle3 == null) this.obstacle3 = node;
                else if(this.obstacle4 == null) this.obstacle4 = node;
                else if(this.obstacle5 == null) this.obstacle5 = node;
                else if(this.obstacle6 == null) this.obstacle6 = node;
                else if(this.obstacle7 == null) this.obstacle7 = node;
                else if(this.obstacle8 == null) this.obstacle8 = node;
                else if(this.obstacle9 == null )this.obstacle9 = node;
                else if(this.obstacle10 == null )this.obstacle10 = node;   
                else if(this.obstacle11 == null )this.obstacle11 = node;   
                else if(this.obstacle12 == null )this.obstacle12 = node;   
                else if(this.obstacle13 == null )this.obstacle13 = node;   
                else if(this.obstacle14 == null )this.obstacle14 = node; 
                else if(this.obstacle15 == null )this.obstacle15 = node;
                else if(this.obstacle16 == null )this.obstacle16 = node;
                else if(this.obstacle17 == null )this.obstacle17 = node;
                else if(this.obstacle18 == null )this.obstacle18 = node; 
                else if(this.obstacle19 == null )this.obstacle19 = node;
                else if(this.obstacle20 == null )this.obstacle20 = node;   
                else if(this.obstacle21 == null )this.obstacle21 = node;  
                else if(this.obstacle22 == null )this.obstacle22 = node;  
                else if(this.obstacle23 == null )this.obstacle23 = node;           
            }                  
        });

        this.camera.aspect = this.aspect;
        this.camera.updateProjection();

        this.renderer.prepare(this.scene);
    }

    enableCamera() {
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

        if (this.obstacle9) {
            this.obstacle1.update(dt);
            this.obstacle2.update(dt);
            this.obstacle3.update(dt);
            this.obstacle4.update(dt);
            this.obstacle5.update(dt);
            this.obstacle6.update(dt);
            this.obstacle7.update(dt);
            this.obstacle8.update(dt);
            this.obstacle9.update(dt);
            this.obstacle10.update(dt);
            this.obstacle11.update(dt);
            this.obstacle12.update(dt);
            this.obstacle13.update(dt);
            this.obstacle14.update(dt);
            this.obstacle15.update(dt);
            this.obstacle16.update(dt);
            this.obstacle17.update(dt);
            this.obstacle18.update(dt);
            this.obstacle19.update(dt);
            this.obstacle20.update(dt);
            this.obstacle21.update(dt);
            this.obstacle22.update(dt);
            this.obstacle23.update(dt);
           
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
    gui.add(app, 'enableCamera');
});
