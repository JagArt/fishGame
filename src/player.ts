import * as PIXI from "pixi.js"
import { rotateToPoint } from "./utils/rotateToPointController";
import { Bullet } from "./bullet";
import sound from 'pixi-sound'
import { FishSpine } from "./fishSpine";
import { rectsIntersect, mouseCollapse } from "./utils/collapsController";
import { Game } from "./app";

export class Player extends PIXI.Container {
    game: Game;
    bulletTex: PIXI.Texture;

    credits: number;
    gems: number;

    gunLevel: number;
    bulletLevel: number;

    bullets: Bullet[] = [];

    damage: number;

    isShoot: boolean = false;
    shotSpeed: number;

    sprite: PIXI.Sprite;

    scoreContainer: PIXI.Container;
    screenPosition: number;

    creditsText: PIXI.Text;
    gemsText: PIXI.Text;
    shootSound: sound.Sound = sound.Sound.from('sounds/Shotgun+2.mp3');

    constructor(game: Game, name: string = "none", screenPosition: number, credits: number, gems: number) {
        super();
        this.game = game;

        this.credits = credits;
        this.gems = gems;

        this.creditsText = new PIXI.Text(credits.toString());
        this.gemsText = new PIXI.Text(gems.toString());

        this.gunLevel = 1;
        this.bulletLevel = 1;

        this.bulletTex = PIXI.Texture.from("bullet0");
        this.damage = 20;
        this.shotSpeed = 500;

        this.shootSound.volume = 0.01;

        this.sprite = new PIXI.Sprite(PIXI.Texture.from("gun_vip0"));
        this.sprite.anchor.set(0.5);
        this.sprite.name = name;
        this.sprite.width = 150;
        this.sprite.height = 150;

        this.screenPosition = screenPosition;

        this.scoreContainer = this.getScoreContainer();

        if (screenPosition == 1) {
            this.sprite.position.set(this.scoreContainer.position.x + this.scoreContainer.width + this.sprite.width / 2 + 15, this.scoreContainer.height / 2 + this.scoreContainer.position.y);
        } else if (screenPosition == 2) {
            this.sprite.position.set(this.scoreContainer.position.x - this.sprite.width / 2 - 15, this.scoreContainer.height / 2 + this.scoreContainer.position.y);
        } else if (screenPosition == 3) {
            this.sprite.position.set(this.scoreContainer.position.x + this.scoreContainer.width + this.sprite.width / 2 + 15, this.scoreContainer.height / 2 + this.scoreContainer.position.y);
        } else {
            this.sprite.position.set(this.scoreContainer.position.x - this.sprite.width / 2 - 15, this.scoreContainer.height / 2 + this.scoreContainer.position.y);
        }

        this.addChild(this.sprite);

        this.addChild(this.scoreContainer);

        this.game.app.ticker.add(delta => this.gameLoop(delta));
    }

    gameLoop(delta: PIXI.Ticker) {

        if (this.game.targetedObject != undefined) {
            this.sprite.rotation = rotateToPoint(this.game.targetedObject.position.x, this.game.targetedObject.position.y, this.sprite.position.x, this.sprite.position.y);
        } else {
            this.sprite.rotation = rotateToPoint(this.game.mousePosition.x, this.game.mousePosition.y, this.sprite.position.x, this.sprite.position.y);
        }

        for (var b = this.bullets.length - 1; b >= 0; b--) {
            this.bullets[b].position.x += Math.cos(this.bullets[b].rotation) * this.bullets[b].speed;
            this.bullets[b].position.y += Math.sin(this.bullets[b].rotation) * this.bullets[b].speed;

            if (this.isOutside(this.bullets[b])) {
                this.bullets.splice(this.bullets.indexOf(this.bullets[b]), 1);
            }
        }

        if (!this.game.mouseOnEffects && !this.game.bombIsActivated && this.game.mouseIsDown) {
            this.shoot();
        }
        // this.scoreContainer = this.getScoreContainer();
        this.creditsText.text = this.credits.toString();
        this.gemsText.text = this.gems.toString();

    }

    shoot() {
        if (!this.isShoot) {
            this.shootSound.play();
            let bullet = new Bullet(this.game.app, this.bulletTex, this.sprite.position.x + Math.cos(this.sprite.rotation) * 75, this.sprite.position.y + Math.sin(this.sprite.rotation) * 75, this.sprite.rotation, 10);
            this.game.app.stage.addChild(bullet);
            this.credits -= this.damage;
            this.bullets.push(bullet);
            this.isShoot = true;
            setTimeout(() => {
                this.isShoot = false;
            }, this.shotSpeed);
        }
    }

    // getPosition(pos: number): PIXI.Point {
    //     if (pos == 1) {
    //         // return new PIXI.Point(this.app.screen.width / 6, 70);
    //         return new PIXI.Point(0, 0);
    //     } else if (pos == 2) {
    //         return new PIXI.Point(this.app.screen.width, 0);
    //     } else if (pos == 3) {
    //         return new PIXI.Point(0, this.app.screen.height);
    //     } else
    //         return new PIXI.Point(this.app.screen.width / 6 * 5, this.app.screen.height - 70);
    // };

    isOutside(bullet: PIXI.Sprite): boolean {
        return bullet.position.x > this.game.app.screen.width + bullet.width / 2 ||
            bullet.position.x < - bullet.width / 2 ||
            bullet.position.y > this.game.app.screen.height + bullet.height / 2 ||
            bullet.position.y < -bullet.height / 2;
    }

    getBounds() {
        return super.getBounds();
    }

    status() {
        return "Name is: " + this.name;
    }

    checkCollapse(fish: FishSpine) {
        this.bullets.forEach(bullet => {
            if (rectsIntersect(fish, bullet)) {
                console.log('hit');
                bullet.hit();
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
                fish.hit(this.damage, () => {
                    this.credits += 1000;
                    this.game.dragons.splice(this.game.dragons.indexOf(fish), 1);
                });
            };
        });
    }

    getScoreContainer(): PIXI.Container {
        let score = new PIXI.Container();

        let bg = PIXI.Sprite.from(PIXI.Texture.WHITE);
        bg.width = 150;
        bg.height = 100;
        bg.tint = 0xFFDAB9;

        // let creditIcon = PIXI.Sprite.from(PIXI.Texture.WHITE);
        // creditIcon.position.set(15, 15);
        // creditIcon.width = 25;
        // creditIcon.height = 25;
        // creditIcon.tint = 0xFFFF00;
        let creditIcon = new PIXI.Graphics();
        creditIcon.beginFill(0xFFFF00);
        creditIcon.drawCircle(15, 15, 15);
        creditIcon.endFill;
        creditIcon.x = 15;
        creditIcon.y = 15;

        this.creditsText.position.set(creditIcon.position.x + creditIcon.width + 10, creditIcon.y);

        // let gemsIcon = PIXI.Sprite.from(PIXI.Texture.WHITE);
        // gemsIcon.position.set(15, creditIcon.position.y + creditIcon.height + 10);
        // gemsIcon.width = 25;
        // gemsIcon.height = 25;
        // gemsIcon.tint = 0xFF0000;
        let gemsIcon = new PIXI.Graphics();
        gemsIcon.beginFill(0xFF0000);
        gemsIcon.moveTo(5, 0);
        gemsIcon.lineTo(0, 5);
        gemsIcon.lineTo(12.5, 25);
        gemsIcon.lineTo(25, 5);
        gemsIcon.lineTo(20, 0);
        gemsIcon.lineTo(5, 0);
        gemsIcon.endFill();
        gemsIcon.position.set(15, creditIcon.position.y + creditIcon.height + 10);

        this.gemsText.position.set(gemsIcon.position.x + gemsIcon.width + 10, gemsIcon.y);

        score.addChild(
            bg,
            creditIcon,
            this.creditsText,
            gemsIcon,
            this.gemsText
        );

        if (this.screenPosition == 1) {
            score.position.set(15, 15);
        } else if (this.screenPosition == 2) {
            score.position.set(this.game.app.screen.width - score.width - 15, 15);
        } else if (this.screenPosition == 3) {
            score.position.set(15, this.game.app.screen.height - score.height - 15);
        } else {
            score.position.set(this.game.app.screen.width - score.width - 15, this.game.app.screen.height - score.height - 15);
        }
        return score;
    }

    gunLevelUp() {
        this.gunLevel += 1;
        if (this.gunLevel == 10) this.gunLevel = 0;
        this.sprite.texture = PIXI.Texture.from("gun_vip" + this.gunLevel);
        this.bulletTex = PIXI.Texture.from("bullet" + this.gunLevel);
        console.log('gunLevel: ' + this.gunLevel);
    }

    bulletLevelUp() {
        this.bulletLevel += 1;
        console.log('bulletLevel: ' + this.bulletLevel);
    }
}