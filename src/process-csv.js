import { createReadStream, createWriteStream, read } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import csvtojson from "csvtojson";
import { statSync } from "node:fs";
import StreamConcat from "stream-concat";

export default class ProcessCSV {
  #defaultFolder;
  constructor({ defaultFolder }) {
    this.#defaultFolder = defaultFolder;
  }

  async execute(csvKeys, progressNotifier) {
    const stream = await this.#prepareStreams();

    const filesSize = this.#getFilesSize(await readdir(this.#defaultFolder));

    await this.#runPipeline({ stream, filesSize, csvKeys, progressNotifier });
  }

  async #prepareStreams() {
    const streams = [];

    const filesDir = await readdir(this.#defaultFolder);
    if (!filesDir) throw new Error("file not found!");

    filesDir.forEach((file) =>
      streams.push(createReadStream(join(this.#defaultFolder, file)))
    );

    return new StreamConcat(streams);
  }

  #getFilesSize(streams) {
    return streams
      .map((stream) => statSync(join(this.#defaultFolder, stream)).size)
      .reduce((prev, current) => prev + current, 0);
  }

  #handleProgress({ progressNotifier, filesSize }) {
    let progressAlready = 0;

    return new Transform({
      transform(chunk, _, callback) {
        progressAlready += chunk.length;
        progressNotifier.emit("update", { progressAlready, filesSize });
        callback(null, chunk);
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

  async #runPipeline({ stream, filesSize, csvKeys, progressNotifier }) {
    await pipeline(
      stream,
      this.#handleProgress({ progressNotifier, filesSize }),
      csvtojson(),
      this.#transformJSON(csvKeys),
      createWriteStream("./docs/final.json")
    );
    progressNotifier.emit("done");
  }
}
