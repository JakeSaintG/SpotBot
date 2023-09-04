import * as Discord from 'discord.js'
import { Client, Message } from 'discord.js'
import { adminKeywords, routeAdminCommands } from './admin/routeAdminCommands'
import { helloKeywords, userCommands } from './hello/commands'
import { routeHelpCommands, helpKeywords } from './help/routeHelpCommands'

export async function commandHandler(
    COMMAND_PREFIX: string,
    client: Client,
    message: Message
) {
    const COMMAND_NAME = message.content
        .trim()
        .substring(COMMAND_PREFIX.length)
        .split(/\s+/)[0];

    const messageContent = message.content.substring(
        COMMAND_PREFIX.length +
            message.content.indexOf(`;;${COMMAND_NAME}`) +
            COMMAND_NAME.length +
            1
    );

    try {
        //Handles commands used to get a greeting from SpotBot
        if (helloKeywords.includes(COMMAND_NAME)) {
            console.log(`${message.member.user.tag} used command: ${COMMAND_NAME}`);
            userCommands(message, COMMAND_NAME, messageContent)
        }
        //Handles commands for use by server Admins only
        if (
            adminKeywords.includes(COMMAND_NAME) &&
            message.member.roles.cache.some((role) => role.name === 'Admin')
        ) {
            console.log(`${message.member.user.tag} used admin command: ${COMMAND_NAME}`);
            routeAdminCommands(message, COMMAND_NAME, messageContent, client)
        }

        //Handles help commands.
        if (helpKeywords.includes(COMMAND_NAME)) {
            console.log(`${message.member.user.tag} used user command: ${COMMAND_NAME}`);
            routeHelpCommands(message, COMMAND_NAME, messageContent, client);
        }
    } catch (error) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`An unknown error occurred`)
            .addField('Error', error.message);
        message.channel.send(embed);
    }
}
