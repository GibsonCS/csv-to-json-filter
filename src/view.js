import blessed from "blessed";
import contrib from "blessed-contrib";

export default class View {
  constructor() {
    this.screen = null;
    this.lastProgressUpdate = 0;
    this.progressBar = null;
  }

  initialize() {
    this.buildInterface(), this.buildProgressBar();
  }

  buildInterface() {
    const screen = (this.screen = blessed.screen());
    screen.key(["scape", "q", "C-c"], () => process.exit(0));
    screen.render();
  }

  buildProgressBar() {
    this.progressBar = contrib.gauge({
      label: "Progress",
      showLabel: true,
    });

    this.screen.append(this.progressBar);
    this.screen.render();
  }

  onProgressUpdated({ progressAlready, fileSize }) {
    const alreadyProcessed = Math.ceil((progressAlready / fileSize) * 100);

    if (this.lastProgressUpdate === alreadyProcessed) return;

    this.lastProgressUpdate = alreadyProcessed;

    this.progressBar.setStack([
      { percent: alreadyProcessed, stroke: "green" },
      { percent: 100 - alreadyProcessed, stroke: "white" },
    ]);

    this.screen.render();
  }
}
