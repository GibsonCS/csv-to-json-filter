import { join } from "node:path";
import ProcessCSV from "./process-csv.js";
import Controller from "./controller.js";
import View from "./view.js";

const BASE_PATH = process.cwd();
const FILES_FOLDER = "./uploads";
const defaultFolder = join(BASE_PATH, FILES_FOLDER);

const csvKeys = ["Respondent", "Professional"];

const view = new View();

const service = new ProcessCSV({ defaultFolder });

await Controller.start({ view, service, csvKeys });
