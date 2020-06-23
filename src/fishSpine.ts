import * as PIXI from "pixi.js"
import { Route, slDirection, sbwDirection, Directions, Routes } from "./utils/routes";
import { rotateToPoint } from "./utils/rotateToPointController";
import { CustomGraphics, CustomGraphicsGeometry, CustomGraphics2 } from "./utils/customgrafics";
import { Game } from "./app";

export class FishSpine extends PIXI.spine.Spine {
    game: Game;
    route: Route
    direction?: Directions;
    speed: number;
    hp: number;
    currentPosition: number;

    hasHit: boolean;
    isFreeze: boolean;

    sideX: number;
    sideY: number;

    snowflake: PIXI.Sprite;

    routes: Routes;

    constructor(game: Game, x: number = 0, y: number = 0, skeletonData: PIXI.spine.core.SkeletonData, name: string = "none", hp: number = 100, speed: number = 5, route: Route, direction?: Directions) {
        super(skeletonData);
        this.game = game;
        this.width = 150;
        this.height = 150;
        this.route = route;
        this.direction = direction;
        this.name = name;
        this.hp = hp;
        this.speed = speed;
        this.currentPosition = 0;
        this.hasHit = false;
        this.isFreeze = false;
        this.sideX = x;
        this.sideY = y;
        this.position.x = x;
        this.position.y = y;
        if (x == 0) {
            this.position.x -= this.width;
        } else if (x >= this.game.app.screen.width) {
            this.position.x += this.width;
        }

        if (y == 0) {
            this.position.y -= this.height;
        } else if (y >= this.game.app.screen.height) {
            this.position.y += this.height;
        }

        this.snowflake = new PIXI.Sprite(PIXI.Texture.from("snowflake"));
        this.snowflake.anchor.set(.5, .5);
        this.snowflake.width = this.width + 50;
        this.snowflake.height = this.height + 50;
        // let bezier = new CustomGraphics2();
        // bezier.lineStyle(5, 0xAA0000, 1);
        // bezier.bezierCurveTo(100, 500, 200, 500, 600, 0);
        // this.route = bezier.getPoints();


        // this.interactive = true;
        // this.buttonMode = true;
        // this.on("pointerdown", () => this.onClick());
        // console.log(this);

        this.routes = new Routes(this.position.x, this.position.x);

        this.game.app.ticker.add(delta => this.gameLoop(delta));
    }

    gameLoop(delta: PIXI.Ticker) {

        if (!this.isFreeze) {
            if (this.route == Route.sin) {
                this.routes.sine_wave(this);
            } else if (this.route == Route.linear) {
                this.routes.linear(this);
            }
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
        console.log(this.name + " is dead");
        let explosion = new PIXI.AnimatedSprite(this.game.explosionTextures);
        explosion.loop = false;
        explosion.scale.set(2, 2);
        explosion.anchor.set(.5, .5);
        explosion.position.copyFrom(this.position);
        explosion.gotoAndPlay(0);
        this.game.app.stage.addChild(explosion);
        explosion.onComplete = () => {
            this.game.app.stage.removeChild(explosion);
        }
    }

    status() {
        return this.name + " has " + this.hp + " hit points";
    }

    getBounds() {
        return super.getBounds();
    }

    hit(damage: number, callback: Function) {
        this.hasHit = true;
        this.hp -= damage;
        console.log(this.name + ": " + this.hp + ' hp left');
        if (this.hp <= 0) {
            this.dead();
            callback();
        }
    }

    // onClick() {
    //     console.log(this.route.length);
    // }

    freeze() {
        this.isFreeze = true;
        this.autoUpdate = false;

        this.snowflake.position.copyFrom(this.position);
        this.game.app.stage.addChild(this.snowflake);
    }

    unfreeze() {
        this.isFreeze = false;
        this.autoUpdate = true;

        this.game.app.stage.removeChild(this.snowflake);
    }
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