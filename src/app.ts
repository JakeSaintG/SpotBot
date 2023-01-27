import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

import { commandHandler } from './hooks';
import { constructLeaveMessage, constructWelcomeMessage } from './app.services';
import { getLogChannelIdFromClient } from './services/logger';

dotenv.config()
const client = new Discord.Client()

//Messages will use ";;" to indicate a command. ex: ";;message" or "";;raid"
const COMMAND_PREFIX: string = ';;'

client.on('ready', () => {
    getLogChannelIdFromClient(client).send(`${client.user.username} has logged in!`);
    console.log(`${client.user.username} has logged in.`);
})

//Listening for commands
client.on('message', async (message) => {
    //TODO!!!! SANITIZE THIS INPUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot)
        return
    if (message.content.startsWith(COMMAND_PREFIX)) {
        await commandHandler(COMMAND_PREFIX, client, message)
    }
})

// Hotfix requested by admins
// TODO: add tests, clean up
client.on('guildMemberAdd', (member) => {
    //TODO: Allow admin to set welcome channel via command
    const welcomeChannel = client.channels.cache.get(client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'member-welcome'
    ).id) as Discord.TextChannel;

    // TODO: Allow welcome message to be set via config
    let welcomeMessage = constructWelcomeMessage(member, client);
    
    welcomeChannel.send(welcomeMessage);
})

// Hotfix requested by admins
// TODO: add tests, clean up
client.on('guildMemberRemove', (member) => {
    const adminRoleIdFromServer = client.guilds.cache.get(member.guild.id).roles.cache.find((r) => r.name == 'Admin').id;
    getLogChannelIdFromClient(client).send(constructLeaveMessage(member, adminRoleIdFromServer));
})

client.login(process.env.SPOTBOT_TOKEN);