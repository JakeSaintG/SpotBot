import { LogService } from '../log.service'
import { autoInjectable } from 'tsyringe'
import { ConfigurationService } from '../configuration/configuration.service';
import { IChannel } from '../../interfaces/IConfig';
import { FileService } from '../file.service';
import { AppService } from '../../app.service';

@autoInjectable()
export class WelcomeService {
    private fileService: FileService;
    private configService: ConfigurationService;
    private appService: AppService;

    // Getter? Setter?
    private welcomeChannel: IChannel;
    private welcomeMessage: string;

    constructor(configService: ConfigurationService, fileService: FileService, appService: AppService) {
        this.configService = configService;
        this.fileService = fileService;
        this.appService = appService;
    }

    public startUpWelcomeService = async () => {
        await this.getWelcomeChannelFromConfig();

        if (this.welcomeChannel.configured && this.checkForServerWelcomeChannel()) {
            this.ensureWelcomeFileExists(false);
        } else {
            console.log("Welcome Channel functionality was either not configured or the server channel was removed. Skipping.");
        }
    }

    private checkForServerWelcomeChannel = () => {
        let serverWelcomeChannel = this.appService.guild.channels.cache.find(
            channel => channel.id === this.welcomeChannel.id
        )

        if(serverWelcomeChannel) return true;

        return false;
    }

    private ensureWelcomeFileExists = (forceSetup: boolean) => {
        this.fileService.ensureTemplatedJsonFileExists('welcome_message', forceSetup);
    }

    private getWelcomeChannelFromConfig = async () => {
        this.welcomeChannel = await this.configService.returnConfiguredGeneralChannel("welcome_channel");
    }

    //Char length, etc
    private validateWelcomeMessage = () => {
        /*
            pass in string to verify
            check char length
            misc other checks?
            return true if good
        */
    }

    getWelcomeMessage = () => {
        /*
            use file service (maybe) to read welcome message
            store in this.welcomeMessage
        */


    }

    saveWelcomeMessage = () => {
        /*
            get this.welcomeMessage
            use file service (maybe) to write to json
        */
    }

    handleWelcomeMessageUpdate = () => {

        /*
            receive user command
            prompt for message
            listen for next message
            this.verifyWelcomeMessage
            save next message
            Thanks!
        */
    }
}