import {TextChannel, Message, Client}from 'discord.js'
import { autoInjectable } from 'tsyringe';

//TODO: save log channel id to file as part of configuration 
    // If there's no channel name that contains "logs" and one has not been configured; CREATE IT!
        // Only admins can see it
        // Tag highest role and them know that the log channel was created, can be move, or reconfigured
@autoInjectable()
export class LogService {
    /**
     *
     */
    constructor() {

        
    }

    private generateLogChannel = () => {
        // admin view only
    }

    public ensureLogChannelExists = () => {
        console.log("ensuring log channel exists..."); //Remove later
        
        //Run before logging to the channel
        //check for log channel that is saved to config.json
        //If not exist, generateLogChannel(), save it to json
    }

    public getLogChannelIdFromMessage = (message: Message): TextChannel => {
        //pull from config file eventually
        return message.guild.channels.cache.get(message.guild.channels.cache.find(
            (channel: TextChannel) => channel.name === 'bot-logs'
        ).id) as TextChannel;
    };
    
    public getLogChannelIdFromClient = (client: Client): TextChannel => {
        //pull from config file eventually
        return client.channels.cache.get(client.channels.cache.find(
            (channel: TextChannel) => channel.name === 'bot-logs'
        ).id) as TextChannel
    };
}

