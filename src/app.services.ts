import * as Discord from 'discord.js'

export const constructLeaveMessage = (
    member: Discord.GuildMember | Discord.PartialGuildMember,
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
