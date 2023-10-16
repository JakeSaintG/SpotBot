import * as Discord from 'discord.js';
import { IChannel, IConfig } from '../interfaces/IConfig';
import * as ConfigMessageHelpers from './configMessageHelpers';
import { LogService } from './logger';

const fs = require('fs');

export class ConfigurationHandler {
    public config: IConfig;
    private client: Discord.Client;
    private guild: Discord.Guild;
    private logger: LogService;
    private affrimFilter = (m: any) => m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no');
    
    public constructor(client: Discord.Client, logger: LogService) {
        this.client = client;
        this.logger = logger;
        this.ensureConfigExists(false);
        this.loadConfig();
    };

    public loadConfig = (): void => {
        this.config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    };

    public loadConfigAsync = async (): Promise<void> => {
        await fs.readFile('./config.json', 'utf8', (error: any, data: string) => {
            if (error) {
                console.log(error);
                return;
            }
            this.config = JSON.parse(data);
        })
    };

    public updateConfig = (): void => {
        fs.writeFileSync('./config.json', JSON.stringify(this.config, null, 2));
    };

    public updateConfigAsync = (): void => {
        fs.writeFile('./config.json', JSON.stringify(this.config, null, 2), (e: Error) => {
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

    public loadGuild = async (client: Discord.Client): Promise<Discord.Guild> => {
        
        if (this.config.guild_id == null) {
            const guildId = client.guilds.cache.first().id;
            console.log(`Saving guild ID: ${guildId} for easier retrieval later.`);
            this.config.guild_id = guildId;
            this.updateConfig();
        }

        this.guild = await client.guilds.fetch(this.config.guild_id);
        console.log(`Loading guild with id: ${this.guild.id}`);
        return this.guild;
    }

    public checkForInitialConfiguration = async () => {

        if(!this.config.initial_configuration)
        {
            console.log("Initial configuration not set. Launching config text channel.");

            let allowConfig = false;
            
            const configChannelNameString = `bot_config_${new Date().toISOString()}`;

            //await this.generateSpotBotCategory();

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

            configChannel.send(
            `Hey, ${this.guild.roles.highest}, the SpotBot initial configuration has not set. SpotBot is ready for use but some functionality may be limited until configuration is done.
            \r\nWould you like to start setup?\r\nRespond "yes" or "no".
            \r\nDO NOT DELETE THIS CHANNEL MANUALLY.`
            );
            
            await configChannel.awaitMessages(this.affrimFilter, { max: 1, time: 300000, errors: ['time']})
                .then((collected) => {
                    if (collected.first().content.toLowerCase().includes('yes')) {
                        configChannel.send(`Beginning configuration...`);
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

        await ConfigMessageHelpers.configurePkmnGoFeatures(configChannel).then((r: any) =>{
            this.config.configured_for_pkmn_go = r;
            this.updateConfigAsync();
        });
        
        // await setModeratorRole();

        await ConfigMessageHelpers.configureWelcomeChannel(configChannel).then(async (r: string) => {
            let defaults: IChannel = this.config.channels.discord_general_channels.find(e => e.default_name == "member-welcome");
            // TODO: r can be undefined....may need to think through what will happen if they bail early
            if (r == 'create') {
                console.log(`Creating welcome channel and saving it to config...`);
                await this.createTextChannelFromDefaults(defaults);
                await configChannel.send("A welcome channel has been created! Feel free organize it into a category later.");
            } else if (r.includes("<#")) {
                defaults.id = r.replace(/[^a-zA-Z0-9_-]/g,''); 
                console.log(`Saving welcome channel to config using id: ${defaults.id}`);

                const specifiedChannel = this.guild.channels.cache.find((channel: Discord.TextChannel) => channel.id === defaults.id);
                this.assignChannelFromSpecified(defaults, specifiedChannel as Discord.TextChannel);
            } else {
                return;
            }

            this.updateConfigAsync();
        });
        
        await configChannel.send("Thank you!");
        await configChannel.send("Ending configuration for now. SpotBot will become more configurable and come with new features in the future.");
        
        this.updateConfigLastModifiedDts();

        configChannel.send(`This channel will be auto-deleted in 1 minute.`);
        this.deleteConfigChannelWithTimeout(configChannel, 60000);
    }

    private setModeratorRole = () => {
        // text: Spotbot supports admin use by roles other than the highest (admin). 
        // Do you have a moderator role that you would like to grant higher level SpotBot use?
    }

    private createTextChannelFromDefaults = async (defaults: IChannel ) => {
        const newChannel = await this.guild.channels.create(defaults.default_name, {
            type: "text",
            reason: 'Bot configuration',
            topic: defaults.default_channel_topic,
            permissionOverwrites: [
                {
                    id: this.guild.roles.everyone.id,
                    allow: defaults.everyone_role_allow
                },
                {
                    id: this.guild.roles.everyone.id,
                    deny: defaults.everyone_role_deny
                }
            ]
        });

        defaults.id = newChannel.id;
        defaults.custom_channel_topic = defaults.default_channel_topic;
        defaults.name = newChannel.name;

        return defaults;
    }

    private assignChannelFromSpecified = (defaults: IChannel, specifiedChannel: Discord.TextChannel ): IChannel => {
        defaults.id = specifiedChannel.id;
        defaults.custom_channel_topic = specifiedChannel.topic;
        defaults.name = specifiedChannel.name;

        //TODO: Get clever with overwriting defaults.everyone_role_allow using specifiedChannel.permissionsFor(this.guild.roles.everyone)
        defaults.everyone_role_allow = undefined;
        defaults.everyone_role_deny = undefined;
        return defaults;
    }

    public ensureConfigExists = (forceSetup: boolean) => {
        // TODO: make available via ADMIN command (maybe)

        if (!fs.existsSync('./config.json') || forceSetup) {
            const configTemplate = JSON.parse(fs.readFileSync('./src/services/config_template.json', 'utf8'));
            
            console.log("Creating or recreating config file from template.");
            fs.writeFileSync('./config.json', JSON.stringify(configTemplate, null, 2));
        }
    }

    private generateSpotBotCategory = async () => {
        if (this.config.spotbot_category_id != null) {
            return;
        }

        const spotbotCategory = await this.guild.channels.create("SpotBot", 
            {
                type: "category", 
                permissionOverwrites: [
                    {
                        id: this.guild.roles.highest.id,
                        allow: ['VIEW_CHANNEL']
                    },
                    {
                        id: this.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ]
            });

        this.config.spotbot_category_id = spotbotCategory.id;
        this.updateConfigAsync();
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

/*
    Roles:
        if GO server, ask go questions in addition to general
        Check for team roles
            ex: check roles if contain "valor", save it in config
            "No team-specific roles were found. Would you like to create them?
        create

    be able to migrate config.json
        use the config-last-modified-dts in config.json to determine if a migration is needed

    be able to update configuration
        What would you like to configure? Type: "channels", "roles"
            channel: Which channel would you like to configure? (Show two lists. Already configured channels will be listed under "Update". Not yet configured channels will be under "Add")
*/
