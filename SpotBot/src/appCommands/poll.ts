import { Message } from "discord.js";

export class Poll {
    
    pollChannelId: string;

    constructor() {
        
    }

    public startPoll = async (message: Message, messageContent: string) => {
        if(!messageContent.includes('<#') && !messageContent.includes('>')) {
            console.log('No additional poll command params');
            this.pollChannelId = message.channel.id;
        } else {
            this.pollChannelId = messageContent.replace(/[^0-9]/g,''); 

            if (message.guild.channels.cache.find(c => c.id === this.pollChannelId) === undefined) {
                message.channel.send("Unable to find a channel that matches. Please try again.");
                return;
            }
        }

        message.channel.send(`On it! I'll use <#${this.pollChannelId}> for the poll.\r\nEnter 'quit-poll' to abandon this poll at any time.`);

        await this.getPollContent(message);
    }

    private getPollContent = async (message: Message) => {

    }

}