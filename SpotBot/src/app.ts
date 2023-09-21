import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

import { commandHandler } from './hooks';
import { constructLeaveMessage, constructWelcomeMessage } from './app.services';
import { getLogChannelIdFromClient } from './services/logger';
import { ConfigurationHandler } from './services/configurationHandler';

dotenv.config();
const CLIENT = new Discord.Client();
let GUILD: Discord.Guild;
let configHandler: ConfigurationHandler;
const COMMAND_PREFIX: string = ';;';

const app = async () => {

    configHandler = new ConfigurationHandler(CLIENT); //TODO: This should be available via dependancy injection. Figure out how to do that in Node.

    GUILD = await configHandler.loadGuild(CLIENT);
    configHandler.ensureLogChannelExists();
    configHandler.checkForInitialConfiguration();
}

CLIENT.on('ready', () => {
    if (!(process.env.NODE_ENV || 'development')) {
        getLogChannelIdFromClient(CLIENT).send(
            `${CLIENT.user.username} has logged in!`
        )
    }

    console.log(`${CLIENT.user.username} has logged in.`)

    app();
})

//Listening for commands
CLIENT.on('message', async (message) => {
    //TODO!!!! SANITIZE THIS INPUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot)
        return

    if (message.content.startsWith(COMMAND_PREFIX))
        await commandHandler(COMMAND_PREFIX, CLIENT, message)
})

// Hotfix requested by admins
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
        ) as Discord.TextChannel

        // TODO: Allow welcome message to be set via config
        let welcomeMessage = constructWelcomeMessage(member, CLIENT)

        welcomeChannel.send(welcomeMessage)
    }
)

// Hotfix requested by admins
// TODO: add tests, clean up
CLIENT.on(
    'guildMemberRemove',
    (member: Discord.GuildMember | Discord.PartialGuildMember) => {
        const adminRoleIdFromServer = CLIENT.guilds.cache
            .get(member.guild.id)
            .roles.cache.find((r) => r.name == 'Admin').id

        getLogChannelIdFromClient(CLIENT).send(
            constructLeaveMessage(member, adminRoleIdFromServer)
        )
    }
)

CLIENT.login(process.env.SPOTBOT_TOKEN)
