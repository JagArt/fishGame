import { Game } from "./app";
import { Sprite, Texture } from "pixi.js";

export enum Effect {
    freese,
    nuclear_bomb,
    target,
    effectiv_gun,
    gun_upgrade,
    bullet_upgrade
}

export class Effects extends PIXI.Sprite {
    game: Game;

    constructor(game: Game, texture: PIXI.Texture, effect: Effect, name: string, width: number, height: number, tint: number, x: number, y: number) {
        super(texture);
        this.name = name;
        this.width = width;
        this.height = height;
        this.tint = tint;
        this.position.set(x, y);
        this.interactive = true;
        this.buttonMode = true;
        this.game = game;
        this
            .on("pointerover", () => { this.game.mouseOnEffects = true })
            .on("pointerout", () => { this.game.mouseOnEffects = false })
            .on("pointerdown", () => {
                this.onClick(this.name);
                switch (effect) {
                    case Effect.freese:
                        this.freese();
                        break;
                    case Effect.nuclear_bomb:
                        this.nuclear_bomb()
                        break;
                    case Effect.target:
                        this.fish_target()
                        break;
                    case Effect.effectiv_gun:
                        this.effectivGun()
                        break;
                    case Effect.gun_upgrade:
                        this.gunUpgrade()
                        break;
                    case Effect.bullet_upgrade:
                        this.bulletUpgrade()
                        break;

                }
            });

        this.game.app.ticker.add(() => this.gameLoop());
    }

    onClick(text: string) {
        console.log("Effect name: " + text);
    }

    bulletUpgrade() {
        this.game.players[0].bulletLevelUp();
    }

    gunUpgrade() {
        this.game.players[0].gunLevelUp();
    }

    private freese() {
        if (this.game.players[0].credits >= 10000) {
            this.game.dragons.forEach(dragon => {
                if (!dragon.isFreeze) {
                    this.game.players[0].credits -= 10000;
                    dragon.freeze();
                    setTimeout(() => {
                        this.game.dragons.forEach(dragon => {
                            dragon.unfreeze();
                        });
                    }, 2000);
                }
            });
        }
    }

    private nuclear_bomb() {
        this.game.bombIsActivated = !this.game.bombIsActivated;
        if (this.game.bombIsActivated) {
            console.log("bomb_activate");
            this.game.bombIsActivated = true;
            this.game.bomb!.visible = true;
        } else {
            console.log("bomb_disactivate");
            this.game.bombIsActivated = false;
            this.game.bomb!.visible = false;
        }
    }

    private fish_target() {
        this.game.targetEffectIsActivated = !this.game.targetEffectIsActivated;
        if (this.game.targetEffectIsActivated) {
            this.game.targetEffectIsActivated = true;
            this.game.targetImage!.visible = true;
        } else {
            this.game.targetEffectIsActivated = false;
            this.game.targetImage!.visible = false;
        }
    }

    private effectivGun() {
        this.game.players[0].shotSpeed = 100;
        setTimeout(() => {
            this.game.players[0].shotSpeed = 500;
        }, 3000);
    }

    private gameLoop() {
        this.game.bomb?.position.set(this.game.mousePosition.x, this.game.mousePosition.y);
        this.game.targetImage?.position.set(this.game.mousePosition.x, this.game.mousePosition.y);
    }
}