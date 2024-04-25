import { FileService } from "../services/file.service";
import { LogService } from "../services/log.service";
import { WelcomeService } from "../services/welcome/welcome.service";

export interface ICommandServices {
    logService: LogService,
    fileService: FileService,
    welcomeService: WelcomeService
}