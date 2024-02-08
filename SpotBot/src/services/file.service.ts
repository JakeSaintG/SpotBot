import { autoInjectable } from "tsyringe";
import { LogService } from "./log.service";
const fs = require('fs');;

@autoInjectable()
export class FileService {
    private logger: LogService;

    constructor(logger: LogService) {
        this.logger = logger;
    }

    public ensureTemplatedJsonFileExists = (fileName: string, forceSetup: boolean): void => {
        this.ensureDirectoryExists('./bot_files', false);

        if (!fs.existsSync(`./bot_files/${fileName}.json`) || forceSetup) {
            const fileTemplate = JSON.parse(fs.readFileSync(`./src/template_files/${fileName}_template.json`, 'utf8'));
            console.log(`Creating or recreating file, ${fileName}, from template.`);
            fs.writeFileSync(`./bot_files/${fileName}.json`, JSON.stringify(fileTemplate, null, 2));
        }
    }

    private ensureDirectoryExists = (path: string, forceSetup: boolean): void => {
        if (!fs.existsSync(path) || forceSetup) {
            console.log(`Creating directory at ${path}`);
            fs.mkdirSync(path);
        }
    }
}
