import { Guild, Message, GuildMember, PartialGuildMember, REST, Client, Interaction } from 'discord.js';
import { Routes } from "discord-api-types/v9";
import { singleton } from 'tsyringe';
import { Poll } from './app_commands/poll';
import { LogService } from './services/log_service';
import commandsData from "./app_commands";
import { ICommandServices } from './interfaces/ICommandServices';

@singleton()
export class AppService {
    private logger: LogService;

    pollSetupActive = false;

    constructor(logger: LogService) {
        this.logger = logger;
    }

    private _guild: Guild;

    get guild(): Guild {
        return this._guild;
    }
    set guild(value: Guild) {
        this._guild = value;
    }

    //========================================
    //======DEPRICATION WORK IN PROGRESS======
    //========================================
    commandKeywords = ['poll'];

    public extractCommand = (message: Message, commandPrefix: string) => {
        const command = message.content
            .trim()
            .substring(commandPrefix.length)
            .split(/\s+/)[0];

        const messageContent = message.content.substring(
            commandPrefix.length +
                message.content.indexOf(`;;${command}`) +
                command.length +
                1
        );

        return [command, messageContent];
    };

    public handleAppCommand = async (
        command: string,
        message: Message,
        messageContent: string
    ) => {
        if (command.includes('poll')) {
            const poll = new Poll(this.logger, this.guild);

            if(!this.pollSetupActive) {
                this.pollSetupActive = true;
                await poll.startPoll(message, messageContent)
                    .then(() => this.pollSetupActive = false);
            }
        }
    };
    //========================================
    //======DEPRICATION WORK IN PROGRESS======
    //========================================


    public registerCommands = async (
        client: Client,
        guildId: string,
        guildName: string
    ) => {
        
        try {
            const rest = new REST({ version: "9" }).setToken(process.env.SPOTBOT_TOKEN);

            const commandsToRegister = commandsData.map((getData) => {
                return getData().toJSON();
            });
        
            await rest.put(
                Routes.applicationGuildCommands(client.user?.id || "missing id", guildId),
                { body: commandsToRegister }
            );
    
        } catch (error) {
            if (error.rawError?.code === 50001) {
                console.log(`Missing Access on guild ${guildId}: ${guildName}.`)
                return
            }
            console.log(`Register command error on ${guildId}: ${guildName}.`)
            console.log(error)
        }
    };

    public async onInteractionCreate(interaction: Interaction, commandsMap: Record<string, any>, services: ICommandServices) {
        try {
            if (!interaction.isCommand()) return;

            const Command = commandsMap[interaction.commandName];
    
            if (!Command) return;
            
            const CommandClass = new Command(interaction, services);
            await CommandClass.execute();
        } catch (error) {
            // handleInteractionError(error, interaction)
        }
    }
}

export const constructLeaveMessage = (
    member: GuildMember | PartialGuildMember,
    adminRoleId: string,
): string => {
    let nickname = '';
    let roles = '';
    const joinTime = `- Member since: ${member.joinedAt.toLocaleString()}\r`;

    if (member.nickname !== null) {
        nickname = `- Their server nickname at the time of leaving was: ${member.nickname} \r`;
    }

    roles = `- Their roles: ${member.roles.cache
        .map((r) => `${r.name.replace('@', '')}`)
        .join(', ')}`;

    return `Heads up, <@&${adminRoleId}>! It looks like ${member.user.tag} is no longer a member of the server. \r\r
Details: \r
${joinTime}${nickname}${roles}`;
};
