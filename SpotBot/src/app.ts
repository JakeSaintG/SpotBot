import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { commandHandler } from './hooks';
import {
    AppService,
    constructLeaveMessage,
    constructWelcomeMessage,
} from './app.service';
import { LogService } from './services/log.service';
import { ConfigurationService } from './services/configuration/configuration.service';
import { MessageService } from './services/message/message.service';
import { PingService } from './services/ping/ping.service';

dotenv.config();
const CLIENT = container.resolve(Discord.Client);
const appService = container.resolve(AppService);
const configHandler = container.resolve(ConfigurationService);
const logger = container.resolve(LogService);
const messageService = container.resolve(MessageService);
const pingService = container.resolve(PingService);

const COMMAND_PREFIX: string = ';;';

let GUILD: Discord.Guild;
/*
    TODO: chase down the passed-in logger and use DI instead (all the way down)
        - commandHandler is available from './hooks'
        - Maybe make it a class 'commandService' to allow for DI of logger and a few other things
*/

// MAIN APP ENTRY POINT.
CLIENT.on('ready', async () => {
    GUILD = await configHandler.loadGuild(CLIENT);

    //FEATURE TOGGLE
    if (process.env.ALLOW_BETA_FEATURES) {
        logger.ensureLogChannelExists();
        configHandler.checkForInitialConfiguration();
    }

    if (!(process.env.NODE_ENV || 'development')) {
        logger
            .getLogChannelIdFromClient(CLIENT)
            .send(`${CLIENT.user.username} has logged in!`);
    }

    console.log(`${CLIENT.user.username} has logged in.`);
});

// LISTENING FOR COMMANDS
CLIENT.on('message', async (message) => {
    //TODO!!!! SANITIZE THIS INPUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot)
        return;

    if (message.content.startsWith(COMMAND_PREFIX)) {
        const [command, messageConent] = appService.extractCommand(
            message,
            COMMAND_PREFIX
        );

        if (
            command == 'message' &&
            message.member.roles.cache.some(
                (role) => role.name === GUILD.roles.highest.name
            )
        ) {
            console.log(`${message.member.user.tag} used command: ${command}`);
            messageService.handleMessageCommand(message, messageConent);
            return;
        }

        if (pingService.pingKeywords.includes(command)) {
            
            pingService.handlePing(command, message, messageConent);
            return;
        }

        await commandHandler(CLIENT, message, command, messageConent);
    }
});

// Hotfix requested by admins..tech debt
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
        welcomeChannel.send(constructWelcomeMessage(member, CLIENT));
    }
);

// Hotfix requested by admins..tech debt
// TODO: add tests, clean up
CLIENT.on(
    'guildMemberRemove',
    (member: Discord.GuildMember | Discord.PartialGuildMember) => {
        const adminRoleIdFromServer = CLIENT.guilds.cache
            .get(member.guild.id)
            .roles.cache.find((r) => r.name == 'Admin').id;

        logger
            .getLogChannelIdFromClient(CLIENT)
            .send(constructLeaveMessage(member, adminRoleIdFromServer));
    }
);

CLIENT.login(process.env.SPOTBOT_TOKEN);
