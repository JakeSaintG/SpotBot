import { Client, Intents, GuildMember, PartialGuildMember, Role } from 'discord.js';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { AppService, constructLeaveMessage } from './app.service';
import { LogService } from './services/log.service';
import { FileService } from './services/file.service';
import { ConfigurationService } from './services/configuration/configuration.service';
import { MessageService } from './services/message/message.service';
import { PingService } from './services/ping/ping.service';
import { HelpService } from './services/help/help.service';
import { WelcomeService } from './services/welcome/welcome.service';

dotenv.config();
const CLIENT = new Client({
    intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.MESSAGE_CONTENT,
		Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	],
});

const appService = container.resolve(AppService);
const configService = container.resolve(ConfigurationService);
const logService = container.resolve(LogService);
const helpService = container.resolve(HelpService);
const messageService = container.resolve(MessageService);
const pingService = container.resolve(PingService);
const welcomeService = container.resolve(WelcomeService);
const fileService = container.resolve(FileService);

const COMMAND_PREFIX: string = ';;';

// MAIN APP ENTRY POINT.
CLIENT.on('ready', async () => {
    console.log(`${CLIENT.user.username} has logged in to Discord.`);
    appService.guild = await configService.loadGuild(CLIENT); 
    
    await configService.checkForInitialConfiguration();
    await welcomeService.startUpWelcomeService();
    await logService.ensureLogChannelExists();

    if (!(process.env.NODE_ENV || 'development')) {
        logService
            .getLogChannelIdFromClient(CLIENT)
            .send(`${CLIENT.user.username} has logged in!`);
    }

    console.log(`${CLIENT.user.username} successfully started!`);
});

// LISTENING FOR COMMANDS
CLIENT.on('message' /*messageCreate for djs 14*/, async (message) => {
    //TODO!!!! SANITIZE THIS INPUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot)
        return;

    if (message.content.startsWith(COMMAND_PREFIX)) {
        const [command, messageContent] = appService.extractCommand(
            message,
            COMMAND_PREFIX
        );

        if (
            command == 'message' &&
            message.member.roles.cache.some(
                (role: Role) => role.name === appService.guild.roles.highest.name
            )
        ) {
            console.log(`${message.member.user.tag} used command: ${command}`);
            messageService.handleMessageCommand(message, messageContent );
            return;
        }

        if (pingService.pingKeywords.includes(command)) {
            pingService.handlePing(command, message, messageContent);
            return;
        }

        if (appService.commandKeywords.includes(command)) {
            appService.handleAppCommand(command, message, messageContent);
            return;
        }

        // TODO: handle this better
        if (
            configService.configKeywords.includes(command) && 
            message.member.roles.cache.some(
                (role: Role) => role.name === appService.guild.roles.highest.name
            )
        ) {
            if (messageContent.toLowerCase().includes('set-welcome')) {
                welcomeService.setWelcomeMessage(message, messageContent);
            } else {
                console.log("Configuration command not properly used");
            }
            return;
        }

        if (helpService.helpKeywords.includes(command)) {
            helpService.handleHelpCommand(command, message, messageContent);
            return;
        }

        console.log(`User ${message.author.tag} attempted to use an unknown command.`);
    }
});

CLIENT.on(
    'guildMemberAdd',
    (member: GuildMember ) => {
        // todo: remove temp members from temp invites getting pings
        welcomeService.postWelcomeMessage(member);
    }
);

// Requested by admins...hard coded tech debt
// TODO: add tests, clean up
CLIENT.on(
    'guildMemberRemove',
    (member: GuildMember | PartialGuildMember) => {
        const adminRoleIdFromServer = CLIENT.guilds.cache
            .get(member.guild.id)
            .roles.cache.find((r) => r.name == 'Admin').id;

        logService
            .getLogChannelIdFromClient(CLIENT)
            .send(constructLeaveMessage(member, adminRoleIdFromServer, appService.guild));
    }
);

CLIENT.login(process.env.SPOTBOT_TOKEN);
