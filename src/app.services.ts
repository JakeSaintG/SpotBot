import * as Discord from 'discord.js'

export const constructWelcomeMessage = (
    member: Discord.GuildMember | Discord.PartialGuildMember
) => {

    const rules = "";
    const roster = "";
    const friendCodes = "";
    const questions = "";
    const raidEast = "";
    const raidWest = "";
    const raidCental = "";
    const raidAround = "";
    const events = "";
    const flex = "";
    const trades = "";
    const communityDay = "";
    const battle = "";
    const research = "";
    const chat = "";


    let m = `
Hey ${member.user.tag}, welcome to The PokeSpot!

Thanks for joining us! We are so happy you are here!

Here are just a couple of things to help get you started:
• Please read our <#${rules}> thoroughly, and go to the <#${roster}> to tell us your name and what team you're on.
• Post in <#${friendCodes}> , and let us know your code and game name so we can add you. 
• If you're looking to post locations and/or find raids with everyone else, we have 4 locations <#${raidEast}> (Kentucky), <#${raidCental}> (Texas), <#${raidWest}> (California) and a special <#${raidAround}> (for international raids)
• Feel free to ask <#${questions}>.
• If you see a news on an upcoming event and it has not been posted, then please share in <#${events}>. 

Check out these other tabs too!
• <#${flex}>, <#${trades}>, <#${communityDay}>, <#${battle}>, <#${research}>, <#${chat}> 

If you don't want 𝐂𝐎𝐍𝐒𝐓𝐀𝐍𝐓 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍𝐒? 𝐅𝐄𝐄𝐋 𝐅𝐑𝐄𝐄 𝐓𝐎 𝐌𝐔𝐓𝐄.
• Just hit the 🛎️ icon in the upper right-hand corner.
•  or simply go to settings, notifications and mute a particular channel. 

ENJOY!!!
    `;

    //swap to m when done
    return `${member.user.tag} joined!`;
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
