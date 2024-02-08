import * as Discord from 'discord.js'
import { LogService } from '../log.service'
import { autoInjectable } from 'tsyringe'
import { ConfigurationService } from '../configuration/configuration.service';
import { IChannel } from '../../interfaces/IConfig';
import { FileService } from '../file.service';
const fs = require('fs');

@autoInjectable()
export class WelcomeService {
    private fileService: FileService;
    private configService: ConfigurationService;
    // Getter? Setter?
    welcomeChannel: IChannel;
    welcomeMessage: string;

    constructor(configService: ConfigurationService, fileService: FileService) {
        this.configService = configService;
        this.fileService = fileService;
    }

    public startUpWelcomeService = async () => {
        await this.getWelcomeChannel();

        if (this.welcomeChannel.configured) {
            this.ensureWelcomeFileExists(false);
            console.log(`UNNEEDED LOG REMOVE LATER; Returned welcome channel with id: ${this.welcomeChannel.id}`);
        } else {
            console.log("UNNEEDED LOG REMOVE LATER; Welcome Channel functionality not configured. Skipping.");
        }
    }

    private checkForWelcomeChannel = () => {

    }

    private ensureWelcomeFileExists = (forceSetup: boolean) => {
        this.fileService.ensureTemplatedJsonFileExists('welcome_message', forceSetup);
    }

    private getWelcomeChannel = async () => {
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