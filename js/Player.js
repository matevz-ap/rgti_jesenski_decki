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

        const up = vec3.set(vec3.create(), 
            7*player.velocity[0], 30, 7*player.velocity[2]);

        const down = vec3.set(vec3.create(), 0, player.gravity, 0);

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyT']) { //key for testing
            console.log(player.translation);
        }
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
            player.jump = 1;
            player.jumping = 20;
        }
        if (player.jumping > 0) {
            vec3.add(acc, acc, up);
            player.jumping -= 1;
        }

        // Gravity
        vec3.sub(acc, acc, down);
        
        // 2: update velocity
        vec3.scaleAndAdd(player.velocity, player.velocity, acc, dt * player.acceleration);
        
        //animation
        player.animation += dt;
        if(player.animation > 0.5) {
            if(acc[2] != 0 && player.jump == 0) {
                player.animation = 0;
                if(player.rotation[2] == 0.2) player.rotation[2] = -0.2;
                else player.rotation[2] = 0.2;
            }
            else player.rotation[2] = 0;
        }

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

        //checkpoint1
        if(player.translation[2] < -13 && player.translation[2] > -58 && player.checkpoint[2] != -15 && player.translation[1] > 0) {
            player.checkpoint[0] = 0;
            player.checkpoint[1] = 2;
            player.checkpoint[2] = -15;
        }
        //checkpoint2
        else if(player.translation[2] < -58 && player.checkpoint[2] != -60 && player.translation[1] > 0) {
            player.checkpoint[0] = 0;
            player.checkpoint[1] = 2;
            player.checkpoint[2] = -60;
        }
        //checkpoint3
        else if(player.translation[2] < -92 && player.checkpoint[2] != -94 && player.translation[1] > 0) {
            player.checkpoint[0] = 0;
            player.checkpoint[1] = 6;
            player.checkpoint[2] = -94;
        }
        //če umre
        if (player.translation[1] < player.checkpoint[1]-4) {
            player.translation[0] = player.checkpoint[0];
            player.translation[1] = player.checkpoint[1];
            player.translation[2] = player.checkpoint[2];
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
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 5,
    friction         : 0.2,
    acceleration     : 40,
    jump             : 0,
    jumping          : 0,
    checkpoint       : [0, 1, 0],
    animation        : 0,
    gravity          : 1.5
};
