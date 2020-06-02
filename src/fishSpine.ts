import * as PIXI from "pixi.js"
import { Direction, slDirection, sbwDirection } from "./utils/direction";
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

    constructor(app: PIXI.Application, x: number = 0, y: number = 0, skeletonData: PIXI.spine.core.SkeletonData, name: string = "none", hp: number = 100, speed: number = 5, direction: Direction) {
        super(skeletonData);
        this.app = app;
        this.width = 200;
        this.height = 200;
        this.direction = direction;
        this.name = name;
        this.hp = hp;
        this.position.x = - this.width;
        this.position.y = y;
        this.speed = speed;
        this.currentPosition = 0;
        this.hasHit = false;
        // let bezier = new CustomGraphics2();
        // bezier.lineStyle(5, 0xAA0000, 1);
        // bezier.bezierCurveTo(100, 500, 200, 500, 600, 0);
        // this.route = bezier.getPoints();


        // this.interactive = true;
        // this.buttonMode = true;
        // this.on("pointerdown", () => this.onClick());

        app.ticker.add(delta => this.gameLoop(delta));
    }

    gameLoop(delta: PIXI.Ticker) {
        let prevPosition = { x: this.x, y: this.y };

        this.position.x += this.speed;
        this.position.y = this.app.screen.height / 2 + 100 * Math.sin(this.x / 100 + 100);

        // this.position.x = this.route[this.currentPosition++];
        // this.position.y = this.route[this.currentPosition++];

        this.rotation = rotateToPoint(this.x, this.y, prevPosition.x, prevPosition.y);

        if (this.hasHit) {
            this.alpha = 0.5;
            this.hasHit = false;
        } else {
            this.alpha = 1;
        }

        if (this.hp == 0) {
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