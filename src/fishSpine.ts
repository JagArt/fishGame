import * as PIXI from "pixi.js"
import { Direction, slDirection, sbwDirection, sine_wave, linear } from "./utils/direction";
import { rotateToPoint } from "./utils/rotateToPointController";
import { CustomGraphics, CustomGraphicsGeometry, CustomGraphics2 } from "./utils/customgrafics";

export class FishSpine extends PIXI.spine.Spine {
    app: PIXI.Application;
    direction: Direction
    speed: number;
    hp: number;
    route: number[] = [];
    currentPosition: number;
    hasHit: boolean;

    explosionTextures: PIXI.Texture[] = [];

    constructor(app: PIXI.Application, x: number = 0, y: number = 0, skeletonData: PIXI.spine.core.SkeletonData, name: string = "none", hp: number = 100, speed: number = 5, direction: Direction) {
        super(skeletonData);
        this.app = app;
        this.width = 200;
        this.height = 200;
        this.direction = direction;
        this.name = name;
        this.hp = hp;
        this.speed = speed;
        this.currentPosition = 0;
        this.hasHit = false;

        if (x == 0) {
            this.position.x = - this.width;
            this.position.y = y;
        } else if (y == 0) {
            this.position.x = x;
            this.position.y = - this.height;
        }


        for (var i = 0; i < 26; i++) {
            const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
            this.explosionTextures.push(texture);
        }
        // let bezier = new CustomGraphics2();
        // bezier.lineStyle(5, 0xAA0000, 1);
        // bezier.bezierCurveTo(100, 500, 200, 500, 600, 0);
        // this.route = bezier.getPoints();


        // this.interactive = true;
        // this.buttonMode = true;
        // this.on("pointerdown", () => this.onClick());
        // console.log(this);
        app.ticker.add(delta => this.gameLoop(delta));
    }

    gameLoop(delta: PIXI.Ticker) {

        if (this.direction == Direction.sin) {
            sine_wave(this);
        } else if (this.direction == Direction.lin) {
            linear(this);
        }

        if (this.hasHit) {
            this.alpha = 0.5;
            this.hasHit = false;
        } else {
            this.alpha = 1;
        }

        if (this.hp <= 0) {
            let explosion = new PIXI.AnimatedSprite(this.explosionTextures);
            explosion.loop = false;
            explosion.scale.set(2, 2);
            explosion.anchor.set(.5, .5);
            explosion.position.copyFrom(this.position);
            explosion.gotoAndPlay(0);
            this.app.stage.addChild(explosion);
            explosion.onComplete = () => {
                this.app.stage.removeChild(explosion);
            }

            this.hp = 100;
            this.position.x = - this.width;
            this.position.y = this.app.screen.height / 2 + 300;
        }
    }

    status() {
        return this.name + " has " + this.hp + " hit points";
    }

    getBounds() {
        return super.getBounds();
    }

    hit() {
        this.hasHit = true;
        console.log(this.name + ": " + this.hp + ' hp left');
    }

    // onClick() {
    //     console.log(this.route.length);
    // }
}


function getRandomInt(min: number, max: number): number {
    return +(Math.random() * (max - min) + min).toFixed(4);
}

function toDegrees(angle: number) {
    return angle * (180 / Math.PI);
}

function toRadians(angle: number) {
    return angle * (Math.PI / 180);
}