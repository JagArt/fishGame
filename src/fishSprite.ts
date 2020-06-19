import * as PIXI from "pixi.js"
import { Route } from "./utils/routes";

export class FishSprite extends PIXI.Sprite {
    direction: Route
    speed: number;
    hp: number;

    area: number = 10
    rotSpeed: number = 10;

    strokeIsRight: boolean = true;
    strokeAngle: number = 0;
    strokeMaxAngle: number = 40;


    constructor(x: number = 0, y: number = 0, texture: PIXI.Texture, name: string = "none", hp: number = 100, speed: number = 5, direction: Route) {
        super(texture);
        this.direction = direction;
        this.anchor.set(0.5);
        this.name = name;
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    status() {
        return this.name + " has " + this.hp + " hit points";
    }

    go() {
        switch (this.direction) {
            case Route.Sl: {
                this.slDirection()
                break
            }
            case Route.Sbw: {
                this.sbwDirection()
                break
            }
        }
    }

    getBounds() {
        return super.getBounds();
    }

    slDirection() {
        let horizontal = 0.5//getRandomInt(-1, 1)
        let z = this.angle
        z -= horizontal * this.rotSpeed
        this.angle = z;
        this.x += Math.cos(toRadians(z)) * this.speed
        this.y += Math.sin(toRadians(z)) * this.speed
        // if (this.sprite.x > this.pointX) {
        //     this.pointX = this.sprite.x + (window.innerWidth / 10) + getRandomInt(-window.innerWidth / 10, 0)
        //     this.DirectionFactorY = getRandomInt(-1.5, 1.5)

        //     if (this.sprite.x * this.ratio > this.sprite.position.y && this.DirectionFactorY > 0)
        //     {
        //         console.log('DOWN')
        //         this.DirectionFactorY *= -1;
        //     }
        //     else if (this.sprite.x * this.ratio < this.sprite.position.y && this.DirectionFactorY < 0)
        //     {
        //         console.log('UP')
        //         this.DirectionFactorY *= -1
        //     }

        //     console.log('change direction')
        // }

        // console.log(this.DirectionFactorY)
        // this.sprite.x += 1 * this.speed;
        // this.sprite.y += (this.ratio - this.DirectionFactorY) * this.speed / 2;
    }

    sbwDirection() {

    }

    makeStroke() {
        if (this.strokeIsRight) {
            let z = this.angle + this.rotSpeed * 0.5
            this.strokeAngle++
            this.angle = z;
            this.x += Math.cos(toRadians(z)) * this.speed
            this.y += Math.sin(toRadians(z)) * this.speed
            if (this.strokeAngle >= this.strokeMaxAngle) {
                this.strokeIsRight = false;
            }
        } else {
            let z = this.angle - this.rotSpeed * 0.5
            this.strokeAngle--
            this.angle = z;
            this.x += Math.cos(toRadians(z)) * this.speed
            this.y += Math.sin(toRadians(z)) * this.speed
            if (this.strokeAngle <= -this.strokeMaxAngle) {
                this.strokeIsRight = true;
            }
        }
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