import { Sprite, spine } from "pixi.js";
import { FishSprite } from "../fishSprite";
import { FishSpine } from "../fishSpine";
import { rotateToPoint } from "./rotateToPointController";

export enum Routes {
    Sl, Sbw, sin, linear
}

export enum Directions {
    fromRightToLeft,
    fromLeftToRight,
    downUp,
    topDown
}

function fishDirection(sprite: FishSpine): { dx: number, dy: number } {
    var x = 1,
        y = 1;
    if (sprite.sideX == 0 && sprite.sideY == 0) {
        return { dx: x, dy: y };
    } else if (sprite.sideX >= sprite.app.screen.width && sprite.sideY >= sprite.app.screen.height) {
        return { dx: -x, dy: -y };
    }

    if (sprite.sideX == 0) {
        y = sprite.direction == Directions.topDown ? 1 : -1;
        return { dx: x, dy: y };
    } else if (sprite.sideY == 0) {
        x = sprite.direction == Directions.fromRightToLeft ? -1 : 1;
        return { dx: x, dy: y };
    }

    if (sprite.sideX >= sprite.app.screen.width) {
        y = sprite.direction == Directions.topDown ? 1 : -1;
        return { dx: -x, dy: y };
    } else if (sprite.sideY >= sprite.app.screen.height) {
        x = sprite.direction == Directions.downUp ? -1 : -1;
        return { dx: x, dy: -y };
    }
    return { dx: x, dy: y };

}

export function sine_wave(sprite: FishSpine) {
    let prevPosition = { x: sprite.x, y: sprite.y };
    sprite.position.x += sprite.speed;
    sprite.position.y = sprite.app.screen.height / 2 + 100 * Math.sin(sprite.x / 100 + 100);
    sprite.rotation = rotateToPoint(sprite.x, sprite.y, prevPosition.x, prevPosition.y);
}

export function linear(sprite: FishSpine) {
    let prevPosition = { x: sprite.position.x, y: sprite.position.y };
    sprite.position.x += sprite.speed * fishDirection(sprite).dx;
    sprite.position.y += sprite.speed * fishDirection(sprite).dy;
    sprite.rotation = rotateToPoint(sprite.x, sprite.y, prevPosition.x, prevPosition.y);
}


export function slDirection() {
    // let horizontal = 0.5//getRandomInt(-1, 1)
    // let z = this.angle
    // z -= horizontal * this.rotSpeed
    // this.angle = z;
    // this.x += Math.cos(toRadians(z)) * this.speed
    // this.y += Math.sin(toRadians(z)) * this.speed
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

export function sbwDirection() {

}

export function makeStroke() {
    // if (this.strokeIsRight) {
    //     let z = this.angle + this.rotSpeed * 0.5
    //     this.strokeAngle++
    //     this.angle = z;
    //     this.x += Math.cos(toRadians(z)) * this.speed
    //     this.y += Math.sin(toRadians(z)) * this.speed
    //     if (this.strokeAngle >= this.strokeMaxAngle) {
    //         this.strokeIsRight = false;
    //     }
    // } else {
    //     let z = this.angle - this.rotSpeed * 0.5
    //     this.strokeAngle--
    //     this.angle = z;
    //     this.x += Math.cos(toRadians(z)) * this.speed
    //     this.y += Math.sin(toRadians(z)) * this.speed
    //     if (this.strokeAngle <= -this.strokeMaxAngle) {
    //         this.strokeIsRight = true;
    //     }
    // }
}



