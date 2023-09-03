import * as Discord from 'discord.js'
import { TextChannel } from 'discord.js';
const { createHash } = require('crypto')
const fs = require('fs');


export class ConfigurationHandler {
    //todo: use IConfig interface
    public config: any = {};
    private client: Discord.Client;
    
    public constructor(client: Discord.Client) {
        this.loadConfig();
        this.client = client;
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
        return;
    };

    public checkForInitialConfiguration = async () => {
        if(!this.config.initial_configuration)
        {
            console.log("Initial configuration not set. Launching config text channel.");
            
            const guild = this.client.guilds.cache.first(); 
            const configChannelNameString = `bot_config_${new Date().toISOString()}`;
            const adminRole = guild.roles.highest; 

            //TODO: make sure this is for admin's eyes only.
            const configChannel = await guild.channels.create(configChannelNameString, { reason: 'For bot configuration,' })
                .catch(console.error) as Discord.TextChannel;

            configChannel.send(`Hey, ${adminRole}, the SpotBot initial configuration has not set.\r\nWould you like to start setup?\r\nRespond "yes" or "no".`);
            
            const filter = (m: any) => m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no');
            
            configChannel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
                .then((collected) => {
                    if (collected.first().content.toLocaleLowerCase() == 'yes') {
                        configChannel.send(`Configuration is in alpha is not yet available. Sorry if this was misleading...\r\nPlease try again later!`);
                    } else {
                        configChannel.send(`That's okay! Maybe later. You may be prompted with this option again the next time the bot starts up.`);
                    }

                    configChannel.send(`This channel will be auto-deleted in 5min. Feel free to delete it manually if you wish.`);
                    
                    setTimeout(() => {
                        const checkForConfigChannel = guild.channels.cache.find(
                            (channel: Discord.TextChannel) => channel.id === configChannel.id
                        );
                        
                        console.log("Checking if channel exists");
                        if(checkForConfigChannel) {
                            console.log("Deleteing config channel.");
                            configChannel.delete('Deleting bot configuration channel.');
                        } else {
                            console.log("Config channel deleted by hand. Nothing to delete.");
                        }

                    }, 300000);
                    
                    return;
                })
                .catch(() => {
                    configChannel.send('No answer after 5 minutes, operation canceled.\r\nThis channel will be auto-deleted in 5min.');

                    setTimeout(() => {
                        const checkForConfigChannel = guild.channels.cache.find(
                            (channel: Discord.TextChannel) => channel.id === configChannel.id
                        );
                        
                        console.log("Checking if channel exists");
                        if(checkForConfigChannel) {
                            console.log("Deleteing config channel.");
                            configChannel.delete('Deleting bot configuration channel.');
                        } else {
                            console.log("Config channel deleted by hand. Nothing to delete.");
                        }

                    }, 300000);

                    return;
                });
        };
    };
}

module.exports = {ConfigurationHandler};
// initial configuration
    // check if initial config has happened
    // If not, create spotbot-config text channel
        // admin only
        // start asking config questions
            // Is this server for Pokemon GO or General Use?
                // if go, ask go questions in addition to general
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
        