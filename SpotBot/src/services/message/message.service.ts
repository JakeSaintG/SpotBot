import {Message, Attachment, TextBasedChannel} from 'discord.js';
import { LogService } from '../log.service';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class MessageService {
    logger: LogService;

    constructor(logService: LogService) {
        this.logger = logService;
    }

    handleMessageCommand = (
        message: Message,
        messageContent: string
    ) => {
        this.messageFromChannel(message, messageContent);
    };

    private messageFromChannel = (
        message: Message,
        messageContent: string
    ) => {
        const authorId = structuredClone(message.author.id);
        message.delete();
        
        let msgChannelId: string;
        
        if(!messageContent.includes('<#') && !messageContent.includes('>')) {
            msgChannelId = message.channel.id;
        } else {
            msgChannelId = messageContent.replace(/[^0-9]/g,''); 
            messageContent = messageContent.substring((`<#${msgChannelId}>`).length + 1);

            if (message.guild.channels.cache.find(c => c.id === msgChannelId) === undefined) {
                message.channel.send("Unable to find a channel that matches. Please try again.");
                return;
            }
        }

        if (message.attachments.size == 0 && messageContent.length == 0) {
            this.logger
                .getLogChannelIdFromMessage(message)
                .send(
                    `Hey, <@${authorId}>. The \`;;message\` command requires either a message or an attachment.`
                );
            return;
        }

        (message.guild.channels.cache.find(c => c.id === msgChannelId) as TextBasedChannel)
            .send({content: messageContent, files: message.attachments.map(a => a)});
    };
}
