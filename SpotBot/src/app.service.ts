import {Guild, Message, Client, GuildMember, PartialGuildMember, TextChannel} from 'discord.js'
import { singleton } from 'tsyringe';

@singleton()
export class AppService {

    constructor() {}

    private _guild: Guild;

    get guild(): Guild {
        return this._guild;
    }
    set guild(value: Guild) {
        this._guild = value;
    }

    extractCommand = (message: Message, commandPrefix: string) => {
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

        return [command, messageContent]
    }
}



export const constructLeaveMessage = (
    member: GuildMember | PartialGuildMember,
    adminRoleId: string
): string => {
    let nickname = ''
    let lastMessage = ''
    let roles = ''

    if (member.nickname !== null) {
        nickname = `Their server nickname at the time of leaving was: ${member.nickname} \r`
    }

    if (member.lastMessage !== null) {
        lastMessage = `Last message date: ${new Date(
            member.lastMessage.createdTimestamp
        ).toLocaleDateString()} in <#${member.lastMessage.channel.id}> \r`
    }

    roles = `Their roles: ${member.roles.cache
        .map((r) => `${r.name.replace('@', '')}`)
        .join(', ')}`

    return `Heads up, <@&${adminRoleId}>! It looks like ${member.user.tag} is no longer a member of the server. \r\r
Details: \r
${lastMessage}${nickname}${roles}`
}
