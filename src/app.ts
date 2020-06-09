import * as PIXI from "pixi.js"
window.PIXI = PIXI;
import "pixi-spine";
import { FishSprite } from "./fishSprite";
import { Player } from "./player";
import { Routes, Directions } from "./utils/routes";
import { FishSpine } from "./fishSpine";
import { Effects } from "./effects";

const screenSize = { width: 1280, height: 720 };

let app: PIXI.Application;

let loadScreen: PIXI.Container;
let gameScene: PIXI.Container;
let updatePanel: PIXI.Container;
let effectsPanel: PIXI.Container;

let visible: boolean;
var load: boolean = true;

const dragons: FishSpine[] = [];
const players: Player[] = [];

// const bezier = new CustomGraphics(new CustomGraphicsGeometry());

window.onload = function () {
    app = new PIXI.Application(
        {
            // width: window.innerWidth,
            // height: window.innerHeight,
            width: screenSize.width,
            height: screenSize.height,
            backgroundColor: 0xAAAAAA
        }
    );
    // let fishSprite: Fish;
    let keys: { [key: string]: boolean; } = {};

    visible = true;

    app.loader
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
        .add("explosion", "images/spritesheets/mc.json")
        .add("dragon", "images/dragon/export/dragon-ess.json");

    app.loader.onLoad.add(onLoad);
    app.loader.onComplete.add(doneLoading);

    app.loader.load();
}

function onLoad() {
    console.log(app.loader.progress + " % loaded");

    var progress = 500 * app.loader.progress / 100;

    document.body.appendChild(app.view);
    loadScreen = new PIXI.Container();

    let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.tint = 0x000000;
    bg.width = screenSize.width;
    bg.height = screenSize.height;

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
    app.stage.addChild(loadScreen);
}

function doneLoading() {
    // var animation = new PIXI.spine.Spine(resources.spineCharacter.spineData)
    document.body.appendChild(app.view)

    const defaultIcon = "url('https://flyclipart.com/thumb2/game-play-cursor-pointer-shooter-png-icon-free-download-167975.png'),auto";

    app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;


    gameScene = new PIXI.Container();
    updatePanel = new PIXI.Container();
    effectsPanel = new PIXI.Container();

    let bg = new PIXI.Sprite(app.loader.resources.bg.texture);
    bg.width = screenSize.width;
    bg.height = screenSize.height
    bg.name = "background";

    players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player1", 1, app.loader.resources.bullet.texture, 99999, 100, 5));
    // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player2", 2, app.loader.resources.bullet.texture, 99999, 100, 5));
    // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player3", 3, app.loader.resources.bullet.texture, 99999, 100, 5));
    // players.push(new Player(app, app.loader.resources.gun_vip1.texture, "test player4", 4, app.loader.resources.bullet.texture, 99999, 100, 5));


    dragons.push(new FishSpine(app, 0, 0, app.loader.resources.dragon.spineData, "Dragon[0,0] sin", 100, 1, Routes.sin));
    dragons.push(new FishSpine(app, 0, 0, app.loader.resources.dragon.spineData, "Dragon[0,0]", 100, 1, Routes.linear));
    // dragons.push(new FishSpine(app, screenSize.width, screenSize.height, app.loader.resources.dragon.spineData, "Dragon[>, >]", 100, 1, Routes.linear, Directions.fromLeftToRight));
    // dragons.push(new FishSpine(app, 500, 0, app.loader.resources.dragon.spineData, "Dragon[500, 0]", 100, 1, Routes.linear, Directions.fromLeftToRight));
    // dragons.push(new FishSpine(app, screenSize.width, 200, app.loader.resources.dragon.spineData, "Dragon[>, 200]", 100, 1, Routes.linear, Directions.fromLeftToRight));


    gameScene.addChild(
        bg,
    );

    players.forEach(player => {
        gameScene.addChild(player);
    });

    dragons.forEach(dragon => {
        gameScene.addChild(dragon);
    });


    // update panel 
    let updateSquare1 = new Effects(PIXI.Texture.WHITE, "gun upgrade", 50, 50, 0x000000, 0, 0);
    let updateSquare2 = new Effects(PIXI.Texture.WHITE, "bullet upgrade", 50, 50, 0x000000, 0, updateSquare1.position.y + 100);
    let updateSquare3 = new Effects(PIXI.Texture.WHITE, "BOSS calling", 50, 50, 0x000000, 0, updateSquare2.position.y + 100);

    let update1Text = new PIXI.Text('//gun upgrade');
    update1Text.position.set(updateSquare1.position.x + updateSquare1.width + 25, updateSquare1.position.y);

    let update2Text = new PIXI.Text('//bullet upgrade');
    update2Text.position.set(updateSquare2.position.x + updateSquare2.width + 25, updateSquare2.position.y);

    let update3Text = new PIXI.Text('//BOSS calling');
    update3Text.position.set(updateSquare3.position.x + updateSquare3.width + 25, updateSquare3.position.y);


    updatePanel.addChild(
        updateSquare1,
        updateSquare2,
        updateSquare3,
        update1Text,
        update2Text,
        update3Text,
    );
    updatePanel.position.set(25, app.screen.height / 2 - updatePanel.height / 2);


    //effects panel
    let effectSquare1 = new Effects(PIXI.Texture.WHITE, "freezing", 50, 50, 0xFF0000, 0, 0);
    effectSquare1.on("pointerdown", () => freese());

    let effectSquare2 = new Effects(PIXI.Texture.WHITE, "lockdown", 50, 50, 0x0000FF, effectSquare1.position.x + 100, 0);
    let effectSquare3 = new Effects(PIXI.Texture.WHITE, "high effective gun", 50, 50, 0x00FF00, effectSquare2.position.x + 100, 0);
    let effectSquare4 = new Effects(PIXI.Texture.WHITE, "nuclear bomb", 50, 50, 0xd81fdd, effectSquare3.position.x + 100, 0);
    let effectSquare5 = new Effects(PIXI.Texture.WHITE, "black hole", 50, 50, 0xf9ff83, effectSquare4.position.x + 100, 0);

    effectsPanel.addChild(
        effectSquare1,
        effectSquare2,
        effectSquare3,
        effectSquare4,
        effectSquare5,
    );
    effectsPanel.position.set(app.screen.width / 2 - effectsPanel.width / 2, app.screen.height - effectsPanel.height - 25);

    // const realPath = new PIXI.Graphics();

    // realPath.lineStyle(2, 0xFFFFFF, 1);
    // realPath.moveTo(0, 0);
    // realPath.lineTo(100, 500);
    // realPath.lineTo(200, 500);
    // realPath.lineTo(600, 0);


    // const bezier = new PIXI.Graphics();

    // bezier.lineStyle(5, 0xAA0000, 1);
    // bezier.bezierCurveTo(100, 500, 200, 500, 600, 0);

    // console.log(bezier.geometry.points);
    // let points: number[] = bezier.points;
    // console.log(bezier);
    // for (let point of points) {
    //     console.log(point);
    // }


    app.stage.interactive = true;

    dragons.forEach(dragon => {
        if (dragon.state.hasAnimation("flying")) {
            // run forever, little boy!
            dragon.state.setAnimation(0, "flying", true);
            // dont run too fast
            // dragon.state.timeScale = 0.1;
        }
    });





    console.log(app);

    app.stage.addChild(
        gameScene,
        updatePanel,
        effectsPanel,
        // bezier,
        // realPath
    );

    app.start();

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta: PIXI.Ticker) {
    // fishSprite.go();
    // console.log(players);
    // console.log(dragons);

    for (var p = 0; p < players.length; p++) {
        if (players[p].bullets.length > 0) {
            for (var b = 0; b < players[p].bullets.length; b++) {
                for (var d = 0; d < dragons.length; d++)
                    // console.log(dragons[d]);
                    // console.log(players[p].bullets[b]);
                    if (rectsIntersect(dragons[d], players[p].bullets[b])) {
                        players[p].bullets[b].hit();
                        players[p].bullets.splice(players[p].bullets.indexOf(players[p].bullets[b]), 1);
                        dragons[d].hp -= players[p].damage;
                        dragons[d].hit();
                        if (dragons[d].hp <= 0) {
                            players[p].credits += 1000;
                            dragons[d].dead();
                            dragons.splice(dragons.indexOf(dragons[d], 1));
                        }
                    }


            }
        } else {
            console.log('has not bullets');
        }
    }

}

function freese() {
    dragons.forEach(dragon => {
        dragon.freeze();
    });

    // var timer = PIXI.tim
}

function unfreese() {
    dragons.forEach(dragon => {
        dragon.freeze();
    });
}

function rectsIntersect(a: FishSpine | FishSprite, b: PIXI.Sprite) {
    // console.log(a);
    // console.log(b);

    if (a === undefined && b === undefined) return false;

    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return aBox.x + aBox.width - 50 > bBox.x &&
        aBox.x + 50 < bBox.x + bBox.width &&
        aBox.y + aBox.height - 50 > bBox.y &&
        aBox.y + 50 < bBox.y + bBox.height;
}

