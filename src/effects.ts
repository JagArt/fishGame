import { Game } from "./app";

export enum Effect {
    freese,
    nuclear_bomb,
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
                }
            });
    }

    onClick(text: string) {
        console.log("Effect name: " + text);
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
        } else {
            console.log("bomb_disactivate");
            this.game.bombIsActivated = false;
        }
    }
}