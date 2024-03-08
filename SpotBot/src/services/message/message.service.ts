import {Message, Attachment} from 'discord.js';
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
        // TODO: Get message TO channel up an running if the message string starts with a channel ID
        if (true /*channel id*/) {
            this.messageFromChannel(message, messageContent);
        }
    };

    private messageFromChannel = (
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

        message.channel.send({content: messageContent, files: message.attachments.map(a => a)});
    };

    messageToChannel = () => {};
}
