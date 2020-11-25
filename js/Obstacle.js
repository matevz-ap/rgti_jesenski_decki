import Node from './Node.js';
import Utils from './Utils.js';

const vec3 = glMatrix.vec3;
const mat4 = glMatrix.mat4;
const mat3 = glMatrix.mat3;

export default class Obstacle extends Node {
    
    constructor(mesh, image, options) {
        super(options);

        Utils.init(this, this.constructor.defaults, options);

        this.mesh = mesh;
        this.image = image;
    }

    update(dt) {
    
        var o = this; //obstacle
        if(o.name == "left2right"){
            let acc = vec3.create();

            if(o.translation[0] - o.startX > 2) o.smer = -0.3;
            if(o.translation[0] - o.startX < -2) o.smer = 0.3;
    
            const smer = vec3.set(vec3.create(), o.smer, 0, 0);
            vec3.add(acc, acc, smer);
    
            vec3.scaleAndAdd(o.velocity, o.velocity, acc, dt * o.acceleration);
    
            const len = vec3.len(o.velocity);
                if (len > o.maxSpeed) {
                    vec3.scale(o.velocity, o.velocity, o.maxSpeed / len);
                }
        }
        else if(o.name == "crown"){
            let acc = vec3.create();

            if(o.translation[1] - o.startX > 2) o.smer = -0.3;
            if(o.translation[1] - o.startX < -2) o.smer = 0.3;
    
            const smer = vec3.set(vec3.create(), 0, o.smer, 0);
            vec3.add(acc, acc, smer);
    
            vec3.scaleAndAdd(o.velocity, o.velocity, acc, dt * o.acceleration);
    
            const len = vec3.len(o.velocity);
                if (len > o.maxSpeed) {
                    vec3.scale(o.velocity, o.velocity, o.maxSpeed / len);
                }
        }
       
      
    }

}

Obstacle.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 5,
    friction         : 0.2,
    acceleration     : 20,
    smer             : 0.1,
    bounce           : false,
    static           : false,
    death            : false,
    name             : "default",
    startX           : 0,
    loaded           : false
};