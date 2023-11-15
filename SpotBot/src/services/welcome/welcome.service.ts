import * as Discord from 'discord.js'
import { LogService } from '../log.service'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class WelcomeService {

    // Getter? Setter?
    welcomeChannelId: string;
    welcomeMessage: string;

    constructor() {
        this.checkForWelcomeFile();
    }

    private checkForWelcomeChannel = () => {

    }

    private checkForWelcomeFile = () => {

    }

    private getWelcomeChannelId = () => {
        
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