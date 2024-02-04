import * as Discord from 'discord.js'

export class AppService {

    constructor() {}

    extractCommand = (message: Discord.Message, commandPrefix: string) => {
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



// This is SUPER TEMPORARY!
// TODO: Remove hard coded welcome message
// TODO: Allow admin to set welcome image via ;;configure -welcome arg
// TODO: Allow stored configurations to be stored as a file
export const constructWelcomeMessage = (
    member: Discord.GuildMember | Discord.PartialGuildMember,
    client: Discord.Client
) => {

    // TODO: check if configured. if not, do nothinig.
    const welcomeUser = `Hey <@${member.user.id}>, welcome to ${client.guilds.cache.first().name}!`;
    //In the future, this will be assigned to a welcome message that the user can configure
    const customWelcome = hardCodedWelcome(client);

    return `
${welcomeUser}

${customWelcome}`

}

const hardCodedWelcome = (client: Discord.Client): string => {

    // These fields are super hacked together and are delicate...this is temporary
    const rules = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'rules'
    ).id;

    const roster = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'roster'
    ).id;

    const friendCodes = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'friend-codes'
    ).id;

    const questions = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'questions'
    ).id;

    const events = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'events'
    ).id;

    const flex = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'flex-📷'
    ).id;

    const trades = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'trades'
    ).id;

    const communityDay = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'community-day'
    ).id;

    const research = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'research'
    ).id;

    const chat = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'chat'
    ).id;

    return `Thanks for joining us! We are so happy you are here!

Here are just a couple of things to help get you started:
• Please read our <#${rules}> thoroughly, and go to the <#${roster}> to tell us your name and what team you're on in Pokémon GO.
• Post in <#${friendCodes}>, and let us know your code and game name so we can add you. 
• We raid often! Check the raid channels for your respective location and tap your way to victory! 
• Feel free to ask <#${questions}>.
• If you see a news on an upcoming event, and it has not been posted, then please share in <#${events}>. 

Check out these other channels too!
• <#${flex}>, <#${trades}>, <#${communityDay}>, <#${research}>, <#${chat}> 

Don't want certain notifications? 𝐅𝐄𝐄𝐋 𝐅𝐑𝐄𝐄 𝐓𝐎 𝐌𝐔𝐓𝐄.
• Text channels can be muted individually if you aren't interested in a specific topic.
• Server notifications can be managed by hitting the 🛎️ icon in the upper right-hand corner.

ENJOY!!!`
};

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
