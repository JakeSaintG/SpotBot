import { commandHandler } from './hooks'

import * as Discord from 'discord.js'
import * as dotenv from 'dotenv'
import { constructLeaveMessage } from './app.services'

dotenv.config()
const client = new Discord.Client()

//Messages will use ";;" to indicate a command. ex: ";;message" or "";;raid"
const COMMAND_PREFIX: string = ';;'

client.on('ready', () => {
    console.log(`${client.user.username} has logged in.`)
})

//Listening for commands
client.on('message', async (message) => {
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot)
        return
    if (message.content.startsWith(COMMAND_PREFIX)) {
        await commandHandler(COMMAND_PREFIX, client, message)
    }
})

// Hotfix requested by admins
// TODO: add tests, clean up
// client.on('guildMemberAdd', (member) => {
//     //TODO: Allow admin to set welcome channel via command
//     const welcomeChannel = client.channels.cache.find(
//         (channel: Discord.TextChannel) => channel.name === 'member-welcome'
//     ).id;
    
//     (client.channels.cache.get(welcomeChannel) as Discord.TextChannel).send(
//         `${member.user.tag} joined!`
//     )
// })


// Hotfix requested by admins
// TODO: add tests, clean up
client.on('guildMemberRemove', (member) => {
    //TODO: Allow admin to set leave channel via command

    const logChannel = client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'bot-logs'
    ).id
    const server = client.guilds.cache.get(member.guild.id)
    const adminRoleId = server.roles.cache.find((r) => r.name == 'Admin').id

    let leaveMessage = constructLeaveMessage(member, adminRoleId);
    
    (client.channels.cache.get(logChannel) as Discord.TextChannel).send(leaveMessage);
})

client.login(process.env.SPOTBOT_TOKEN);