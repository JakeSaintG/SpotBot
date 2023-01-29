import * as Discord from 'discord.js'

//TODO: save log channel id to file as part of configuration 
    // If there's no channel name that contains "logs" and one has not been configured; CREATE IT!
        // Only admins can see it
        // Tag highest role and them know that the log channel was created, can be move, or reconfigured

// TODO: Make this a static class if possible (I miss C#...)

export const getLogChannelIdFromMessage = (message: Discord.Message): Discord.TextChannel => {
    //pull from config file eventually
    return message.guild.channels.cache.get(message.guild.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'bot-logs'
    ).id) as Discord.TextChannel;
};

export const getLogChannelIdFromClient = (client: Discord.Client): Discord.TextChannel => {
    //pull from config file eventually
    return client.channels.cache.get(client.channels.cache.find(
        (channel: Discord.TextChannel) => channel.name === 'bot-logs'
    ).id) as Discord.TextChannel
};