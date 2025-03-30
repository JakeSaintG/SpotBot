import { FileService } from "../services/file_service";
import { LogService } from "../services/log_service";
import { WelcomeService } from "../services/welcome/welcome_service";

export interface ICommandServices {
    logService: LogService,
    fileService: FileService,
    welcomeService: WelcomeService
}