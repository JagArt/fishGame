export enum Direction {
    Sl, Sbw, sin
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

export function sine_wave() {

}

