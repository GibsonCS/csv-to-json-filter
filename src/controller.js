import { EventEmitter } from "events";

export default class Controller {
  constructor({ view, service, csvKeys }) {
    this.csvKeys = csvKeys;
    this.view = view;
    this.service = service;
  }

  static async start(...args) {
    const controller = new Controller(...args);
    await controller.#init();
  }

  handleProgress({ progressAlready, fileSize }) {
    this.view.onProgressUpdated({ progressAlready, fileSize });
  }

  async #init() {
    const progressNotifier = new EventEmitter();

    this.view.initialize();

    progressNotifier.on("update", this.handleProgress.bind(this));

    await this.service.execute(this.csvKeys, progressNotifier);
  }
}
