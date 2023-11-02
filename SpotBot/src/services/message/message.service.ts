import * as Discord from 'discord.js';
import { LogService } from '../log.service';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class MessageService {
    logger: LogService;

    constructor(logService: LogService) {
        this.logger = logService;
    }

    handleMessageCommand = (
        message: Discord.Message,
        messageContent: string
    ) => {
        // TODO: Get message TO channel up an running if the message string starts with a channel ID
        if (true /*channel id*/) {
            this.messageFromChannel(message, messageContent);
        }
    };

    private messageFromChannel = (
        message: Discord.Message,
        messageContent: string
    ) => {
        const authorId = structuredClone(message.author.id);
        message.delete();

        if (messageContent.length != 0) message.channel.send(messageContent);

        if (message.attachments.size > 0) message.attachments.forEach((a) => message.channel.send(a));

        if (message.attachments.size == 0 && messageContent.length == 0) {
            this.logger
                .getLogChannelIdFromMessage(message)
                .send(
                    `Hey, <@${authorId}>. The ;;message command requires either a message or an attachment.`
                );
        }
    };

    messageToChannel = () => {};
}
