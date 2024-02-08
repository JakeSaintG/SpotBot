import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Lifecycle, container } from 'tsyringe';
import {
    AppService,
    constructLeaveMessage,
    constructWelcomeMessage,
} from './app.service';
import { LogService } from './services/log.service';
import { FileService } from './services/file.service';
import { ConfigurationService } from './services/configuration/configuration.service';
import { MessageService } from './services/message/message.service';
import { PingService } from './services/ping/ping.service';
import { HelpService } from './services/help/help.service';
import { WelcomeService } from './services/welcome/welcome.service';

dotenv.config();
const CLIENT = container.resolve(Discord.Client);
const appService = container.resolve(AppService);
const configService = container.resolve(ConfigurationService);
const logService = container.resolve(LogService);
const helpService = container.resolve(HelpService);
const messageService = container.resolve(MessageService);
const pingService = container.resolve(PingService);
const welcomeService = container.resolve(WelcomeService);
const fileService = container.resolve(FileService);

const COMMAND_PREFIX: string = ';;';
let GUILD: Discord.Guild;

// MAIN APP ENTRY POINT.
CLIENT.on('ready', async () => {
    GUILD = await configService.loadGuild(CLIENT);    
    
    //FEATURE TOGGLED FOR NOW
    if (process.env.ALLOW_BETA_FEATURES) {
        
        await configService.checkForInitialConfiguration();
        await welcomeService.startUpWelcomeService();
        await logService.ensureLogChannelExists();
    }

    if (!(process.env.NODE_ENV || 'development')) {
        logService
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

        if (helpService.helpKeywords.includes(command)) {
            helpService.handleHelpCommand(command, message, messageConent);
            return;
        }

        console.log(`User ${message.author.tag} attempted to use an unknown command.`);
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

        logService
            .getLogChannelIdFromClient(CLIENT)
            .send(constructLeaveMessage(member, adminRoleIdFromServer));
    }
);

CLIENT.login(process.env.SPOTBOT_TOKEN);
