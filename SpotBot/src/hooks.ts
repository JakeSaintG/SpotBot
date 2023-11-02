import * as Discord from 'discord.js'
import { Client, Message } from 'discord.js'
import { routeHelpCommands, helpKeywords } from './help/routeHelpCommands'

export async function commandHandler(
    client: Client,
    message: Message,
    command: string,
    messageContent: string
) {

    try {

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
