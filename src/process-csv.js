import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import csvtojson from "csvtojson";
import { statSync } from "node:fs";

export default class ProcessCSV {
  #defaultFolder;
  constructor({ defaultFolder }) {
    this.#defaultFolder = defaultFolder;
  }

  async execute(csvKeys, progressNotifier) {
    const filesDir = await readdir(this.#defaultFolder);
    const filePath = join(this.#defaultFolder, filesDir[0]);

    if (!filePath) throw new Error("file not found!");

    const fileSize = statSync(filePath).size;

    await this.#runPipeline({ filePath, csvKeys, progressNotifier, fileSize });
  }

  #normalizeCSVSeparator() {
    let firstChunkIsProcessed = false;
    let separator = ",";

    return new Transform({
      transform(chunk, _, callback) {
        if (!firstChunkIsProcessed) {
          const text = chunk.toString();
          if (text.includes(";")) separator = ",";
          firstChunkIsProcessed = true;
        }
        const dataWithCommon = chunk.toString().replace(/[;]/g, separator);
        callback(null, dataWithCommon);
      },
    });
  }

  #transformJSON(csvKeys) {
    return new Transform({
      transform(chunk, _, callback) {
        const data = JSON.parse(chunk);
        let json = {};
        for (const key of csvKeys) {
          json[key] = data[key];
        }
        callback(null, JSON.stringify(json).concat("\n"));
      },
    });
  }

  #handleProgress({ progressNotifier, fileSize }) {
    let progressAlready = 0;

    return new Transform({
      transform(chunk, _, callback) {
        progressAlready += chunk.length;
        progressNotifier.emit("update", { progressAlready, fileSize });
        callback(null, chunk);
      },
    });
  }

  // #handleProgress({ progressNotifier, fileSize }) {
  //   let progressAlready = 0;

  //   async function* process(source) {
  //     for await (const chunk of source) {
  //       progressAlready += chunk.length;
  //       progressNotifier.emit("update", { progressAlready, fileSize });

  //       yield chunk;
  //     }
  //   }
  //   return process;
  // }

  async #runPipeline({ filePath, csvKeys, progressNotifier, fileSize }) {
    await pipeline(
      createReadStream(filePath),
      // this.#normalizeCSVSeparator(),
      csvtojson(),
      this.#transformJSON(csvKeys),
      this.#handleProgress({ progressNotifier, fileSize }),
      createWriteStream("./docs/final.json")
    );
  }
}
