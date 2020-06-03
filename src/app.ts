import * as PIXI from "pixi.js"
window.PIXI = PIXI;
import "pixi-spine";
import { FishSprite } from "./fishSprite";
import { Player } from "./player";
import { Direction } from "./utils/direction";
import { FishSpine } from "./fishSpine";
import { Effects } from "./effects";

const screenSize = { width: 1280, height: 720 };

let app: PIXI.Application;
let dragon: FishSpine;
let player1: Player;
let player2: Player;
let player3: Player;
let player4: Player;

let gameScene: PIXI.Container;
let updatePanel: PIXI.Container;
let effectsPanel: PIXI.Container;

let visible: boolean;

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
        .add("gun_vip1", "images/guns_png/gun_vip1.png")
        .add("bullet", "images/bullets/0_bullet.png")
        .add("explosion", "images/spritesheets/mc.json")
        .add("dragon", "images/dragon/export/dragon-ess.json");

    app.loader.onComplete.add(doneLoading);

    app.loader.load();
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

    player1 = new Player(app, app.loader.resources.gun_vip1.texture, "test player", 1, app.loader.resources.bullet.texture, 99999, 100, 5);
    player2 = new Player(app, app.loader.resources.gun_vip1.texture, "test player", 2, app.loader.resources.bullet.texture, 99999, 100, 5);
    player3 = new Player(app, app.loader.resources.gun_vip1.texture, "test player", 3, app.loader.resources.bullet.texture, 99999, 100, 5);
    player4 = new Player(app, app.loader.resources.gun_vip1.texture, "test player", 4, app.loader.resources.bullet.texture, 99999, 100, 5);

    dragon = new FishSpine(app, 0, 0, app.loader.resources.dragon.spineData, "Dragon", 100, 1, Direction.sin);
    dragon.visible = visible;

    gameScene.addChild(
        bg,
        player1,
        player2,
        player3,
        player4,
        dragon
    );

    // update panel 
    let updateSquare1 = new Effects(PIXI.Texture.WHITE, "gun upgrade", 50, 50, 0x000000, 0, 0);
    let updateSquare2 = new Effects(PIXI.Texture.WHITE, "bullet upgrade", 50, 50, 0x000000, 0, updateSquare1.position.y + 100);
    let updateSquare3 = new Effects(PIXI.Texture.WHITE, "BOSS calling", 50, 50, 0x000000, 0, updateSquare2.position.y + 100);

    updatePanel.addChild(
        updateSquare1,
        updateSquare2,
        updateSquare3
    );
    updatePanel.position.set(25, app.screen.height / 2 - updatePanel.height / 2);


    //effects panel
    let effectSquare1 = new Effects(PIXI.Texture.WHITE, "freezing", 50, 50, 0xFF0000, 0, 0);
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

    if (dragon.state.hasAnimation("flying")) {
        // run forever, little boy!
        dragon.state.setAnimation(0, "flying", true);
        // dont run too fast
        // dragon.state.timeScale = 0.1;
    }



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

    for (var b = 0; b < player1.bullets.length; b++) {
        if (player1.bullets.length > 0) {
            if (rectsIntersect(dragon, player1.bullets[b])) {
                player1.bullets[b].hit();
                player1.bullets.splice(player1.bullets.indexOf(player1.bullets[b]), 1);
                dragon.hp -= player1.damage;
                if (dragon.hp <= 0) {
                    player1.credits += 1000;
                }
                dragon.hit();
            } else {
            }
        } else {
            console.log('has not bullets');

        }
    }

    for (var b = 0; b < player4.bullets.length; b++) {
        if (player4.bullets.length > 0) {
            if (rectsIntersect(dragon, player4.bullets[b])) {
                player4.bullets[b].hit();
                player4.bullets.splice(player4.bullets.indexOf(player4.bullets[b]), 1);
                dragon.hp -= player4.damage;
                if (dragon.hp <= 0) {
                    player4.credits += 1000;
                }
                dragon.hit();
            } else {
            }
        } else {
            console.log('has not bullets');

        }
    }

    for (var b = 0; b < player2.bullets.length; b++) {
        if (player2.bullets.length > 0) {
            if (rectsIntersect(dragon, player2.bullets[b])) {
                player2.bullets[b].hit();
                player2.bullets.splice(player2.bullets.indexOf(player2.bullets[b]), 1);
                dragon.hp -= player2.damage;
                if (dragon.hp <= 0) {
                    player2.credits += 1000;
                }
                dragon.hit();
            } else {
            }
        } else {
            console.log('has not bullets');

        }
    }

    for (var b = 0; b < player3.bullets.length; b++) {
        if (player3.bullets.length > 0) {
            if (rectsIntersect(dragon, player3.bullets[b])) {
                player3.bullets[b].hit();
                player3.bullets.splice(player3.bullets.indexOf(player3.bullets[b]), 1);
                dragon.hp -= player3.damage;
                if (dragon.hp <= 0) {
                    player3.credits += 1000;
                }
                dragon.hit();
            } else {
            }
        } else {
            console.log('has not bullets');

        }
    }

}


function rectsIntersect(a: FishSpine | FishSprite, b: PIXI.Sprite): boolean {
    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return aBox.x + aBox.width - 50 > bBox.x &&
        aBox.x + 50 < bBox.x + bBox.width &&
        aBox.y + aBox.height - 50 > bBox.y &&
        aBox.y + 50 < bBox.y + bBox.height;
}

