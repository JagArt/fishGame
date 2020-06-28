import * as PIXI from "pixi.js"
window.PIXI = PIXI;
import "pixi-spine";
import { Timer, TimerManager } from "eventemitter3-timer";

import { FishSprite } from "./fishSprite";
import { Player } from "./player";
import { Route, Directions } from "./utils/routes";
import { FishSpine } from "./fishSpine";
import { Effects, Effect } from "./effects";
import { mouseCollapse } from "./utils/collapsController";

export class Game {

    screenSize = { width: 1280, height: 720 };
    app: PIXI.Application;

    gameScene: PIXI.Container;
    updatePanel: PIXI.Container;
    effectsPanel: PIXI.Container;
    visible: boolean;

    players: Player[] = [];
    dragons: FishSpine[] = [];

    effects: Effects[] = [];

    mouseOnEffects: boolean = false;

    bombIsActivated: boolean = false;
    bombDamage: number = 50;

    bomb: PIXI.Sprite | undefined;

    mousePosition = {
        x: 0,
        y: 0,
    };

    mouseIsDown: boolean = false;

    targetEffectIsActivated: boolean = false;
    targetImage: PIXI.Sprite | undefined;
    targetedObject: FishSpine | FishSprite | undefined;

    explosionTextures: PIXI.Texture[] = [];


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
            .add("bullet0", "images/bullets/0_bullet.png")
            .add("bullet1", "images/bullets/1_bullet.png")
            .add("bullet2", "images/bullets/2_bullet.png")
            .add("bullet3", "images/bullets/3_bullet.png")
            .add("bullet4", "images/bullets/4_bullet.png")
            .add("bullet5", "images/bullets/5_bullet.png")
            .add("bullet6", "images/bullets/6_bullet.png")
            .add("bullet7", "images/bullets/7_bullet.png")
            .add("bullet8", "images/bullets/8_bullet.png")
            .add("bullet9", "images/bullets/9_bullet.png")
            .add("explosion", "images/effects/spritesheets/mc.json")
            .add("snowflake", "images/effects/snowflake.png")
            .add("black_hole", "images/effects/black_hole.png")
            .add("effective_gun", "images/effects/effective_gun.png")
            .add("nuclear_bomb", "images/effects/nuclear_bomb.png")
            .add("bomb", "images/effects/bomb.png")
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
        // console.log(PIXI.Loader.shared.progress + " % loaded");

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


        for (var i = 0; i < 26; i++) {
            const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
            this.explosionTextures.push(texture);
        }

        let bg = new PIXI.Sprite(PIXI.Texture.from("bg"));
        bg.width = this.screenSize.width;
        bg.height = this.screenSize.height
        bg.name = "background";

        this.players.push(new Player(this, "test player1", 1, 99999, 100));
        // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player2", 2, app.loader.resources.bullet.texture, 99999, 100, 5));
        // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player3", 3, app.loader.resources.bullet.texture, 99999, 100, 5));
        // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player4", 4, app.loader.resources.bullet.texture, 99999, 100, 5));

        this.app.stage
            .on("mousedown", () => {
                this.mouseIsDown = true;
                if (!this.mouseOnEffects && this.bombIsActivated) {
                    this.nuclear_boom();
                }
                if (!this.mouseOnEffects && this.targetEffectIsActivated) {
                    this.fish_target();
                }
            })
            .on("mouseup", () => {
                this.mouseIsDown = false;
            });

        this.bomb = new PIXI.Sprite(PIXI.Texture.from("bomb"));
        this.bomb.width = 100;
        this.bomb.height = 100;
        this.bomb.anchor.set(0.5, 0.5);
        this.bomb.visible = false;

        this.targetImage = new PIXI.Sprite(PIXI.Texture.from("cursor"));
        this.targetImage.width = 100;
        this.targetImage.height = 100;
        this.targetImage.anchor.set(0.5, 0.5);
        this.targetImage.visible = false;

        this.dragons.push(new FishSpine(this, 0, 0, PIXI.Loader.shared.resources.dragon.spineData, "Dragon2 sin", 100, 1, Route.sin));
        this.dragons.push(new FishSpine(this, 50, 0, PIXI.Loader.shared.resources.dragon.spineData, "Dragon1", 100, 1, Route.linear));
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
        let updateSquare1 = new Effects(this, PIXI.Texture.WHITE, Effect.gun_upgrade, "gun upgrade", 50, 50, 0x000000, 0, 0);
        let updateSquare2 = new Effects(this, PIXI.Texture.WHITE, Effect.bullet_upgrade, "bullet upgrade", 50, 50, 0x000000, 0, updateSquare1.position.y + 100);
        let updateSquare3 = new Effects(this, PIXI.Texture.WHITE, Effect.freese, "BOSS calling", 50, 50, 0x000000, 0, updateSquare2.position.y + 100);

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
        this.effects.push(new Effects(this, PIXI.Texture.from("snowflake"), Effect.freese, "freezing", 50, 50, 0xFFFFFF, 0, 0));
        this.effects.push(new Effects(this, PIXI.Texture.from("effective_gun"), Effect.effectiv_gun, "high effective gun", 50, 50, 0xFFFFFF, 0, 0));
        this.effects.push(new Effects(this, PIXI.Texture.from("nuclear_bomb"), Effect.nuclear_bomb, "nuclear bomb", 50, 50, 0xFFFFFF, 0, 0));
        this.effects.push(new Effects(this, PIXI.Texture.from("cursor"), Effect.target, "lockdown", 50, 50, 0xFFFFFF, 0, 0));
        this.effects.push(new Effects(this, PIXI.Texture.from("black_hole"), Effect.freese, "black hole", 50, 50, 0xFFFFFF, 0, 0));

        for (var e = 1; e < this.effects.length; e++) {
            this.effects[e].position.set(this.effects[e - 1].position.x + 100, 0);
        }

        this.effects.forEach(effect => {
            this.effectsPanel.addChild(effect);
        });

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

        this.gameScene.addChild(this.bomb);
        this.gameScene.addChild(this.targetImage);

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

        this.mousePosition.x = this.app.renderer.plugins.interaction.mouse.global.x;
        this.mousePosition.y = this.app.renderer.plugins.interaction.mouse.global.y;

        this.dragons.forEach(dragon => {
            this.players.forEach(player => {
                player.checkCollapse(dragon);
            })
        });
    }

    nuclear_boom() {
        this.bomb!.visible = false;

        let explosion = new PIXI.AnimatedSprite(this.explosionTextures);
        explosion.loop = false;
        explosion.scale.set(2, 2);
        explosion.anchor.set(.5, .5);
        explosion.position.set(this.mousePosition.x, this.mousePosition.y);
        explosion.gotoAndPlay(0);
        this.app.stage.addChild(explosion);
        explosion.onComplete = () => {
            this.app.stage.removeChild(explosion);
        }
        this.bombIsActivated = false;

        this.dragons.forEach(dragon => {
            let distance = Math.abs(this.mousePosition.x - dragon.position.x);
            let damage = Math.abs(distance / this.screenSize.width - 1) * this.bombDamage;
            dragon.hit(damage, () => {
                this.players[0].credits += 12345;
            });
        });

        this.dragons.forEach(dragon => {
            if (dragon.hp <= 0) {
                this.dragons.splice(this.dragons.indexOf(dragon), 1);
            }
        })
    }

    fish_target() {
        if (this.targetEffectIsActivated) {
            this.dragons.forEach(dragon => {
                if (mouseCollapse(this.mousePosition.x, this.mousePosition.y, dragon)) {
                    this.targetedObject = dragon;
                    setTimeout(() => {
                        this.targetedObject = undefined;
                    }, 5000);
                }
            });
            this.targetEffectIsActivated = false;
            this.targetImage!.visible = false;
        }
    }
}

window.onload = function () {
    new Game();
}


