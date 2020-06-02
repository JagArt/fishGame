export function rotateToPoint(mouseX: number, mouseY: number, posX: number, posY: number) {
    var dist_Y = mouseY - posY;
    var dist_X = mouseX - posX;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180/ Math.PI;
    return angle;
}
