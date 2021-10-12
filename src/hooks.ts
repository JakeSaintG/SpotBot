import * as Discord from 'discord.js';
import { Client, Message, Permissions, TextChannel, VoiceChannel } from 'discord.js';
import { adminKeywords, adminCommands } from '../admin/commands';
import { helloKeywords, userCommands } from '../help/commands';
import { raidKeywords, raidCommands } from '../raid/commands';

export async function commandHandler(COMMAND_PREFIX: string, client: Client, message: Message) {
    const [COMMAND_NAME, ...arg] = message.content
        .trim()
        .substring(COMMAND_PREFIX.length)
        .split(/\s+/);

    try { 
        //Handles commands used to get a greeting from SpotBot
        if (helloKeywords.includes(COMMAND_NAME)) {           
            console.log(`${message.member.user.tag} used admin command "${COMMAND_NAME}"`) //These are getting redundant and I should probably build a logger...
            userCommands(message, COMMAND_NAME, arg)        
        }
        //Handles commands for use by server Admins only
        if (adminKeywords.includes(COMMAND_NAME) && message.member.roles.cache.some(role => role.name === 'Admin')) {
            console.log(`${message.member.user.tag} used admin command "${COMMAND_NAME}"`)           
            adminCommands(message, COMMAND_NAME, arg, client);                  
        }
        //Handles raid commands.
        if (raidKeywords.includes(COMMAND_NAME)) {
            console.log(`${message.member.user.tag} used user command "${COMMAND_NAME}"`) 
            raidCommands(message, COMMAND_NAME, arg, client) 
        }
    } catch (error) {
        const embed = new Discord.MessageEmbed()
        .setDescription(`An unknown error occurred`)
        .addField('Error', error.message);
      message.channel.send(embed);
      throw error;
    }
}