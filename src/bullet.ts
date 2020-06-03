import * as PIXI from "pixi.js"

export class Bullet extends PIXI.Sprite {
    speed: number;

    app: PIXI.Application;
    explosionTextures: PIXI.Texture[] = [];


    constructor(app: PIXI.Application, texture: PIXI.Texture, posX: number, posY: number, rotation: number, speed: number) {
        super(texture);
        this.app = app;
        this.width = 25;
        this.height = 25;
        this.anchor.set(.5, .5);
        this.position.x = posX;
        this.position.y = posY;
        this.rotation = rotation;
        this.speed = speed;

        for (var i = 0; i < 26; i++) {
            const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
            this.explosionTextures.push(texture);
        }
    }

    start() { }

    hit() {
        this.speed = 0;
        this.visible = false;

        let explosion = new PIXI.AnimatedSprite(this.explosionTextures);
        explosion.loop = false;
        explosion.scale.set(0.5, 0.5);
        explosion.anchor.set(.5, .5);
        explosion.position.copyFrom(this.position);
        explosion.gotoAndPlay(0);
        this.app.stage.addChild(explosion);
        explosion.onComplete = () => {
            this.app.stage.removeChild(explosion);
        }
    }
}