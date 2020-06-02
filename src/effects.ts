export class Effects extends PIXI.Sprite {
    constructor(texture: PIXI.Texture, name: string, width: number, height: number, tint: number, x: number, y: number) {
        super(texture);
        this.name = name;
        this.width = width;
        this.height = height;
        this.tint = tint;
        this.position.set(x, y);
        this.interactive = true;
        this.buttonMode = true;
        this.on("pointerdown", () => this.onClick(this.name));
    }

    onClick(text: string) {
        console.log(text);
    }
}