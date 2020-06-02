import * as PIXI from "pixi.js"

export class Bullet extends PIXI.Sprite {
    speed: number;

    constructor(texture: PIXI.Texture, posX: number, posY: number, rotation: number, speed: number) {
        super(texture);
        this.width = 25;
        this.height = 25;
        this.anchor.set(.5, .5);
        this.position.x = posX;
        this.position.y = posY;
        this.rotation = rotation;
        this.speed = speed;
    }

    start() { }

    hit() {
        this.speed = 0;
        this.visible = false;
    }
}