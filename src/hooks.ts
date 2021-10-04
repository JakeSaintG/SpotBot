import * as Discord from 'discord.js';
import { Client, Message, Permissions, TextChannel, VoiceChannel } from 'discord.js';
import { helloKeywords, adminKeywords, adminCommands } from '../admin/commands';


export async function commandHandler(COMMAND_PREFIX: string, client: Client, message: Message) {
    const [COMMAND_NAME, ...arg] = message.content
        .trim()
        .substring(COMMAND_PREFIX.length)
        .split(/\s+/);

    try { 
        if (helloKeywords.includes(COMMAND_NAME)) {           
            console.log(`${message.member.user.tag} used admin command "${COMMAND_NAME}"`) 
            adminCommands(message, COMMAND_NAME, arg)        
        }
        if (adminKeywords.includes(COMMAND_NAME) && message.member.roles.cache.some(role => role.name === 'Admin')) {
            console.log(`${message.member.user.tag} used admin command "${COMMAND_NAME}"`)           
            adminCommands(message, COMMAND_NAME, arg);                  
        }

    } catch (error) {
        const embed = new Discord.MessageEmbed()
        .setDescription(`An unknown error occurred`)
        .addField('Error', error.message);
      message.channel.send(embed);
      throw error;
    }
}