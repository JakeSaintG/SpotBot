import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

import 'reflect-metadata';
import { container } from 'tsyringe';
import { commandHandler } from './hooks';
import { constructLeaveMessage, constructWelcomeMessage } from './app.services';
import { LogService } from './services/logger';
import { ConfigurationHandler } from './services/configurationHandler';

dotenv.config();
const CLIENT = new Discord.Client();
let GUILD: Discord.Guild;
let configHandler: ConfigurationHandler;
let logger: LogService;
const COMMAND_PREFIX: string = ';;';

const app = async () => {

    /*
        TODO: chase down the passed-in logger and use DI instead (all the way down)
            - commandHandler is available from './hooks'
            - Maybe make it a class 'commandService' to allow for DI of logger and a few other things
    */

    logger = container.resolve(LogService);
    configHandler = container.resolve(ConfigurationHandler);

    GUILD = await configHandler.loadGuild(CLIENT);

    //FEATURE TOGGLE
    if (process.env.ALLOW_BETA_FEATURES) {
        logger.ensureLogChannelExists();
        configHandler.checkForInitialConfiguration();
    }
}

CLIENT.on('ready', async () => {
    await app();
    
    if (!(process.env.NODE_ENV || 'development')) {
        logger.getLogChannelIdFromClient(CLIENT).send(
            `${CLIENT.user.username} has logged in!`
        )
    }

    console.log(`${CLIENT.user.username} has logged in.`);
})

//Listening for commands
CLIENT.on('message', async (message) => {
    //TODO!!!! SANITIZE THIS INPUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot)
        return;

    if (message.content.startsWith(COMMAND_PREFIX))
        await commandHandler(COMMAND_PREFIX, CLIENT, message, logger);
})

// Hotfix requested by admins
// TODO: add tests, clean up
CLIENT.on(
    'guildMemberAdd',
    (member: Discord.GuildMember | Discord.PartialGuildMember) => {
        
        //TODO: Allow admin to set welcome channel via command
        const welcomeChannel = CLIENT.channels.cache.get(
            CLIENT.channels.cache.find(
                (channel: Discord.TextChannel) =>
                    channel.name === 'member-welcome'
            ).id
        ) as Discord.TextChannel;

        // TODO: Allow welcome message to be set via config
        let welcomeMessage = constructWelcomeMessage(member, CLIENT);

        welcomeChannel.send(welcomeMessage);
    }
)

// Hotfix requested by admins
// TODO: add tests, clean up
CLIENT.on(
    'guildMemberRemove',
    (member: Discord.GuildMember | Discord.PartialGuildMember) => {
        const adminRoleIdFromServer = CLIENT.guilds.cache
            .get(member.guild.id)
            .roles.cache.find((r) => r.name == 'Admin').id;

        logger.getLogChannelIdFromClient(CLIENT).send(
            constructLeaveMessage(member, adminRoleIdFromServer)
        )
    }
)

CLIENT.login(process.env.SPOTBOT_TOKEN);
