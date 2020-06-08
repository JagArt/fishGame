import * as PIXI from "pixi.js"
import { Routes, slDirection, sbwDirection, sine_wave, linear, Directions } from "./utils/routes";
import { rotateToPoint } from "./utils/rotateToPointController";
import { CustomGraphics, CustomGraphicsGeometry, CustomGraphics2 } from "./utils/customgrafics";

export class FishSpine extends PIXI.spine.Spine {
    app: PIXI.Application;
    route: Routes
    direction?: Directions;
    speed: number;
    hp: number;
    currentPosition: number;
    hasHit: boolean;

    sideX: number;
    sideY: number;

    explosionTextures: PIXI.Texture[] = [];

    constructor(app: PIXI.Application, x: number = 0, y: number = 0, skeletonData: PIXI.spine.core.SkeletonData, name: string = "none", hp: number = 100, speed: number = 5, route: Routes, direction?: Directions) {
        super(skeletonData);
        this.app = app;
        this.width = 150;
        this.height = 150;
        this.route = route;
        this.direction = direction;
        this.name = name;
        this.hp = hp;
        this.speed = speed;
        this.currentPosition = 0;
        this.hasHit = false;
        this.sideX = x;
        this.sideY = y;
        this.position.x = x;
        this.position.y = y;
        if (x == 0) {
            this.position.x -= this.width;
        } else if (x >= app.screen.width) {
            this.position.x += this.width;
        }

        if (y == 0) {
            this.position.y -= this.height;
        } else if (y >= app.screen.height) {
            this.position.y += this.height;
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

        if (this.route == Routes.sin) {
            sine_wave(this);
        } else if (this.route == Routes.linear) {
            linear(this);
        }

        if (this.hasHit) {
            this.alpha = 0.5;
            this.hasHit = false;
        } else {
            this.alpha = 1;
        }

        if (this.hp <= 0) {
            this.visible = false;
        }
    }

    dead() {
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