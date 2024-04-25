import { LogService } from '../log.service'
import { singleton } from 'tsyringe'
import { ConfigurationService } from '../configuration/configuration.service';
import { IChannel } from '../../interfaces/IConfig';
import { FileService } from '../file.service';
import { AppService } from '../../app.service';
import { IWelcomes } from '../../interfaces/IWelcomes';
import { CacheType, CommandInteractionOption, GuildMember, GuildTextBasedChannel, Message, TextChannel, User } from 'discord.js';

@singleton()
export class WelcomeService {
    private fileService: FileService;
    private configService: ConfigurationService;
    private appService: AppService;

    private welcomeJson: IWelcomes;

    // Getter? Setter?
    private welcomeChannel: IChannel;

    constructor(configService: ConfigurationService, fileService: FileService, appService: AppService) {
        this.configService = configService;
        this.fileService = fileService;
        this.appService = appService;
        this.ensureWelcomeFileExists(false);
        this.getWelcomeJson();
    }

    public startUpWelcomeService = async () => {
        await this.getWelcomeChannelFromConfig();

        if (this.welcomeChannel.configured && this.checkForServerWelcomeChannel()) {
            this.ensureWelcomeFileExists(false);
        } else {
            console.log('Welcome Channel functionality was either not configured or the server channel was removed. Skipping.');
        }
    }

    private checkForServerWelcomeChannel = () => {
        let serverWelcomeChannel = this.appService.guild.channels.cache.find(
            channel => channel.id === this.welcomeChannel.id
        )

        if(serverWelcomeChannel) return true;

        return false;
    }

    private getWelcomeJson = () => {
        this.welcomeJson = this.fileService.getJsonFileContents('welcome_message');
    }

    private ensureWelcomeFileExists = (forceSetup: boolean) => {
        this.fileService.ensureTemplatedJsonFileExists('welcome_message', forceSetup);
    }

    private getWelcomeChannelFromConfig = async () => {
        this.welcomeChannel = await this.configService.returnConfiguredGeneralChannel('welcome_channel');
    }

    public postWelcomeMessage = ( member: GuildMember  ) => {
        if (this.welcomeJson.custom_channel_welcome_message === null || this.welcomeJson.custom_channel_welcome_message === undefined) {
            
            (this.appService.guild.channels.cache.get(
                this.appService.guild.channels.cache.find(c => c.id === this.welcomeChannel.id).id
            ) as TextChannel).send(`Hey <@${member.id}>!\r\n\r\n${this.welcomeJson.default_channel_welcome_message}`);

            return;
        }

        (this.appService.guild.channels.cache.get(
            this.appService.guild.channels.cache.find(c => c.id === this.welcomeChannel.id).id
        ) as TextChannel).send(`Hey <@${member.id}>, welcome to ${this.appService.guild.name}!\r\n\r\n${this.welcomeJson.custom_channel_welcome_message}`);
    }

    //Char length, etc
    private validateWelcomeMessage = (message: string): boolean => {
        if (message.length < 2000 ) {
            return true;
        }
        /*
            check for emoji that Bot may not have access to.
            misc other checks?
        */
    }

    public setWelcomeMessage = async (
        channel: GuildTextBasedChannel, 
        author: User, 
        skipPrompt: CommandInteractionOption<CacheType>
    ) : Promise<string> => {
        const failedValidation = '**Welcome message verification failed!** '+
        'Ensure that your welcome message is less than 2000 characters and doesn\'t contain emoji from other servers.';
        
        if (skipPrompt) {
            if (this.validateWelcomeMessage(skipPrompt.value.toString())) {
                this.welcomeJson.custom_channel_welcome_message = skipPrompt.value.toString();
                this.fileService.updateWelcomeJson(this.welcomeJson);
                return 'Saved welcome message!';
            }

            return failedValidation;
        }

        const msgFilter = (m: Message) => m.author.id === author.id;
        
        return await channel
            .awaitMessages({ filter: msgFilter, max: 1, time: 300000, errors: ['time']})
            .then((collected) => {
                if (!this.validateWelcomeMessage(collected.first().content)) return failedValidation;
                this.welcomeJson.custom_channel_welcome_message = collected.first().content;
                this.fileService.updateWelcomeJson(this.welcomeJson);
                return 'Saved welcome message!';
            })
            .catch(() => {
                return 'An error occurred. Likely a timeout.';
            })
    }
}