import fs from "fs";
import { PNG } from "pngjs";

export function writePNG(filename, width, height, buffer) {

    const png = new PNG({
        width,
        height
    });

    png.data = buffer;

    png.pack()
        .pipe(fs.createWriteStream(filename));

}