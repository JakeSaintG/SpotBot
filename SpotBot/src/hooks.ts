import * as Discord from 'discord.js'
import { Client, Message } from 'discord.js'
import { helloKeywords, userCommands } from './hello/commands'
import { routeHelpCommands, helpKeywords } from './help/routeHelpCommands'

export async function commandHandler(
    client: Client,
    message: Message,
    command: string,
    messageContent: string
) {

    try {
        //Handles commands used to get a greeting from SpotBot
        if (helloKeywords.includes(command)) {
            console.log(`${message.member.user.tag} used command: ${command}`);
            userCommands(message, command, messageContent)
        }

        //Handles help commands.
        if (helpKeywords.includes(command)) {
            console.log(`${message.member.user.tag} used user command: ${command}`);
            routeHelpCommands(message, command, messageContent, client);
        }
    } catch (error) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`An unknown error occurred`)
            .addField('Error', error.message);
        message.channel.send(embed);
    }
}
