import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export default class Player extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);

        this.projection = mat4.create();
        this.updateProjection();

        this.mesh = mesh;
        this.image = image;

        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    update(dt) {
        const player = this;
        const forward = vec3.set(vec3.create(),
              -Math.sin(player.rotation[1]), 0, -Math.cos(player.rotation[1]));

        const right = vec3.set(vec3.create(),
            Math.cos(player.rotation[1]), 0, -Math.sin(player.rotation[1]));

        const up = vec3.set(vec3.create(), 0, 30, 0);

        const down = vec3.set(vec3.create(), 0, 0.98, 0);

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
          vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
          vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
          vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
          vec3.sub(acc, acc, right);
        }
        if (this.keys['Space'] && player.jump == 0) {
            this.keys['Space'] = false;
            player.jump = 90;
        }
        if (player.jump > 70) {
            vec3.add(acc, acc, up);
            player.jump -= 1;
        }
        else if (player.jump > 0) player.jump -= 1;

        // Gravity
        vec3.sub(acc, acc, down);
        
        // 2: update velocity
        vec3.scaleAndAdd(player.velocity, player.velocity, acc, dt * player.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            vec3.scale(player.velocity, player.velocity, 1 - player.friction);
        }

        // 4: limit speed
        const len = vec3.len(player.velocity);
        if (len > player.maxSpeed) {
            vec3.scale(player.velocity, player.velocity, player.maxSpeed / len);
        }
    }

    enable() {
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    disable() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }
}

Player.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 4,
    friction         : 0.2,
    acceleration     : 30,
    jump             : 0
};
