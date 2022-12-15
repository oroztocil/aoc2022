import { Coords2d } from "./arrays";

export class Bitmap {
    constructor(
        private readonly tiles: boolean[][],
        private readonly offset = [0, 0]) { }

    get height() {
        return this.tiles?.length ?? 0;
    }

    get width() {
        return this.tiles[0]?.length ?? 0;
    }

    isSet = ([x, y]: Coords2d): boolean =>
        !this.tiles[x + this.offset[0]][y + this.offset[1]];

    set = ([x, y]: Coords2d) =>
        this.tiles[x + this.offset[0]][y + this.offset[1]] = true;

    unset = ([x, y]: Coords2d) =>
        this.tiles[x + this.offset[0]][y + this.offset[1]] = true;
}