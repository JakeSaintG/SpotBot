import { Client, GuildMember, PartialGuildMember, Role, GatewayIntentBits, Events } from 'discord.js';
require('dotenv').config()
import 'reflect-metadata';
import { container } from 'tsyringe';
import { AppService, constructLeaveMessage } from './app_service';
import { LogService } from './services/log_service';
import { FileService } from './services/file_service';
import { ConfigurationService } from './services/configuration/configuration_service';
import { MessageService } from './services/message/message_service';
import { WelcomeService } from './services/welcome/welcome_service';
import { PingCommand, ServerCommand, SetWelcomeCommand, ReactionCommand } from './app_commands';
import { ICommandServices } from './interfaces/ICommandServices';

const CLIENT = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
	],
});

const appService = container.resolve(AppService);
const configService = container.resolve(ConfigurationService);
const logService = container.resolve(LogService);
const messageService = container.resolve(MessageService);
const welcomeService = container.resolve(WelcomeService);
const fileService = container.resolve(FileService);

const commandsMap: Record<string, any> = {
    ping: PingCommand,
    server: ServerCommand,
    set_welcome: SetWelcomeCommand,
    reaction: ReactionCommand
}

// TODO: Stop doing Dependency injection twice...
const commandServices: ICommandServices = {
    logService: logService,
    fileService: fileService,
    welcomeService: welcomeService
}

const COMMAND_PREFIX: string = ';;';

CLIENT.on(Events.ClientReady, async () => {
    
    console.log(`${CLIENT.user.username} has logged in to Discord.`);
    appService.guild = await configService.loadGuild(CLIENT); 
    
    await configService.checkForInitialConfiguration();
    await welcomeService.startUpWelcomeService();
    await logService.ensureLogChannelExists();

    if (!(process.env.npm_lifecycle_event === 'dev')) {
        logService
            .getLogChannelIdFromClient(CLIENT)
            .send(`${CLIENT.user.username} has logged in!`);
    }

    appService.registerCommands(CLIENT, appService.guild.id, appService.guild.name);

    console.log(`${CLIENT.user.username} successfully started!`);
});

// LISTENING FOR COMMANDS
CLIENT.on(Events.MessageCreate, async (message) => {
    //TODO! SANITIZE THIS INPUT!!!!!!!!
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

        if (appService.commandKeywords.includes(command)) {
            appService.handleAppCommand(command, message, messageContent);
            return;
        }

        console.log(`User ${message.author.tag} attempted to use an unknown command.`);
    }
});

CLIENT.on(
    Events.GuildMemberAdd,
    (member: GuildMember) => {
        // todo: remove temp members from temp invites getting pings
        welcomeService.postWelcomeMessage(member);
    }
);

// Requested by admins...hard coded tech debt
// TODO: add tests, clean up
CLIENT.on(
    Events.GuildMemberRemove,
    (member: GuildMember | PartialGuildMember) => {
        console.log('leaving....')
        
        const adminRoleIdFromServer = CLIENT.guilds.cache
            .get(member.guild.id)
            .roles.cache.find((r) => r.name == 'Admin').id;

        logService
            .getLogChannelIdFromClient(CLIENT)
            .send(constructLeaveMessage(member, adminRoleIdFromServer));
    }
);

CLIENT.on(Events.InteractionCreate, interaction => {
    appService.onInteractionCreate(interaction, commandsMap, commandServices);
});

CLIENT.login(process.env.SPOTBOT_TOKEN);

process.on('SIGINT', () => {
    // Hopefully catch a Windows server update/restart...
    logService
        .getLogChannelIdFromClient(CLIENT)
        .send("Going down!");

    CLIENT.off;
});

