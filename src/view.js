import blessed from "blessed";
import contrib from "blessed-contrib";

export default class View {
  constructor() {
    this.screen = null;
    this.lastProgressUpdate = 0;
    this.progressBar = null;
  }

  initialize() {
    this.buildInterface();
    this.buildProgressBar();
  }

  buildInterface() {
    const screen = (this.screen = blessed.screen());
    screen.key(["escape", "q", "C-c"], () => process.exit(0));
    screen.render();
  }

  buildProgressBar() {
    this.progressBar = contrib.gauge({
      label: "Progress",
      showLabel: true,
      width: "50%",
      height: 5,
      top: "center",
      left: "center",
    });

    this.screen.append(this.progressBar);
    this.screen.render();
  }

  onProgressUpdated({ progressAlready, filesSize }) {
    const alreadyProcessed = Math.ceil((progressAlready / filesSize) * 100);

    if (this.lastProgressUpdate === alreadyProcessed) return;

    this.lastProgressUpdate = alreadyProcessed;

    this.progressBar.setData([alreadyProcessed]);

    this.screen.render();
  }
}
