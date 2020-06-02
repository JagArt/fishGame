export class CustomGraphicsGeometry extends PIXI.GraphicsGeometry {
    constructor() {
        super();
    }

    showPoints(): number[] {
        return this.points;
    }

}

export class CustomGraphics extends PIXI.Graphics {
    geometrys?: CustomGraphicsGeometry;
    points: number[];
    constructor(geometry: CustomGraphicsGeometry) {
        super(geometry);
        this.points = geometry.showPoints();
    }


}

export class CustomGraphics2 extends PIXI.Graphics {
    constructor() {
        super();
    }

    getPoints() {
        return this.currentPath.points;
    }
}