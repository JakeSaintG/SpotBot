import { autoInjectable } from "tsyringe";
import { LogService } from "./log.service";
import { IWelcomes } from "../interfaces/IWelcomes";
const fs = require('fs');;

@autoInjectable()
export class FileService {
    private logger: LogService;

    constructor(logger: LogService) {
        this.logger = logger;
    }

    public ensureTemplatedJsonFileExists = (fileName: string, forceSetup: boolean): void => {
        this.ensureDirectoryExists('./src/bot_files', false);

        if (!fs.existsSync(`./src/bot_files/${fileName}.json`) || forceSetup) {
            const fileTemplate = JSON.parse(fs.readFileSync(`./src/template_files/${fileName}_template.json`, 'utf8'));
            console.log(`Creating or recreating file, ${fileName}, from template.`);
            fs.writeFileSync(`./src/bot_files/${fileName}.json`, JSON.stringify(fileTemplate, null, 2));
        }
    }

    public getJsonFileContents = (fileName: string) => {
        this.ensureDirectoryExists(fileName, false);
        return JSON.parse(fs.readFileSync(`./src/bot_files/${fileName}.json`, 'utf8'));
    }

    public updateWelcomeJson = (welcomeJson: IWelcomes) => {
        fs.writeFileSync(`./src/bot_files/welcome_message.json`, JSON.stringify(welcomeJson, null, 2));
    }

    private ensureDirectoryExists = (path: string, forceSetup: boolean): void => {
        if (!fs.existsSync(path) || forceSetup) {
            console.log(`Creating directory at ${path}`);
            fs.mkdirSync(path);
        }
    }
}
