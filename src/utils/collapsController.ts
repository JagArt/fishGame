import { FishSpine } from "../fishSpine";
import { FishSprite } from "../fishSprite";

export function rectsIntersect(a: FishSpine | FishSprite, b: PIXI.Sprite) {
    if (a === undefined || b === undefined) return false;

    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return aBox.x + aBox.width - 50 > bBox.x &&
        aBox.x + 50 < bBox.x + bBox.width &&
        aBox.y + aBox.height - 50 > bBox.y &&
        aBox.y + 50 < bBox.y + bBox.height;
}

export function mouseCollapse(mX: number, mY: number, b: FishSpine | FishSprite) {

    let bBox = b.getBounds();

    return mX > bBox.x &&
        mX < bBox.x + bBox.width &&
        mY > bBox.y &&
        mY < bBox.y + bBox.height;
}