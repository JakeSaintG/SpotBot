import * as Discord from 'discord.js'
import { LogService } from '../log.service'
import { autoInjectable } from 'tsyringe'
import { ConfigurationService } from '../configuration/configuration.service';
import { IChannel } from '../../interfaces/IConfig';

@autoInjectable()
export class WelcomeService {

    private configService: ConfigurationService;
    // Getter? Setter?
    welcomeChannel: IChannel;
    welcomeMessage: string;

    constructor(configService: ConfigurationService) {
        this.configService = configService;
    }

    public startUpWelcomeService = async () => {
        this.getWelcomeChannel();

        if (this.welcomeChannel.configured) {
            this.checkForWelcomeFile();
        } else {
            console.log("Welcome Channel functionality not configured. Skipping.")
        }
    }

    private checkForWelcomeChannel = () => {

    }

    private checkForWelcomeFile = () => {

    }

    private getWelcomeChannel = () => {
        this.welcomeChannel = this.configService.returnConfiguredGeneralChannel("welcome_channel");
    }

    //Char length, etc
    private verifyWelcomeMessage = () => {
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