import * as PIXI from "pixi.js"
window.PIXI = PIXI;
import "pixi-spine";
import { Timer, TimerManager } from "eventemitter3-timer";

import { FishSprite } from "./fishSprite";
import { Player } from "./player";
import { Routes, Directions } from "./utils/routes";
import { FishSpine } from "./fishSpine";
import { Effects } from "./effects";

export class Game {

    screenSize = { width: 1280, height: 720 };
    private app: PIXI.Application;

    gameScene: PIXI.Container;
    updatePanel: PIXI.Container;
    effectsPanel: PIXI.Container;
    visible: boolean;

    players: Player[] = [];
    dragons: FishSpine[] = [];

    mouseOnEffects: boolean = false;

    // const bezier = new CustomGraphics(new CustomGraphicsGeometry());

    constructor() {
        this.app = new PIXI.Application(
            {
                // width: window.innerWidth,
                // height: window.innerHeight,
                width: this.screenSize.width,
                height: this.screenSize.height,
                backgroundColor: 0xAAAAAA
            }
        );

        document.body.appendChild(this.app.view)

        this.visible = true;

        this.gameScene = new PIXI.Container();
        this.updatePanel = new PIXI.Container();
        this.effectsPanel = new PIXI.Container();

        PIXI.Loader.shared
            .add("bg", "images/bg/AnglerKingdom-background1.jpg")
            .add("player", "images/player.png")
            .add("cursor", "images/cursor.png")
            .add("gun_vip0", "images/guns_png/gun_vip0.png")
            .add("gun_vip1", "images/guns_png/gun_vip1.png")
            .add("gun_vip2", "images/guns_png/gun_vip2.png")
            .add("gun_vip3", "images/guns_png/gun_vip3.png")
            .add("gun_vip4", "images/guns_png/gun_vip4.png")
            .add("gun_vip5", "images/guns_png/gun_vip5.png")
            .add("gun_vip6", "images/guns_png/gun_vip6.png")
            .add("gun_vip7", "images/guns_png/gun_vip7.png")
            .add("gun_vip8", "images/guns_png/gun_vip8.png")
            .add("gun_vip9", "images/guns_png/gun_vip9.png")
            .add("bullet", "images/bullets/0_bullet.png")
            .add("explosion", "images/effects/spritesheets/mc.json")
            .add("snowflake", "images/effects/snowflake.png")
            .add("nuclear_bomb", "images/effects/nuclear_bomb.png")
            .add("dragon", "images/dragon/export/dragon-ess.json")
            .on("progress", this.onLoadProgress.bind(this))
            .once("complete", this.onLoadComplete.bind(this))
            .once("error", (e) => this.handleLoadError.bind(this, e));

        PIXI.Loader.shared.load();
    }

    private handleLoadError(e: Error) {
        console.error("load error: " + e);
    }

    private onLoadProgress() {
        console.log(PIXI.Loader.shared.progress + " % loaded");

        var progress = 500 * PIXI.Loader.shared.progress / 100;

        let loadScreen = new PIXI.Container();

        let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        bg.tint = 0x000000;
        bg.width = this.screenSize.width;
        bg.height = this.screenSize.height;

        let loadProgressBar = new PIXI.Container();
        // loadProgressBar.position.set(screenSize.width / 2, screenSize.height / 2);

        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0xFF0000);
        innerBar.drawRect(loadProgressBar.position.x, loadProgressBar.position.y, 500, 20);
        innerBar.endFill();

        let outerBar = new PIXI.Graphics();
        innerBar.beginFill(0x00FF00);
        innerBar.drawRect(loadProgressBar.position.x, loadProgressBar.position.y, progress, 20);
        innerBar.endFill();


        loadScreen.addChild(
            bg,
            loadProgressBar,
            innerBar,
            outerBar
        );
        this.app.stage.addChild(loadScreen);
    }

    private onLoadComplete() {
        // var animation = new PIXI.spine.Spine(resources.spineCharacter.spineData)
        this.app.stage.removeChildren(0);

        console.log(this.app);

        // const defaultIcon = "url('https://flyclipart.com/thumb2/game-play-cursor-pointer-shooter-png-icon-free-download-167975.png'),auto";

        // app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;

        let bg = new PIXI.Sprite(PIXI.Texture.from("bg"));
        bg.width = this.screenSize.width;
        bg.height = this.screenSize.height
        bg.name = "background";

        this.players.push(new Player(this.app, "test player1", 1, 99999, 100));
        // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player2", 2, app.loader.resources.bullet.texture, 99999, 100, 5));
        // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player3", 3, app.loader.resources.bullet.texture, 99999, 100, 5));
        // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player4", 4, app.loader.resources.bullet.texture, 99999, 100, 5));

        this.app.stage
            .on("mousedown", () => {
                if (!this.mouseOnEffects) {
                    this.players.forEach(player => {
                        player.shoot();
                    });
                }
            });




        this.dragons.push(new FishSpine(this.app, 0, 0, PIXI.Loader.shared.resources.dragon.spineData, "Dragon1[0,0] sin", 100, 1, Routes.sin));
        this.dragons.push(new FishSpine(this.app, 0, 0, PIXI.Loader.shared.resources.dragon.spineData, "Dragon2[0,0]", 100, 1, Routes.linear));
        // // dragons.push(new FishSpine(app, screenSize.width, screenSize.height, app.loader.resources.dragon.spineData, "Dragon[>, >]", 100, 1, Routes.linear, Directions.fromLeftToRight));
        // // dragons.push(new FishSpine(app, 500, 0, app.loader.resources.dragon.spineData, "Dragon[500, 0]", 100, 1, Routes.linear, Directions.fromLeftToRight));
        // // dragons.push(new FishSpine(app, screenSize.width, 200, app.loader.resources.dragon.spineData, "Dragon[>, 200]", 100, 1, Routes.linear, Directions.fromLeftToRight));


        this.gameScene.addChild(
            bg,
        );

        this.players.forEach(player => {
            this.gameScene.addChild(player);
        });

        this.dragons.forEach(dragon => {
            this.gameScene.addChild(dragon);
        });


        // update panel 
        let updateSquare1 = new Effects(PIXI.Texture.WHITE, "gun upgrade", 50, 50, 0x000000, 0, 0);
        updateSquare1
            .on("pointerdown", () => { })
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });

        let updateSquare2 = new Effects(PIXI.Texture.WHITE, "bullet upgrade", 50, 50, 0x000000, 0, updateSquare1.position.y + 100);
        updateSquare2
            .on("pointerdown", () => { })
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });

        let updateSquare3 = new Effects(PIXI.Texture.WHITE, "BOSS calling", 50, 50, 0x000000, 0, updateSquare2.position.y + 100);
        updateSquare3
            .on("pointerdown", () => { })
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });


        let update1Text = new PIXI.Text('//gun upgrade');
        update1Text.position.set(updateSquare1.position.x + updateSquare1.width + 25, updateSquare1.position.y);

        let update2Text = new PIXI.Text('//bullet upgrade');
        update2Text.position.set(updateSquare2.position.x + updateSquare2.width + 25, updateSquare2.position.y);

        let update3Text = new PIXI.Text('//BOSS calling');
        update3Text.position.set(updateSquare3.position.x + updateSquare3.width + 25, updateSquare3.position.y);


        this.updatePanel.addChild(
            updateSquare1,
            updateSquare2,
            updateSquare3,
            update1Text,
            update2Text,
            update3Text,
        );
        this.updatePanel.position.set(25, this.screenSize.height / 2 - this.updatePanel.height / 2);


        //effects panel
        let effectSquare1 = new Effects(PIXI.Texture.from("snowflake"), "freezing", 50, 50, 0xFFFFFF, 0, 0);
        effectSquare1
            .on("pointerdown", () => this.freese())
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });

        let effectSquare2 = new Effects(PIXI.Texture.WHITE, "lockdown", 50, 50, 0x0000FF, effectSquare1.position.x + 100, 0);
        effectSquare2
            .on("pointerdown", () => { })
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });

        let effectSquare3 = new Effects(PIXI.Texture.WHITE, "high effective gun", 50, 50, 0x00FF00, effectSquare2.position.x + 100, 0);
        effectSquare3
            .on("pointerdown", () => { })
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });

        let effectSquare4 = new Effects(PIXI.Texture.from("nuclear_bomb"), "nuclear bomb", 50, 50, 0xFFFFFF, effectSquare3.position.x + 100, 0);
        effectSquare4
            .on("pointerdown", () => { })
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });

        let effectSquare5 = new Effects(PIXI.Texture.WHITE, "black hole", 50, 50, 0xf9ff83, effectSquare4.position.x + 100, 0);
        effectSquare5
            .on("pointerdown", () => { })
            .on("pointerover", () => { this.mouseOnEffects = true })
            .on("pointerout", () => { this.mouseOnEffects = false });

        this.effectsPanel.addChild(
            effectSquare1,
            effectSquare2,
            effectSquare3,
            effectSquare4,
            effectSquare5,
        );
        this.effectsPanel.position.set(this.screenSize.width / 2 - this.effectsPanel.width / 2, this.screenSize.height - this.effectsPanel.height - 25);

        this.app.stage.interactive = true;

        this.dragons.forEach(dragon => {
            if (dragon.state.hasAnimation("flying")) {
                // run forever, little boy!
                dragon.state.setAnimation(0, "flying", true);
                // dont run too fast
                // dragon.state.timeScale = 0.1;
            }
        });

        this.app.stage.addChild(
            this.gameScene,
            this.updatePanel,
            this.effectsPanel,
        );

        this.app.start();

        this.app.ticker.add(delta => this.gameLoop(delta));
        // app.ticker.add(() => Timer.timerManager.update(app.ticker.elapsedMS));
    }

    private gameLoop(delta: PIXI.Ticker) {

        this.dragons.forEach(dragon => {
            this.players.forEach(player => {
                player.checkCollapse(dragon, () => {
                    this.dragons.splice(this.dragons.indexOf(dragon), 1);
                });
            })
        });
    }

    private freese() {

        if (this.players[0].credits >= 10000) {
            this.dragons.forEach(dragon => {
                if (!dragon.isFreeze) {
                    this.players[0].credits -= 10000;
                    dragon.freeze();
                    setTimeout(() => {
                        this.dragons.forEach(dragon => {
                            dragon.unfreeze();
                        });
                    }, 2000);
                }
            });
        }
    }
}

window.onload = function () {
    new Game();
}


