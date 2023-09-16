import * as Discord from 'discord.js';
import { IConfig } from '../interfaces/IConfig';
import * as Configuration from './individualConfigurations';
const fs = require('fs');


export class ConfigurationHandler {
    //todo: use IConfig interface
    public config: IConfig;
    private client: Discord.Client;
    private guild: Discord.Guild;
    private affrimFilter = (m: any) => m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no');
    
    public constructor(client: Discord.Client) {
        this.client = client;
        this.loadConfig();
    };

    public loadConfig = (): void => {
        this.config = JSON.parse(fs.readFileSync('./config_dev.json', 'utf8'));
    };

    public loadConfigAsync = async (): Promise<void> => {
        await fs.readFile('./config_dev.json', 'utf8', (error: any, data: string) => {
            if (error) {
                console.log(error);
                return;
            }
            this.config = JSON.parse(data);
        })
    };

    public updateConfig = (): void => {
        fs.writeFileSync('./config_dev.json', JSON.stringify(this.config, null, 2));
    };

    public updateConfigAsync = (): void => {
        fs.writeFile('./config_dev.json', JSON.stringify(this.config, null, 2), (e: Error) => {
            if (e)
                console.log("Error updating config file.");
            else {
                console.log("Config file written successfully.");
            }
        });
    };

    private deleteConfigChannelWithTimeout = (configChannel: Discord.TextChannel, timeout: number) => {
        setTimeout(() => {
            console.log("Checking if channel exists...");
            const checkForConfigChannel = this.guild.channels.cache.find((channel: Discord.TextChannel) => channel.id === configChannel.id);
            
            if(checkForConfigChannel) {
                console.log("Deleteing config channel.");
                configChannel.delete('Deleting bot configuration channel.');
            } else {
                console.log("Config channel deleted by hand. Nothing to delete.");
            }
        }, timeout);
    }

    public checkForInitialConfiguration = async () => {
        /*
        Check config, if log channel not saved, generate log channel, save to config
        Check config, if command channel not saved, generate command channel, save to config
        */
        
        if(!this.config.initial_configuration)
        {
            console.log("Initial configuration not set. Launching config text channel.");

            let allowConfig = false;
            this.guild = this.client.guilds.cache.first();
            const configChannelNameString = `bot_config_${new Date().toISOString()}`;
            this.generateSpotBotCategory();

            const configChannel = await this.guild.channels.create(configChannelNameString, { 
                reason: 'For bot configuration',   
                permissionOverwrites: [
                    {
                        id: this.guild.roles.highest,
                        allow: ['VIEW_CHANNEL']
                    },
                    {
                        id: this.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    }
                ], })
                .catch(console.error) as Discord.TextChannel;

            configChannel.send(`Hey, ${this.guild.roles.highest}, the SpotBot initial configuration has not set.\r\nWould you like to start setup?\r\nRespond "yes" or "no".\r\n\r\nDO NOT DELETE THIS CHANNEL MANUALLY.`);
            
            await configChannel.awaitMessages(this.affrimFilter, { max: 1, time: 300000, errors: ['time']})
                .then((collected) => {
                    if (collected.first().content.toLowerCase().includes('yes')) {
                        configChannel.send(`Beginning configuration...\r\n`);
                        allowConfig = true;
                    } else {
                        configChannel.send(`That's okay! Maybe later. You may be prompted with this option again the next time the bot starts up.`);
                        configChannel.send(`This channel will be auto-deleted in 1 minute. Feel free to delete this channel manually now if you wish.`);
                        console.log(`Configuration postponed by ${collected.first().author.tag}.`);
                        this.deleteConfigChannelWithTimeout(configChannel, 60000);
                    }
                })
                .catch(() => {
                    console.log(`Configuration timed out...`);
                    configChannel.send(`${this.guild.roles.highest}. No answer after 5 minutes, operation canceled.\r\nThis channel will be auto-deleted in 1 minute.`);
                    this.deleteConfigChannelWithTimeout(configChannel, 60000);
                });

            if (allowConfig) this.beginInitialConfiguration(configChannel);
        };
    };

    private beginInitialConfiguration = async (configChannel: Discord.TextChannel) => {

        await Configuration.configurePkmnGoFeatures(configChannel).then((r: any) =>{
            this.config.configured_for_pkmn_go = r;
            this.updateConfigAsync(); 
        });
        
        await Configuration.configureWelcomeChannel(configChannel);
        await configChannel.send("Ending configuration...");
        
        // this.updateConfigLastModifiedDts();
    }

    private createGenericTextChannel = async (channelName: string, permissions: any[] ) => {
        //May need to alter what I'm returning
        
        return await this.guild.channels.create(channelName, { 
            reason: 'For bot configuration',   
            permissionOverwrites: []
        }).catch(console.error) as Discord.TextChannel;
    }

    private generateSpotBotCategory = async () => {
        if (this.config.spotbot_category_id != null) {
            return;
        }

        const spotbotCategory = await this.guild.channels.create("SpotBot", {type: "category", permissionOverwrites: [
            {
                id: this.guild.roles.highest.id,
                allow: ['VIEW_CHANNEL']
            },
            {
                id: this.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL']
            }
        ]});

        this.config.spotbot_category_id = spotbotCategory.id;
        this.updateConfigAsync();
    }

    private generateLogChannel = () => {
        // admin view only
    }

    public ensureLogChannelExists = () => {
        //Run before logging to the channel
        //check for log channel that is saved to config.json
        //If not exist, generateLogChannel(), save it to json
    }

    private generateCommandChannel = () => {
        // admin view only
    }

    public ensureCommandChannelExists = () => {
        //Run on start up. No need to be as strict as the log channel...the commands can be done from most everywhere.
        //check for command channel that is saved to config.json
        //If not exist, generateCommandChannel(), save it to json
    }

    private updateConfigLastModifiedDts = () => {
        this.config.initial_configuration = true;
        this.config.config_last_modified_dts = new Date();
        this.updateConfig();
        this.loadConfigAsync();
    };

    public configurationCommand = () => {
        // allow for rerunning initial configuration
        // allow for configuring welcome message
    }
}

module.exports = {ConfigurationHandler};
// initial configuration
    // If not, create spotbot-config text channel

            //Do you have a "{{EXAMPLE_SERVER}}" channel? If yes, type "yes" and tag the channel. If no, type either "no" or "no generate" for Spotbot to create a default one.
                // Yes: save channel name and ID to config.json, updates "configured" to true
                // No: updates "configured" to false
                // No generate
            // Roles:
                // if go, ask go questions in addition to general
                // Check for team roles
                    // ex: check roles if contain "valor", save it in config
                    // "No team-specific roles were found. Would you like to create them?
                // create
//update channel details
    // ex: add maid rain channel, main announcements channel, etc.

    
//generate config file if not exist

//be able to migrate config.json
    // use the config-last-modified-dts in config.json to determine if a migration is needed

// be able to update configuration
    // What would you like to configure? Type: "channels", "roles"
        // channel: Which channel would you like to configure? (Show two lists. Already configured channels will be listed under "Update". Not yet configured channels will be under "Add") 
        