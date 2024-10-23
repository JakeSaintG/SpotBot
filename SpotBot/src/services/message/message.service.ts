import {Message, Attachment, TextBasedChannel, TextChannel} from 'discord.js';
import { LogService } from '../log.service';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class MessageService {
    logger: LogService;

    constructor(logService: LogService) {
        this.logger = logService;
    }

    public handleMessageCommand = (
        message: Message,
        messageContent: string
    ) => {
        if (message.reference) {
            this.replyToMessage(message, messageContent);
        } else {
            this.messageFromChannel(message, messageContent);
        }
    };

    private messageFromChannel = (
        message: Message,
        messageContent: string
    ) => {
        const channel: TextChannel = message.channel as TextChannel;
        
        const authorId = structuredClone(message.author.id);
        message.delete();
        
        let msgChannelId = message.channel.id;
        let potentialChannelArg = messageContent.substring(0, (`<#${msgChannelId}>`).length)

        if(potentialChannelArg.includes('<#') && potentialChannelArg.includes('>')) {
            msgChannelId = potentialChannelArg.replace(/[^0-9]/g,''); 
            messageContent = messageContent.substring((`<#${msgChannelId}>`).length + 1);

            if (message.guild.channels.cache.find(c => c.id === msgChannelId) === undefined) {
                channel.send("Unable to find a channel that matches. Please try again.");
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

        (message.guild.channels.cache.find(c => c.id === msgChannelId) as TextChannel)
            .send({content: messageContent, files: message.attachments.map(a => a)});
    };

    private replyToMessage = (       
        message: Message,
        messageContent: string
    ) => {
        const authorId = structuredClone(message.author.id);
        message.delete();

        if (message.attachments.size == 0 && messageContent.length == 0) {
            this.logger
                .getLogChannelIdFromMessage(message)
                .send(
                    `Hey, <@${authorId}>. The \`;;message\` command requires either a message or an attachment.`
                );
            return;
        }

        (message.guild.channels.cache.find(c => c.id === message.channelId) as TextBasedChannel)
            .messages.cache.find(m => m.id == message.reference.messageId)
            .reply({content: messageContent, files: message.attachments.map(a => a)});
    }
}
