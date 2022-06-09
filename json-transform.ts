import { Transform } from "stream";
import { TextDecoder } from "util";

const decoder = new TextDecoder();

export class JSONTransform extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      readableHighWaterMark: 8096,
      writableHighWaterMark: 256,
    });
  }

  private accumulator = "";
  _transform(chunk: Buffer | string | Uint8Array, enc, cb) {
    // console.log(chunk[0]);
    if (Buffer.isBuffer(chunk)) {
      chunk = chunk.toString();
    } else if (chunk instanceof Uint8Array) {
      chunk = decoder.decode(chunk);
    }

    this.accumulator += chunk;
    this.checkAccumulator(cb);
  }

  private checkAccumulator(cb) {
    let objStart: number | undefined;
    let depth = 0;
    let objectsEnd: number | undefined;

    for (let i = 0; i < this.accumulator.length; i++) {
      const ch = this.accumulator.charAt(i);
      switch (ch) {
        case "{":
          if (objStart == undefined) {
            objStart = i;
          }
          depth++;
          break;
        case "}":
          depth--;
          if (depth < 0) {
            console.log("panic error", this.accumulator);
            process.exit(-1);
          }

          if (objStart != undefined && depth == 0) {
            const obj = this.accumulator.substring(objStart, i + 1);
            // console.log(objStart, i, obj);
            objStart = undefined;
            objectsEnd = i + 1;

            try {
              this.push(JSON.parse(obj));
            } catch (e) {
              console.log("error while parsing", e);
            }
          }
      }
    }

    if (objectsEnd) {
      this.accumulator = this.accumulator.substring(objectsEnd);
      // console.log("new accumulator", this.accumulator);
    }
    cb();
  }
}
