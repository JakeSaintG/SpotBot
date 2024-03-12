import { LogService } from '../log.service'
import { singleton } from 'tsyringe'
import { ConfigurationService } from '../configuration/configuration.service';
import { IChannel } from '../../interfaces/IConfig';
import { FileService } from '../file.service';
import { AppService } from '../../app.service';
import { IWelcomes } from '../../interfaces/IWelcomes';
import { GuildMember, Message, TextChannel } from 'discord.js';

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

    private getWelcomeJson = () => {
        this.welcomeJson = this.fileService.getJsonFileContents('welcome_message');
    }

    private ensureWelcomeFileExists = (forceSetup: boolean) => {
        this.fileService.ensureTemplatedJsonFileExists('welcome_message', forceSetup);
    }

    private getWelcomeChannelFromConfig = async () => {
        this.welcomeChannel = await this.configService.returnConfiguredGeneralChannel("welcome_channel");
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
    private validateWelcomeMessage = () => {
        /*
            pass in string to verify
            check char length
            check for emoji that Bot may not have access to.
            misc other checks?
            return true if good
        */
    }

    setWelcomeMessage = (message: Message, messageContent: string) => {
        const prompt1 = message.channel.send("Please supply the message you would like to use when welcoming new members.");
        const prompt2 = message.channel.send("The next message entered by the command issuer will be saved as the welcome message.");
        
        /*
        TODO: 
            - Check if message author is premium/Nitro. If so, do prompt3
            - Add a welcome message preview and confirmation
        
        const prompt3 = "It looks like you may have Discord Nitro. Be mindful not to use any emoji's that SpotBot may not have access to.";

        */

        let prompt4: Promise<Message>;
        let prompt5: Promise<Message>;

        const msgFilter = (m: Message) => m.author.id === message.author.id;

        message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 300000, errors: ['time']})
            .then((collected) => {
                // TODO: Validate welcome message
                this.welcomeJson.custom_channel_welcome_message = collected.first().content;
                this.fileService.updateWelcomeJson(this.welcomeJson);

                prompt4 = message.channel.send("Saved welcome message!");
                
                if (!messageContent.includes('no-delete')) {
                    prompt5 = message.channel.send("Now to clean up all these messages....");

                    setTimeout(() => {
                        message.channel.messages.delete(collected.first());
                    }, 5000);
                }

            })
            .catch(() => {
                prompt4 = message.channel.send("An error occurred. Likely a timeout.");
            })
            .finally(() => {
                if (!messageContent.includes('no-delete')) {
                    setTimeout(() => {
                        prompt1.then( m => {
                            m.delete();
                        })
        
                        prompt2.then( m => {
                            m.delete();
                        })
        
                        prompt4.then( m => {
                            m.delete();
                        })

                        prompt5.then( m => {
                            m.delete();
                        })
        
                        message.delete();
                    }, 5000);
                }
            });
    }
}